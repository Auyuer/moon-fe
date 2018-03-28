/**
 * Created by changxinyue_i on 2017/11/27.
 */
$(document).ready(function(){
    getUrlParam();

});

/*获取url参数*/
function getUrlParam(){
    /*拿到url地址*/
    var url=window.location.search;
    /*截取?后的所有数据*/
    var params = url.substring(url.indexOf("?")+1);
    /*如果url中有弧度的数据*/
    var str='radius';
    var json_data;
    /*获取圆形圈选的经纬度和弧度*/
    if(url.indexOf(str)!=-1){
        var paramArr=params.split("&");
        var param_first=paramArr[0].split("=");
        var param_lng_lat=param_first[1].split(",");
        var circle_lat = param_lng_lat[0];
        var circle_lng = param_lng_lat[1];
        var param_second = paramArr[1].split("=");
        var circle_r = param_second[1];

        /*请求后端接口*/
        //json_data=send_get("/data_monitor/moonlight/circle?point=" + circle_lat + "," + circle_lng + "&radius=" + circle_r);
        json_data = send_get("/moonlight/static/mock/circle.txt");
        json_data = JSON.parse(json_data);
        console.log(json_data);
    }else{
        /*截取url中等号右边的参数*/
        var paramSqual=params.split("=");
        var paramSqual_lng_lat;
        var url_getSqual;
        url_getSqual="/data_monitor/moonlight/polygon?";
        /*参数列表为用;分割开的经纬度数据*/
        var paramSqual_Arr = paramSqual[1].split(";");
        for(var i=0;i<paramSqual_Arr.length;i++){
            paramSqual_lng_lat=paramSqual_Arr[i].split(",");
            url_getSqual+="point"+i+"="+paramSqual_lng_lat[0]+','+paramSqual_lng_lat[1]+'&';
            //json_data=send_get("/data_monitor/moonlight/polygon?point"+i+"="+paramSqual_lng_lat[0]+','+paramSqual_lng_lat[1]);

        }
        url_getSqual=url_getSqual.substring(0,url_getSqual.length-1);
        //json_data=send_get(url_getSqual);
        json_data = send_get("/moonlight/static/mock/circle.txt");
        json_data = JSON.parse(json_data);
        console.log(json_data);
    }



    /*渲染图表*/

    /*日订单量图表展示区*/
    var chartName_total = echarts.init(document.getElementById("chart_total"));
    var adata_total=json_data.data;
    var option_total = {
        title: {
            text: '订单量分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['订单量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:adata_total["xAxis"]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '订单数量',
                type: 'line',
                stack: '总量',
                data: adata_total["total"]
            }
        ]
    };
    chartName_total.setOption(option_total);

    /*日盈利图表展示区*/
    var chart_profit = echarts.init(document.getElementById("chart_profit"));
    var adata_profit=json_data.data;
    var option_profit = {
        title: {
            text: '日盈利分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['日盈利']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:adata_profit["xAxis"]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '日盈利',
                type: 'line',
                stack: '总量',
                data: adata_profit["profit"]
            }
        ]
    };
    chart_profit.setOption(option_profit);


    /*取消率图表展示区*/

    var chart_cancelRatio = echarts.init(document.getElementById("chart_cancelRatio"));
    var adata_cancelRatio=json_data.data;
    var option_cancelRatio = {
        title: {
            text: '取消率分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['取消率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:adata_cancelRatio["xAxis"]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '取消率',
                type: 'line',
                stack: '总量',
                data: adata_cancelRatio["cancelRatio"]
            }
        ]
    };
    chart_cancelRatio.setOption(option_cancelRatio);

/*表格中的数据*/
    var tableData =json_data.data.detail;
    var tableSource="<table id='example' class='table table-striped table-bordered'>" +"<thead><tr><th>日期</th> <th>订单总量</th> <th>日盈利</th> <th>取消率</th></tr></thead><tbody>";

    for(var j=0;j<tableData.length;j++){
        tableSource+="<tr><th style='font-weight:normal'>"+tableData[j].date+"</th><th style='font-weight:normal'>"+tableData[j].total+"</th><th style='font-weight:normal'>"+tableData[j].profit+"</th><th style='font-weight:normal'>"+tableData[j].cancelRatio;
        /*var tableDate_cancal=tableData[j].cancelRatio;
        if (String(tableDate_cancal).length - String(tableDate_cancal).indexOf('.') - 1 > 2){
            tableDate_cancal = tableDate_cancal.toFixed(2);
        }
        tableSource+=tableDate_cancal+"</th></tr>";*/
    }
    tableSource +="</tbody><tfoot><tr> <th>日期</th> <th>订单总量</th> <th>日盈利</th> <th>取消率</th> </tr> </tfoot></table>";
    $("#container").append(tableSource);


    /*var tableSource =json_data.data.detail;
    var t = $('#example').DataTable({
        ajax: {
            "processing": true,
            "serverSide": true,
            "ajax" : "load",
            dataSrc:"tableSource"
        },
        //每页显示三条数据
        pageLength: 3,
        columns: [{"data": "tableSource.total"},
            {"data": "tableSource.profit"},
            {"data": "tableSource.date"},
            {"data": "tableSource.cancelRatio"}],
        "columnDefs": [
            {
                "targets": [3],
                "data": "id",
                "render": function(data, type, full) {
                    return "<a href='/update?id=" + data + "'>Update</a>";
                }
            }
        ]
    });*/
}


