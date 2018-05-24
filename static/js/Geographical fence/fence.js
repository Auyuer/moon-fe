/**
 * Created by 常馨月 on 2017/12/5.
 */
/*地理围栏数据*/

$(document).ready(function(){
    tabData_show();
});
function tabData_show(){

    var json_data;
    var  page_json ={
        "name":null,
        "group":null,
        "type":null,
        "startTime":null,
        "endTime":null,
        "pageSize":10||null,
        "pageNum":1||null
    };
    page_json=JSON.stringify(page_json);
    json_data=send_post("/data_monitor/moonlight/fence/query",page_json);
    var tabData = json_data.data.data;

    var totle_Page = Math.ceil(json_data.data.total/10);
   var now_Page = json_data.data.nowPage;
   var  page_Limit = Math.min(9,totle_Page);
    //nowPage=now_Page;
    //maxPage=totle_Page;
    page(now_Page,totle_Page, page_Limit);
    click_btn(now_Page,totle_Page, page_Limit);
    /*地理围栏表格*/

    var tableSource="<table id='example' class='table table-striped table-bordered'>" +"<thead><tr><th>id</th> <th>名称</th> <th>分组</th> <th>类型</th> <th>地理围栏信息</th> <th>创建时间</th><th>操作</th></tr></thead><tbody>";
    var datas_type;

    for(var j=0;j<tabData.length;j++){
        if(tabData[j].type == "1") datas_type = "环形";
        if(tabData[j].type == "2") datas_type = "矩形";
        if(tabData[j].type == "3") datas_type = "多边形";
        tableSource+="<tr><th class='delete_id' style='font-weight:normal'>"+tabData[j].id+"</th><th style='min-width:70px;font-weight:normal'>"+tabData[j].name+"</th><th style='min-width:70px;font-weight:normal'>"+tabData[j].group+"</th><th id='fence_type' style='min-width:70px;font-weight:normal'>"+datas_type+"</th><th class='tabData_geo' style='font-weight:normal'>"+tabData[j].geo+"</th><th style='width:180px;font-weight:normal'>"+tabData[j].createTime+"</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";

    }
    tableSource +="</tbody></table>";
    $("#tab_fence").append(tableSource);


    /*删除数据*/
    delete_data();
    function delete_data(){
        $(".btn_delete").click(function(){
            if(confirm("是否确认删除？")){
                $(this).parents("tr").remove();
                var delete_id=$(this).parents("tr").children("th.delete_id").text();
                var url_delete;
                url_delete="/data_monitor/moonlight/fence/delete?id=";
                url_delete+=delete_id;
                var delete_data=send_get(url_delete);
                alert(delete_data.message);
            }else{
                return false;
            }
        });

        $(".btn_look").click(function(){
            var jsonStr=$(this).parents("tr").children("th.tabData_geo").text();
            console.log($(this).parents("tr").children("th.tabData_geo").text());
            var json=$.parseJSON(String(jsonStr));
            console.log(json);
            var look_url;
            var num=0;
            var jsonType=$(this).parents("tr").children("th#fence_type").text();
            if(jsonType == "环形"){
                look_url= "/data_monitor/moonlight/static/html/order_chart.html?point=" + json.circle_lat + "," + json.circle_lng + "&radius=" + json.circle;
                window.open(look_url,"_self")
            }else{
                look_url= "/data_monitor/moonlight/static/html/order_chart.html?point=";
                for(var i=0;i<json.length;i++){
                    for(var j in json[i]){
                        num++;
                        look_url+=json[i][j];
                        if(num%2==0){
                            look_url+=";";
                        }else{
                            look_url+=",";
                        }
                    }
                }
                look_url=look_url.substring(0,look_url.length-1);
                window.open(look_url,"_self")
            }
        });
    }
}
function delete_data(){
    $(".btn_delete").click(function(){
        if(confirm("是否确认删除？")){
            $(this).parents("tr").remove();
            var delete_id=$(this).parents("tr").children("th.delete_id").text();
            var url_delete;
            url_delete="/data_monitor/moonlight/fence/delete?id=";
            url_delete+=delete_id;
            var delete_data=send_get(url_delete);
            alert(delete_data.message);
        }else{
            return false;
        }
    });

    $(".btn_look").click(function(){
        var jsonStr=$(this).parents("tr").children("th.tabData_geo").text();
        console.log($(this).parents("tr").children("th.tabData_geo").text());
        var json=$.parseJSON(String(jsonStr));
        console.log(json);
        var look_url;
        var num=0;
        var jsonType=$(this).parents("tr").children("th#fence_type").text();
        if(jsonType == "环形"){
            look_url= "/data_monitor/moonlight/static/html/order_chart.html?point=" + json.circle_lat + "," + json.circle_lng + "&radius=" + json.circle;
            window.open(look_url,"_self")
        }else{
            look_url= "/data_monitor/moonlight/static/html/order_chart.html?point=";
            for(var i=0;i<json.length;i++){
                for(var j in json[i]){
                    num++;
                    look_url+=json[i][j];
                    if(num%2==0){
                        look_url+=";";
                    }else{
                        look_url+=",";
                    }
                }
            }
            look_url=look_url.substring(0,look_url.length-1);
            window.open(look_url,"_self")
        }
    });
}