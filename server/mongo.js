//原始代码在这里
//https://github.com/christkv/mongodb-presentation/blob/master/basic.js


/**
 * sys info
 * =========================================
 * sys_users: 用户集合
 *   { name : 'username', 
 *     passwork : 'password', 
 *     dept " '所属部门',
 *     realname: "用户姓名",
 *     tel: "联系电话",
 *   }
 * sys_oplog: operation log
 *   {
 *   	time: 时间
 *      op: 操作者
 *      action: 操作类型
 *   }
 *
 *  
 *
 * proj_project: project info
 *  {
 *     _id: project id
 *     name: project_name
 *     ...
 *  }
 */

var Db = require('mongodb').Db,
  Collection = require('mongodb').Collection,
  Connection = require('mongodb').Connection,  
  Server = require('mongodb').Server,
  ObjectID = require('mongodb').ObjectID,
  http = require('http'),
  debug = require('util').debug,
  inspect = require('util').inspect
  lazy = require('lazy'), 
  fs = require('fs'),
  http = require('http');

//使用mongoose替换比较低级的mongodriver
//mongoose提供了2个sfmis必须的功能:
//  1. 自动Data类型装换,POST提交时会全部转换为String类型，通过Mongoose，在保存到数
//     据库的时候会转换成数值型
//  2. 数据修改触发器，通过定义的方式可以设置特定数据发生改变时自动触发其他计算,sfmis
//     中有大量数据分析计算，所以正好需要这个功能
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/cag',{
  db: { native_parser: true, safe:true },
});
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'mongoose db connection error:'));
mdb.once('open', function callback (err) {
	console.log("mongoose连接DB成功...");
});

//一些Mongoose的帮助方法,Mongoose已经非常高级，只需要很少的帮助方法
Data.Helper = {
	deleteByIds : function(module, ids, fn){
		var oids = ids.map(function(id){
			return new ObjectID(id);
		});
    	module.remove({ _id : { $in : oids }}, function(err){
			fn(err, ids.length);
    	});
    }
}


