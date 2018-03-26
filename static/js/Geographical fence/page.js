
$(function(){

    function createDemo(name){
        var container = $('#pagination-' + name);
        var sources = function(){

            var dataJson=send_get("/data_monitor/moonlight/fence/get");
            return dataJson.data;

        }();

        var options = {
            dataSource: sources,
            className: 'paginationjs-theme-blue',
            callback: function(response, pagination){

                //$(".paginationjs-pages ul li.paginationjs-page").click(function(){
                    var  click_json ={
                        "name":$("#btn_search_name").val()||null,
                        "group":$("#btn_search_group").val()||null,
                        "type":parseInt($("#btn_search_type").val())||null,
                        "startTime":$("#btn_search_start").val()||null,
                        "endTime":$("#btn_search_end").val()||null,
                        "pageSize":10||null,
                        "pageNum":pagination.pageNumber||null
                        //"pageNum":parseInt($(this).text())||null
                    };
                    //console.log($(".paginationjs-pages ul").find("li[class='paginationjs-page J-paginationjs-page active']").text());
                    click_json=JSON.stringify(click_json);


                    $.ajax({
                        url: "/data_monitor/moonlight/fence/query",
                        type: "post",
                        dataType: "json",
                        contentType: 'application/json;charset=UTF-8',
                        data: click_json,
                        success: function(data){
                            console.log(data.data);
                            var datas =data.data;
                            /*地理围栏表格*/
                            var tableSource="<table id='example' class='table table-striped table-bordered'>" +"<thead><tr><th>id</th> <th>name</th> <th>group</th> <th>type</th> <th>geo</th> <th>createTime</th> <th>updataTime</th><th>操作</th></tr></thead><tbody>";

                            for(var j=0;j<datas.length;j++){

                                tableSource+="<tr><th class='delete_id' style='font-weight:normal'>"+datas[j].id+"</th><th style='font-weight:normal ; min-width: 70px'>"+datas[j].name+"</th><th style='font-weight:normal;min-width:70px'>"+datas[j].group+"</th><th id='fence_type'>"+datas[j].type+"</th><th class='tabData_geo'>"+datas[j].geo+"</th><th style='width:180px'>"+datas[j].createTime+"</th><th style='width:180px'>"+datas[j].updateTime+"</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";

                            }
                            tableSource +="</tbody></table>";
                            $("#tab_fence").html(tableSource);

                            delete_data()
                        }
                    });
               // });
            }
        };

        $(".paginationjs-prev,.paginationjs-next").click(function(){
            //console.log(pagination.pageNumber);
            console.log($(".paginationjs-pages ul").find("li[class='paginationjs-page J-paginationjs-page active']").text());
        });
        /*search按钮点击时的搜索功能*/
        $(".search").click(function(){
            var  search_json ={
                "name":$("#btn_search_name").val()||null,
                "group":$("#btn_search_group").val()||null,
                "type":parseInt($("#btn_search_type").val())||null,
                "startTime":$("#btn_search_start").val()||null,
                "endTime":$("#btn_search_end").val()||null,
                "pageSize":10||null,
                "pageNum":1||null
            };
            search_json=JSON.stringify(search_json);


           /* $.ajax({
                url: "/data_monitor/moonlight/fence/query",
                type: "post",
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                data: search_json,
                success: function(data){
                    console.log(data.data);
                    var datas =data.data;
                    /!*地理围栏表格*!/
                    var tableSource="<table id='example' class='table table-striped table-bordered'>" +"<thead><tr><th>id</th> <th>name</th> <th>group</th> <th>type</th> <th>geo</th> <th>createTime</th> <th>updataTime</th><th>操作</th></tr></thead><tbody>";

                    for(var j=0;j<datas.length;j++){

                        tableSource+="<tr><th class='delete_id'>"+datas[j].id+"</th><th>"+datas[j].name+"</th><th>"+datas[j].group+"</th><th id='fence_type'>"+datas[j].type+"</th><th class='tabData_geo'>"+datas[j].geo+"</th><th style='width:180px'>"+datas[j].createTime+"</th><th style='width:180px'>"+datas[j].updateTime+"</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";

                    }
                    tableSource +="</tbody></table>";
                    $("#tab_fence").html(tableSource);

                    delete_data();
                    return false;
                }
            });*/



            var dataJson=send_post("/data_monitor/moonlight/fence/query",search_json);
            console.log(search_json.type);
            dataJson =dataJson.data;
            /*地理围栏表格*/
            var tableSource="<table id='example' class='table table-striped table-bordered'>" +"<thead><tr><th>id</th> <th>name</th> <th>group</th> <th>type</th> <th>geo</th> <th>createTime</th> <th>updataTime</th><th>操作</th></tr></thead><tbody>";

            for(var j=0;j<dataJson.length;j++){

                tableSource+="<tr><th class='delete_id'>"+dataJson[j].id+"</th><th>"+dataJson[j].name+"</th><th>"+dataJson[j].group+"</th><th id='fence_type'>"+dataJson[j].type+"</th><th class='tabData_geo'>"+dataJson[j].geo+"</th><th style='width:180px'>"+dataJson[j].createTime+"</th><th style='width:180px'>"+dataJson[j].updateTime+"</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";

            }
            tableSource +="</tbody></table>";
            $("#tab_fence").html(tableSource);
            delete_data();
            //$(".paginationjs-pages ul li.paginationjs-page").removeClass("active");
            //$(".paginationjs-pages ul li.paginationjs-page").eq(0).addClass("active");
           //return false;
        });
        container.addHook('beforeInit', function(){
            window.console && console.log('beforeInit...');
        });
        container.pagination(options);

        container.addHook('beforePageOnClick', function(){
            window.console && console.log('beforePageOnClick...');
            //return false
        });

        return container;
    }

    createDemo('demo1');

});