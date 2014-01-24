/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , dept = require('./routes/dept')
  , user = require('./routes/user')
  , gisobj = require('./routes/gisobj')
  , commons = require('./routes/commons')
  , analysis = require('./routes/analysis')
  , auditeanalysis = require('./routes/auditeanalysis')
  , optianalysis = require('./routes/optianalysis')
  , marketanalysis = require('./routes/marketanalysis')
  , cell = require('./routes/cell')
  , proxy = require('./routes/proxy')
  , location = require('./routes/location')
  , websocket = require('./data/websocketserver')
  , http = require('http')
  , path = require('path')
  , Data = require('./mongo.js')
  , upload = require('./routes/upload')
  , sharepage = require('./sharepage')
  , logger = require('tracer').console()
  , inspect = require('util').inspect;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.engine('.html', require('ejs').__express);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//是否跳过检测用户登录状态
var skipSignin = false;
function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
    if(!skipSignin){
      req.session.error = '没有登录，限制访问！';
      res.redirect('/signin.html');  
    }else{
      //开发模式下不用登录的用户
      req.session.user = {
        "dept": "合肥移动",
        "deptId": "2",
        "name": "hefei",
        "realname": "hefei",
        "role": "lowAdmin",
        "deptobj": {
          "desc": "合肥",
          "id": "2",
          "name": "合肥移动",
          "pId": "1",
          "propertyPrefix": "HF-"
        }
      }
      next();
    }
	}
}

function apiRestrict(req, res, next){
	if (req.session.user || skipSignin) {
		next();
	} else {
		req.session.error = '没有登录，限制访问！';
    sharepage.rt(false,'没有登录，限制访问！', res);
	}
}

// test print
app.all('/test/print', restrict, function(req, res){
  var test = req.param('test');
  console.log(inspect(test));
});

app.all('/proxy', proxy.proxy);
// misc
app.get('/', restrict, routes.signin);
app.get('/signin.html', routes.signin);
app.get('/main.html', restrict, routes.main);
app.get('/gisinfo.html', restrict, routes.main);
app.get('/admin.html', restrict, routes.admin);
app.get('/project.html', restrict, routes.ongoing);
app.get('/analysis.html', restrict, routes.analysis);
app.get('/realtimeanalysis.html', restrict, routes.realtimeAnalysis);
app.get('/historyanalysis.html', restrict, routes.historyanalysis);
app.get('/auditeanalysis.html', restrict, routes.auditeanalysis);
app.get('/lateranalysis.html', restrict, routes.lateranalysis);
app.get('/optimizationanalysis.html', restrict, routes.optimizationanalysis);
app.get('/marketnanalysis.html', restrict, routes.marketnanalysis);
app.get('/datacorrection.html', restrict, routes.datacorrection);

app.get('/right.html', restrict, routes.ongoing);
app.get('/user.html', restrict, routes.ongoing);
app.get('/log.html', restrict, routes.ongoing);
app.get('/dept.html', restrict, routes.dept);
app.get('/apitest.html', restrict, routes.apitest);

//上传文件接口
app.post('/upload', restrict, upload.upload);
app.all('/upload/preview', restrict, upload.preview);

//返回一个顺序编号
app.all('/nextseq', restrict, commons.nextseq);
app.all('/download', restrict, commons.download);

// dept manager
app.all('/dept', apiRestrict, dept.list);
app.post('/dept/c', apiRestrict, dept.create);
app.post('/dept/d', apiRestrict, dept.delete);
app.post('/dept/u', apiRestrict, dept.update);

// user manager
app.get('/users', apiRestrict, user.list);
app.post('/users/d', apiRestrict, user.delete);
app.post('/users/u', apiRestrict, user.update);

// geo api
app.all('/search', location.search);

// 条件搜索
app.all('/search/gisobj/export', apiRestrict, gisobj.exportGisobj);
// app.all('/search/gisobj/download', apiRestrict, gisobj.downloadCSV);
app.all('/search/keyword', apiRestrict, gisobj.queryGisobjByKeyword);

