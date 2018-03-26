/**
 * Created by changxinyue_i on 2017/11/23.
 */
var map = new BMap.Map('map_canvas');// 创建地图实例
var point = new BMap.Point(116.404, 39.915); // 天安门
map.centerAndZoom(point, 12);// 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom();// 允许drawingManager.open()滚轮缩放

/*
$("getLastOverLay").onclick = function() {
    if(overlays.length){
        alert(overlays[overlays.length - 1]);
    }else{
        alert("没有覆盖物");
    }
};*/
function send_get(url){
    var json_data="";
    jQuery.ajax({
        type:"get",
        url:url,
        datatype:"json",
        async:false,
        error:function(){
            alert("失败")
        },
        success:function(data){
            json_data=data;
        }
    });
    return json_data;
}

/*
//信息窗口的内容定义
var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
    '地址：北京市海淀区上地十街10号<br/>电话：(010)59928888<br/>简介：百度大厦位于北京市海淀区西二旗地铁站附近，为百度公司综合研发及办公总部。' +
    '</div>';

//创建带信息窗口的poi点
var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
    title  : "百度大厦",      //标题
    width  : 290,             //宽度
    height : 105,              //高度
    panel  : "panel",         //检索结果面板
    enableAutoPan : true,     //自动平移
    searchTypes   :[
        BMAPLIB_TAB_SEARCH,   //周边检索
        BMAPLIB_TAB_TO_HERE,  //到这里去
        BMAPLIB_TAB_FROM_HERE //从这里出发
    ]
});
*/
var overlays = [];
//回调获得覆盖物信息 overlay是覆盖物的抽象基类
var overlaycomplete = function(e){
    overlays.push(e.overlay);
    var result = "";
    result = "<p>";
    result += e.drawingMode + ":";
    if (e.drawingMode == BMAP_DRAWING_MARKER) {
        result += ' 坐标：' + e.overlay.getPosition().lng + ',' + e.overlay.getPosition().lat;

        //getPosition() 获取标签的经纬度坐标 lng  lat
        if ($('isInfowindow').checked) {
            searchInfoWindow.open(e.overlay);
        }
    }
    if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
        result += ' 半径：' + e.overlay.getRadius();
        result += ' 中心点：' + e.overlay.getCenter().lng + "," + e.overlay.getCenter().lat;
        var circle_r = e.overlay.getRadius();
        var circle_lng = e.overlay.getCenter().lng;
        var circle_lat = e.overlay.getCenter().lat;
        var url_toPic = "/data_monitor/moonlight/static/html/order_chart.html?point=" + circle_lat + "," + circle_lng + "&radius=" + circle_r;

        /* 向后台发送post请求  地理围栏数据*/

       // jQuery("#fence_name").val(name);
        jQuery("#geo_data").css({
            "display":"block"
        });
        /*中间层*/
        jQuery("#cover").css({
            "display":"block"
        });
        var  fence_circle_data;
        fence_circle_data='{"circle":"'+circle_r+'","circle_lat":"'+circle_lat+'","circle_lng":"'+circle_lng+'"}';
        //fence_geo_data =JSON.parse(fence_circle_data);
        jQuery("#fence_geo").val(fence_circle_data);
        /*圆形1*/
        console.log(fence_circle_data);
        jQuery("#fence_type").val("1");

        //$('#myModal').modal("show");

        jQuery("#btn_yes").click(function(){
            /*获取当前时间戳*/
            var data_time = new Date().getTime();
            /*获取0-1000之间的随机数*/
            var data_random = Math.ceil(Math.random()*1000);
            /*拼接默认弹窗名称*/
            var name = "fence-"+data_time+data_random;
            /*控制name group的默认传参*/
            var name_send;
            var group_send ;
            console.log(jQuery("#fence_name").val());
            console.log(jQuery("#fence_group").val());
            if(jQuery("#fence_name").val() != ""){
                name_send = jQuery("#fence_name").val();
            }else{
                name_send = name;
            };
            if(jQuery("#fence_group").val() != ""){
                group_send = jQuery("#fence_group").val();
            }else{
                group_send = "default";
            }


            var post_data =new Object;
            post_data.name=name_send;
            post_data.group=group_send;
            post_data.type=jQuery("#fence_type").val();
            post_data.geo=jQuery("#fence_geo").val();
            var saveData = JSON.stringify(post_data);
            console.log(saveData);
            send_post("/data_monitor/moonlight/fence/add",saveData);
            window.open(url_toPic,"_self");
        });
        jQuery("#btn_no").click(function(){
            jQuery("#geo_data").css({
                "display":"none"
            });
            jQuery("#cover").css({
                "display":"none"
            });
            window.open(url_toPic,"_self");
        })
    }

    if (e.drawingMode == BMAP_DRAWING_POLYLINE || e.drawingMode == BMAP_DRAWING_POLYGON || e.drawingMode == BMAP_DRAWING_RECTANGLE) {
        //result += ' 所画的点个数：' + e.overlay.getPath().length;
        var url_toPolyline ="/data_monitor/moonlight/static/html/order_chart.html?point=";
        var fence_geo_data='[';
        for(var i=0;i< e.overlay.getPath().length;i++){
            console.log("经度"+e.overlay.getPath()[i].lng+"纬度"+e.overlay.getPath()[i].lat);
            url_toPolyline += e.overlay.getPath()[i].lat + "," +e.overlay.getPath()[i].lng+";";

        /* 向后台发送post请求  地理围栏数据*/
        jQuery("#geo_data").css({
            "display":"block"
        });
        /*禁止点击中间层*/
        jQuery("#cover").css({
            "display":"block"
        });
        /*将圈选数据写入Input*/
            fence_geo_data+='{"The'+i+'point_l":"';
            fence_geo_data+=e.overlay.getPath()[i].lat;
            fence_geo_data+='","The'+i+'point_r":"';
            fence_geo_data+=e.overlay.getPath()[i].lng;
            fence_geo_data+='"},';
            console.log(fence_geo_data)
        }
        fence_geo_data = fence_geo_data.substring(0,fence_geo_data.length-1);
        fence_geo_data+=']';
            console.log(fence_geo_data);
            //fence_geo_data =JSON.parse(fence_geo_data);
            jQuery("#fence_geo").val(fence_geo_data);
        /*如果是多边形3 方形2  折线4*/
        if (e.drawingMode == BMAP_DRAWING_POLYGON) {
            jQuery("#fence_type").val("3");
        }else if(e.drawingMode == BMAP_DRAWING_RECTANGLE){
            jQuery("#fence_type").val("2");
        }else if(e.drawingMode == BMAP_DRAWING_POLYLINE){
            jQuery("#fence_type").val("3");
        }
        //$('#myModal').modal("show");

        url_toPolyline = url_toPolyline.substring(0,url_toPolyline.length-1);

        jQuery("#btn_yes").click(function(){

            /*获取当前时间戳*/
            var data_time = new Date().getTime();
            /*获取0-1000之间的随机数*/
            var data_random = Math.ceil(Math.random()*1000);
            /*拼接默认弹窗名称*/
            var name = "fence-"+data_time+data_random;
            /*控制name group的默认传参*/
            var name_send;
            var group_send ;
            console.log(jQuery("#fence_name").val());
            console.log(jQuery("#fence_group").val());
            if(jQuery("#fence_name").val() != ""){
                name_send = jQuery("#fence_name").val();
            }else{
                name_send = name;
            };
            if(jQuery("#fence_group").val() != ""){
                group_send = jQuery("#fence_group").val();
            }else{
                group_send = "default";
            }


            var post_data =new Object;
            post_data.name=name_send;
            post_data.group=group_send;
            post_data.type=jQuery("#fence_type").val();
            post_data.geo=jQuery("#fence_geo").val();
            var saveData = JSON.stringify(post_data);
            console.log(saveData);

            send_post("/data_monitor/moonlight/fence/add",saveData);

            window.open(url_toPolyline,"_self");
        });
        jQuery("#btn_no").click(function(){
            jQuery("#geo_data").css({
                "display":"none"
            });
            jQuery("#cover").css({
                "display":"none"
            });
            window.open(url_toPolyline,"_self");
        })

    }

};


