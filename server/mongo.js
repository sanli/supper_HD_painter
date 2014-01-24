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
mongoose.connect('mongodb://localhost/sfmis',{
  db: { native_parser: true, safe:true },
});
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'mongoose db connection error:'));
mdb.once('open', function callback (err) {
	console.log("mongoose连接DB成功...");
});


exports = module.exports = Data;
var host = '127.0.0.1',
port = Connection.DEFAULT_PORT,
db = new Db('sfmis', new Server(host, port, {}), {native_parser:false, safe:true});
Data.db = db ;

// 建立连接，创建索引
function Data(fn){
	db.open(function(err, db) {
			if(err) throw err;
			db.ensureIndex('gis_building', { loc : '2dsphere' } , function(err, result) {
				if(err) throw err;
				db.ensureIndex('gis_property', { loc : '2dsphere' } , function(err, result) {
					if(err) throw err;
					db.ensureIndex('gis_property', { bounds : '2dsphere' } , function(err, result) {
						if(err) throw err;
						db.ensureIndex('gis_property', { center : '2dsphere' } , function(err, result) {
							if(err) throw err;
							db.ensureIndex('sys_users', {name:1}, function(err, result){
								if(err) throw err;
								fn(this);
							});
						});
					});
				});
			}); 

			//楼宇名称/ID索引
			db.ensureIndex('gis_building', { name: 1} , function(err, result) {
				if(err) throw err;
				db.ensureIndex('gis_building', { buildingId : 1} , function(err, result) {
					if(err) throw err;
				}); 
			});

			//物业点名称/ID索引
			db.ensureIndex('gis_property', { name: 1} , function(err, result) {
				if(err) throw err;
				db.ensureIndex('gis_building', { propertyId : 1} , function(err, result) {
					if(err) throw err;
				}); 
			});			
		});
};

//数据库操作器创建者
var DBOP = {
	_coll : function(collname, fn){
		if(typeof(collname) === 'string' ){
			db.collection(collname, function(err, coll){
				if(err)
					console.warn("get collection [" + collname + "] error :" + err.message );

				fn(err, coll);
			});	
		}else{
			fn(null, collname);
		}
	},

	insert : function( collname, obj, fn ){
		DBOP._coll(collname, function(err, coll){
			if(err) return fn(err);

			coll.insert(obj, function(err, docs){
			    if(err) console.warn("update error:" + err.message);
			    return fn(err, docs);
		    });
		})
	},

	update : function(collname, errmsg, query, update, fn){
		DBOP._coll(collname, function(err, coll){
			if(err) return fn(err);

			coll.update(query, update, function(err, docs){
			    if(err) console.warn("update error " + errmsg + " :" + err.message ); 

			    return fn(err, docs);
		   	});
		});
	},

	idupdate : function(collname, errmsg, _id, data, fn){
		delete data._id;
		DBOP._coll(collname, function(err, coll){
			if(err) return fn(err);

			var finder = { _id : typeof(_id) === 'string' ? new ObjectID(_id) : _id };
			coll.update( finder, {$set : data} , function(err, doc){
				if(err)
					console.log("query have error " + errmsg + " :" + err);

				fn(err, doc);
			});
		});
	},

	query : function( collname, query, fn){
		var queryitem = query || {};
		DBOP._coll(collname, function(err, coll){
			if(err) return fn(err);

			coll.find(queryitem).toArray(function(err, items){
				if(err) console.log("query have error:" + err);

				return fn(err, items);
			});
		})
	},

	idquery : function( collname, errmsg, _id, fn ){
		DBOP._coll(collname, function(err, coll){
			if(err) return fn(err);

			coll.findOne( {_id : new ObjectID(_id)} , function(err, doc){
				if(err) console.log("idquery " + errmsg + " have error :" + err);

				fn(err, doc);
			});
		});
	},

	//创建支持分页的查询函数
	pagequery : function(coll){

	},

    delete : function( collname, ids, fn){
    	DBOP._coll(collname, function(err, coll){
			var oids = ids.map(function(id){
				return new ObjectID(id);
			});
			coll.remove({ _id : { $in : oids }} ,function(err, count){
			    if(err) console.err("delete function error:" +  err.message);

			   	fn(err, count);
			});
    	});
    }
};
Data.DBOP = DBOP;

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


