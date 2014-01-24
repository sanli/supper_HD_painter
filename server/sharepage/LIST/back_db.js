//#!本文件由share.js自动产生于<M%=new Date() %M>, 产生命令行为: node share.js gen <M%=module_name %M> LIST ..
/**
 * <M%=module_name %M>数据库访问类
 */
var debug = require('util').debug,
    inspect = require('util').inspect,
    extend = require('node.extend'),
    isme = require('../sharepage.js').isme,
    // === 加入数据库访问模块 ===
    Building = require('./gisobjdb.js').Building,
    BuildingData = require('./gisobjdb.js').BuildingData;

/**
 * 按页查询数据
 * 查询Building指标,按照排序条件选取TopN个
 */
var realTimeProject = {
    $project : {
          _id : 1, 
          name: 1,
          gsmData2: 1, gsmData5: 1, tdData1: 1, tdData5:1,
          abis1 : 1, abis2 : 1, abis3 : 1, abis4 : 1, abis5 : 1,
          abis6 : 1,abis7 : 1, abis8 : 1,abis9 : 1}
},
// 输出最终计算结果
resultProject = { 
  $project : {
      _id : 1 , 
      name : 1,
      abis1 : 1, abis2 : 1, abis3 : 1, abis4 : 1, abis5 : 1, abis6 : 1, abis7 : 1, 
      abis8 : 1, abis9 : 1 ,
      wyData1 : { $add : [ '$gsmData5' , '$gsmData2' ] },
      wyData2 : { $add : [ '$tdData1' , '$tdData5' ] } 
  }
};

exports.list = function(cond, page, sort, fn){
    sort = { wyData1 : -1 };

    // 使用Aggregate查询数据
    console.log(page);
    Building.collection.aggregate(
        { $match: cond },
        realTimeProject,
        resultProject, 
        { $sort: sort },
        { $skip: page.skip },
        { $limit: page.limit },
        function(err, docs){
            if(err) console.trace("<M%=module_name %M>db.list error:", err);

            fn(err, docs);
        }  
    );
}

//返回某个查询的返回值数量，主要用于分页
exports.count = function(cond, fn){
    Building.find(cond)
        .count(function(err, count){
            if(err) console.trace("<M%=module_name %M>db.count error:", err);

            fn(err, count);
        });
}