// list all geo service
app.get('/building', apiRestrict, gisobj.list);
app.post('/building/c', apiRestrict, gisobj.create);
app.post('/building/d', apiRestrict, gisobj.delete);
app.post('/building/u', apiRestrict, gisobj.updateBuilding);
app.all('/building/within', apiRestrict, gisobj.listBuildingWithin);
app.post('/property/c', apiRestrict, gisobj.createProperty);
app.post('/property/d', apiRestrict, gisobj.deleteProperty);
app.post('/property/u', apiRestrict, gisobj.updateProperty);
app.all('/property/within', apiRestrict, gisobj.listPropertyWithin);
app.all('/property/intersect', apiRestrict, gisobj.listPropertyIntersect);
app.all('/property/buildings', apiRestrict, gisobj.queryBuildingWithinProperty);
app.all('/property/areacount', apiRestrict, gisobj.queryAreaCountState);
app.all('/property/count', apiRestrict, gisobj.queryPropertyCountState);


// 查询室分数据
app.all('/sfdata', apiRestrict, gisobj.querySFData);

// 统计分析
app.all('/mapAnalysis', apiRestrict, analysis.mapAnalysis);
app.all('/analysis', apiRestrict, analysis.analysis);
// 质量预警分析
app.all('/auditeanalysis/list', apiRestrict, auditeanalysis.list);
app.all('/auditeanalysis/count', apiRestrict, auditeanalysis.count);
// 市场推广查询
app.all('/marketanalysis/list', apiRestrict, marketanalysis.list);
app.all('/marketanalysis/count', apiRestrict, marketanalysis.count);
// 优化查询
app.all('/optianalysis/list', apiRestrict, optianalysis.list);
app.all('/optianalysis/count', apiRestrict, optianalysis.count);

// CELL import
// 几个别名
app.get('/cellgsm.html', restrict, routes.cell);
app.get('/celltd.html', restrict, routes.cell);
app.get('/cellwlan.html', restrict, routes.cell);
app.get('/celllte.html', restrict, routes.cell);
// cell.html
app.get('/cell.html', restrict, routes.cell);
app.all('/cell/list', apiRestrict, cell.list);
app.all('/cell/listAction', apiRestrict, cell.listAction);
app.all('/cell/count', apiRestrict, cell.count);
app.all('/cell/import', apiRestrict, cell.import);
app.all('/cell/valide', apiRestrict, cell.valide);
app.all('/cell/valideCellid', apiRestrict, cell.valideCellid);

// aabis import
var aabis = require('./routes/aabis');
app.get('/aabis.html', restrict, routes.aabis);
app.all('/aabis/list', apiRestrict, aabis.list);
app.all('/aabis/listAction', apiRestrict, aabis.listAction);
app.all('/aabis/count', apiRestrict, aabis.count);
app.all('/aabis/import', apiRestrict, aabis.import);
// building
var building = require('./routes/building');
app.get('/building.html', restrict, routes.building);
app.all('/building/list', apiRestrict, building.list);
app.all('/building/retrive', apiRestrict, building.retrive);
app.all('/building/update', apiRestrict, gisobj.updateBuilding);
app.all('/building/delete', apiRestrict, building.delete);
app.all('/building/count', apiRestrict, building.count);
app.all('/building/import', apiRestrict, building.import);
app.all('/building/export', apiRestrict, building.export);
app.get('/building/jump', apiRestrict, building.jump);
// property
var property = require('./routes/property');
app.get('/property.html', restrict, routes.property);
app.all('/property/list', apiRestrict, property.list);
app.all('/property/pagecount', apiRestrict, property.count);
app.all('/property/count', apiRestrict, property.count);
app.all('/property/import', apiRestrict, property.import);
app.all('/property/retrive', apiRestrict, property.retrive);
app.all('/property/update', apiRestrict, gisobj.updateProperty);
app.all('/property/delete', apiRestrict, property.delete);
app.all('/property/export', apiRestrict, property.export);
app.get('/property/jump', apiRestrict, property.jump);

// signin
app.post('/signin', user.signin);
app.post('/getloginuser', user.getloginuser);
app.get('/signout', user.signout);

Data(function(){
	logger.log('连接数据库成功...');
	var server = http.createServer(app).listen(app.get('port'), function(){
		logger.log("启动web服务，在以下端口监听：" + app.get('port'));
	});
  // web socket server
  websocket.sock.install(server, '/websocket');
});
