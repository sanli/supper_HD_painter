
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect('/signin.html');
};

exports.main = function(req, res){
	res.render('main.html', {
	    user: getUserName(req),
	    title: getTitle("地理信息管理"),
	    page : 'main'
	});
};

exports.ongoing = function(req, res){
	res.render('ongoing.html', {
	    user: getUserName(req),
	    title: getTitle("正在建设中的页面"),
	    page : 'main'
	});
};

exports.analysis = function(req, res){
	res.render('analysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析"),
	    page : 'main'
	});
};

exports.realtimeAnalysis = function(req, res){
	res.render('realtimeanalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-实时分析"),
	    page : 'main'
	});
};

exports.historyanalysis = function(req, res){
	res.render('historyanalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-历史数据分析"),
	    page : 'main'
	});
};

exports.auditeanalysis = function(req, res){
	res.render('auditeanalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-质量预警"),
	    page : 'main'
	});
};

exports.lateranalysis = function(req, res){
	res.render('lateranalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-后评估"),
	    page : 'main'
	});
};

exports.optimizationanalysis = function(req, res){
	res.render('optianalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-规划优化"),
	    page : 'main'
	});
};

exports.marketnanalysis = function(req, res){
	res.render('marketanalysis.html', {
	    user: getUserName(req),
	    title: getTitle("统计分析-市场营销"),
	    page : 'main'
	});
};

exports.cell = function(req, res){
	res.render('cell.html', {
	    user: getUserName(req),
	    title: getTitle("导入基站数据"),
	    page : 'main'
	});
};

exports.aabis = function(req, res){
	res.render('aabis.html', {
	    user: getUserName(req),
	    title: getTitle("导入A+Abis数据"),
	    page : 'main'
	});
};

exports.building = function(req, res){
	res.render('building.html', {
	    user: getUserName(req),
	    title: getTitle("楼宇信息管理"),
	    page : 'main'
	});
};

exports.property = function(req, res){
	res.render('property.html', {
	    user: getUserName(req),
	    title: getTitle("物业点信息查询"),
	    page : 'main'
	});
};

exports.admin = function(req, res){
	res.render('admin.html', {
	    user: getUserName(req),
	    title: getTitle("系统管理"),
	    page : 'user'
	});
};


exports.project = function(req, res){
	res.render('project.html', {
	    user: getUserName(req),
	    title: getTitle("项目管理"),
	    page : 'user'
	});
};

exports.dept = function(req, res){
	res.render('dept.html', {
	    user: getUserName(req),
	    title: getTitle("组织构构"),
	    page : 'dept'
	});
};

exports.datacorrection = function(req, res){
	res.render('datacorrection.html', {
	    user: getUserName(req),
	    title: getTitle("数据矫正工具集"),
	    page : 'datacorrection'
	});
};

exports.signin = function(req, res){
	res.render('signin.html', {
	    user: getUserName(req),
	    title: getTitle("登录"),
	    page : 'signin'
	});
};

exports.apitest = function(req, res){
	res.render('apitest.html', {
	    user: getUserName(req),
	    title: getTitle("正在建设中的页面"),
	    page : 'main'
	});
};

function getUserName(req){
	return req.session.user || {name:'开发者'};
}

function getTitle(pageDesc){
	return "基于互联网地图的用户行为分析系统-" + pageDesc;
}