var styleOptions = {
    strokeColor:"black",    //边线颜色。
    fillColor:"black",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
};
//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen:true, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
        scale: 0.8 //工具栏缩放比例
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});


//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);


function $(id){
    return document.getElementById(id);
}

function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}

//var isPanelShow = false;
//显示结果面板动作
//$("showPanelBtn").onclick = showPanel;
/*function showPanel(){
    if (isPanelShow == false) {
        isPanelShow = true;
        $("showPanelBtn").style.right = "230px";
        $("panelWrap").style.width = "230px";
        $("map").style.marginRight = "230px";
        $("showPanelBtn").innerHTML = "隐藏绘制结果信息<br/>>";
    } else {
        //isPanelShow = false;
        $("showPanelBtn").style.right = "0px";
        $("panelWrap").style.width = "0px";
        $("map").style.marginRight = "0px";
        $("showPanelBtn").innerHTML = "显示绘制结果信息<br/><";
    }
}*/



//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
/* visible 热力图是否显示,默认为true
 * opacity 热力的透明度,1-100
 * radius 势力图的每个点的半径大小
 * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
 *	{
 .2:'rgb(0, 255, 255)',
 .5:'rgb(0, 110, 255)',
 .8:'rgb(100, 0, 255)'
 }
 其中 key 表示插值的位置, 0~1.
 value 为颜色值.
 */

var sign ="true";
var points;
function openHeatmap(){
    //console.log(sign);
    /*热力图*/
    if(sign == "true"){
        /*sign为true时发送请求*/
        //points = send_get("/data_monitor/moonlight/heatMap").data;
        points = send_get("../mock/热力图数据").data;
        if(!isSupportCanvas()){
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data:points,max:100});
        sign ="false";
        jQuery("#btn_headMapOpen").val("热力图已打开");
        jQuery("#btn_headMapOpen").removeClass("btn_danger");
        jQuery("#btn_headMapOpen").addClass("btn-success");
        //console.log(sign)
    }else if(sign=="false"){
        /*发送请求之后sign改为false
        * sign为false时  改变按钮上的文字为热力图关闭并且关闭热力图，sign改为other
        */
        jQuery("#btn_headMapOpen").val("热力图已关闭");
        jQuery("#btn_headMapOpen").removeClass("btn-success");
        jQuery("#btn_headMapOpen").addClass("btn_danger");
        heatmapOverlay.hide();
        sign ="other";
        /*sign 为other时 按钮上的文字为热力图打开
        * 并且打开热力图  sign再次变为false
        */
    }else if(sign == "other"){
        jQuery("#btn_headMapOpen").val("热力图已打开");
        jQuery("#btn_headMapOpen").removeClass("btn_danger");
        jQuery("#btn_headMapOpen").addClass("btn-success");
        heatmapOverlay.show();
        sign ="false";
    }

}



function setGradient(){
    /*格式如下所示:
     {
     0:'rgb(102, 255, 0)',
     .5:'rgb(255, 170, 0)',
     1:'rgb(255, 0, 0)'
     }*/
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors,0);
    colors.forEach(function(ele){
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay.setOptions({"gradient":gradient});
}
//判断浏览区是否支持canvas
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

