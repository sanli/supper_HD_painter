//#!本文件由share.js自动产生于<M%=new Date() %M>, 产生命令行为: node share.js gen <M%=module_name %M> LIST ..
/**
 * <M%=module_name %M>HTTP入口模块, 需要在主文件中添加map
 * app.all('/<M%=module_name %M>/list', apiRestrict, <M%=module_name %M>.list);
 * app.all('/<M%=module_name %M>/count', apiRestrict, <M%=module_name %M>.count);
 */
var <M%=module_name %M>db = require('../data/<M%=module_name %M>db.js')
    , getreq = require('../sharepage').getreq
    , getParam = require('../sharepage').getParam
    , rt = require('../sharepage').rt
    , _ResultByState = require('../sharepage')._ResultByState
    , _assertNotNull = require('../sharepage')._assertNotNull
    , inspect = require('util').inspect;

var PAGE = {
    // 列表页条件,包括页的开始记录数skip，和页面长度limit 
    page : {name:'page', key:'page', optional: true, default: { skip: 0, limit: 50 }},
    // 查询条件
    cond : {name: 'cond', key: 'cond', optional: true, default: {} },
    // 排序条件
    sort : {name: 'sort', key: 'sort', optional: true, default: { wyData1 :1 } }
}

// 查询对象，并返回列表
exports.list = function(req, res){
    var arg = getParam("analysis", req, res, [PAGE.page, PAGE.cond, PAGE.sort]);
    if(!arg.passed)
        return;
    var page = {
        skip : parseInt(arg.page.skip),
        limit : parseInt(arg.page.limit),
    };
    

    <M%=module_name %M>db.list(arg.cond, page, arg.sort, function(err, docs){
        if(err) return rt(false, err.message, res);
        
        rt(true, {docs: docs}, res);
    });
}

// 查询对象，并返回列表
exports.count = function(req, res){
    var arg = getParam("analysis", req, res, [PAGE.cond]);
    if(!arg.passed)
        return;

    <M%=module_name %M>db.count(arg.cond, function(err, count){
        if(err) return rt(false, err.message, res);
        
        rt(true, {count: count}, res);
    });
}

// === 扩展的代码请加在这一行下面，方便以后升级模板的时候合并 ===

