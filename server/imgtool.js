//imgtool.js
//图像处理工具
// 1. 生成缩图
// 2. 生成分层切块图
// 3. 管理图片目录和图片元信息
//基站数据访问
var inspect = require('util').inspect
  , ObjectID = require('mongodb').ObjectID
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , extend = require('node.extend')
  , isme = require('./sharepage.js').isme;





// ============================= 下面是单元测试用的代码 ================================
var tester = {
    testArgs: function(args){
        console.log(inspect(args));
    }
}

if(isme(__filename)){
  if(process.argv.length > 2){
    testfn = process.argv[2];
    console.log("run test:%s", testfn);
    args = process.argv.slice(3);

    if(tester[testfn]){
        tester[testfn](args);
    };
  }else{
    var testcmd = [];
    for(cmd in tester)
      testcmd.push(cmd);

    console.log('imgtool.js '+ testcmd.join('|'));
  }
}





