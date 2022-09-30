define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    //弹窗修饰
    Fast.config.openArea = ['95%','95%'];  //窗口默认尺寸

    var Controller = {
        index: function () {
            //通用搜索提示
            $.fn.bootstrapTable.locales[Table.defaults.locale]['formatSearch'] = function(){return "支持搜索ID 文章标题 文章简介 来源";};

            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'article/index' + location.search,
                    add_url: 'article/add',
                    edit_url: 'article/edit',
                    del_url: 'article/del',
                    multi_url: 'article/multi',
                    import_url: 'article/import',
                    table: 'article',
                }
            });

            var table = $("#table");
            //动态下拉列表
            table.on('post-common-search.bs.table', function (event, table) {
                var form = $("form", table.$commonsearch);
                $("input[name='category_id']", form).addClass("selectpage").data("source", "category/selectpage").data("primaryKey", "id").data("field", "name") ;
                if ($(".selectpage", form).size() > 0) {
                    Form.events.selectpage(form);
                }
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'category.name', title: __('Category_id'),operate: false},
                        {field: 'category_id', title: __('Category_id'),visible:false,addClass:"selectpage"},
                        {field: 'title', title: __('Title'), operate: 'LIKE'},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'intro', title: __('Intro'), operate: 'LIKE'},
                        {field: 'visit', title: __('Visit'), operate: 'LIKE'},
                        {field: 'source', title: __('Source'), operate: 'LIKE'},
                        {field: 'source_link', title: __('Source_link'), operate: 'LIKE'},
                        {field: 'author', title: __('Author'), operate: 'LIKE'},
                        {field: 'is_hot', title: __('Is_hot'),searchList: {"1":__('是'),"0":__('否')}, formatter: (value,row)=>{
                                let is_hot = ['否','是'];
                               return is_hot[value];
                            }},
                        {field: 'publishedtime', title: __('Publishedtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'weigh', title: __('Weigh'), operate: false},
                        {field: 'status', title: __("Status"),searchList: {"1":__('正常'),"0":__('隐藏')}, formatter: (value,row)=>{
                                let is_hot = ['隐藏','正常'];
                                return is_hot[value];
                            }},
                        {field: 'created_by', title: __('Created_by'),operate: false},
                        {field: 'updated_by', title: __('Updated_by'),operate: false},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'article/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title'), align: 'left'},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'article/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'article/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
