//#!本文件由share.js自动产生于<M%=new Date() %M>, 产生命令行为: node share.js gen <M%=module_name %M> LIST ..
<M%
/**
 * LIST功能前端模块模板
 * 一个LIST模块的前端代码，完成基本的List/Query功能，包括:
 * 1. 列表展示
 * 2. 分页浏览
 * 3. 查询
 */
%M>
// Page状态对象
var PG = new $P({
    default: {
        // 查询条件
        cond : {},
        type: 'topn',
        // 翻页条件
        page : { skip: 0, limit: 50},
        // 排序字段
        sort : {},
    },
    bind: function(){
        this.bindhash();
        $(PG).on('statechange', Module.onPageStateChange);
    }
});

//Module is module control object
var Module = $.extend(new $M(), {

    // =========================================================================
    //  PageStateChage是功能的入口,一般由某个界面事件触发出状态改变，再由状态的改变，
    //  触发某个页面载入动作或者是重新渲染
    // =========================================================================
    onPageStateChange : function (){
        var state = PG.state;

        // 初始化页面各个控件的状态
        Module.applyPageState(state);
        // 载入数据
        Module.loadPageData(state.cond, state.page);
    },

    applyPageState : function(state){
        // 初始化查询条件
        $('#search-form').autofill(state.cond);
        var type = PG.state.type;
        $('#navtab li').removeClass('active');
        $('#navtab a[href="#type='+ type +'"]').closest('li').addClass('active');
    },

    loadPageData: function(cond, page){
        $('#topnBuildingTable').spin();
        var type = PG.state.type,
            title = ( type === 'needmarket' ? '指标topN的楼宇列表' : '陡降指标topN的楼宇列表');

        Module.listPage(cond, page
            , function(module){
                var $resultTarget = $('#topnBuildingTable');
                Module.fillResult($resultTarget, {
                    title : title,
                    bodyId: 'topnBuilding',
                    aggrows: module.docs,
                    categoryName : '楼宇名称',
                    tempId : 'queryResultTpl'
                });
                $('#topnBuildingTable').spin(false);
            });
        Module.showPagebar(cond, page
            , function(html){
                var $pagebar = $('#topnBuildingPagebar');
                $pagebar.empty().append(html);
            });
    },

    // 页面载入的时候绑定各个事件
    bind : function(){
        $('#searchBtn').click(function(){
            var search = $('#search-form').getdata({skipEmpty : true});
            var state = $.extend({}, PG.state);
            $.extend(state.cond, search) ;
            PG.pushState(state);
        });

        $('#topnBuildingPagebar').on('click','div.pagination a', function(e){
            e.preventDefault();
            var $a = $(e.target);
            var tgt = $a.attr('href'),
                params = $.deparam(tgt.replace(/^#/,''));
            var state = $.extend({}, PG.state),
                limit = state.page.limit
                state.page.skip = params.skipto * limit;
            
            PG.pushState(state);
        });

        $('#navtab a').click(function(e){
            e.preventDefault();
            var $a = $(e.target);
            var tgt = $a.attr('href'),
                params = $.deparam(tgt.replace(/^#/,''));

            var state = $.extend({}, PG.state);
            state.type = params.type;

            PG.pushState(state);
        });
    },

    // ========================================================================
    //      功能函数 
    // ========================================================================
    // 根据查询条件和分页条件载入数据页面
    listPage : function(cond, page, fn){
        $M.doquery('/<M%=module_name %M>/list'
            , { cond : cond, page: page} 
            , { successfn : fn });
    },

    showPagebar : function(cond, page, fn){
        $M.doquery('/<M%=module_name %M>/count'
            , { cond: cond}
            , { successfn : function(module){
                var pagebarHtml = renderPagebar("pagebarTpl", module.count, page);
                fn(pagebarHtml);
            }});
    },

    fillResult : function(target, options){
        var tempId = options.tempId;
        var outhtml = tmpl(tempId, options);
        if(outhtml.length > 0)
            target.empty().append(outhtml);
    },

    // ========== 请尽量在这一行后面加入扩展代码 ==========

});

function init(){
    Module.bind();
    PG.bind();
    $(window).trigger('hashchange');
};

$(document).ready(init);