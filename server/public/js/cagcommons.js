//sfmiscommons.js
/**
 * 扩展一些SFMis独有的功能函数, 需要在sharepage.js之后载入
 */
!function ($P) {
    "use strict";

    var fn = $P.prototype;
    fn.getuser = function(fn){
        if (PG.user)
            return fn(null, PG.user);
        $M.doquery('/getloginuser', {}, 
            { 
                successfn : function(data){
                    PG.user = data.user;
                    fn(null, PG.user);
                }, 
                failfn: function(data){
                    fn(new Error(data));
                }
            });
    }

    fn.loadCity = function( options ){
        options = options || { el : "#deptId"}
        var PG = this, 
            $el = $(options.el);
        $.getJSON("/cityDept.json", function(citys) {
            $.each(citys, function(i, city){
                $el.append("<option value='"+city.deptId+"'>"+city.city+"</option>"); 
            });

            PG.getuser(function(err, user){
                if(err) return ;
                if(user && user.deptId){
                    $el.val(user.deptId);
                    if (user.deptId !=="1"){
                        $el.prop('disabled', 'disabled');
                    }
                }                  
            });
        });
    }
}($P);