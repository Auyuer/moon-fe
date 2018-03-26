/**
 * Created by changxinyue_i on 2017/11/24.
/

 /*get请求的ajax*/
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

/*post请求*/
function send_post(url,data){
    var json_data="";
    jQuery.ajax({
        type:"post",
        contentType: 'application/json;charset=UTF-8',
        url:url,
        datatype:"json",
        async:false,
        data:data,
        error:function(){
            alert("失败")
        },
        success:function(data){
            json_data=data;
        }
    });
    return json_data;
}



/*获取url参数*/
function getUrlParam(){
    var url=window.location.search;
    var params = url.substring(url.indexOf("?")+1);
    var paramArr=params.split("&");
}
