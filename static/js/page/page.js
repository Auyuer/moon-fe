var pageItem = document.querySelector("#page-item");

function page(nowPage, maxPage, pageLimit) {
    var limit = Math.ceil((pageLimit - 1) / 2);
    if (nowPage > limit && nowPage < maxPage - limit) {
        addPage(nowPage - limit, nowPage + limit, nowPage);

    } else if (nowPage <= limit) {
        addPage(1, pageLimit, nowPage);
    } else if (nowPage >= maxPage - limit) {
        addPage(maxPage - pageLimit + 1, maxPage, nowPage);
    }
    addEndPage(pageItem);

}
function click_btn(nowPage, maxPage, pageLimit){
    $("#page-prev").click(function () {
        nowPage = Math.max(1, nowPage - pageLimit);
        $("#page-item a.page-link").remove();
        page(nowPage, maxPage, pageLimit);
        getData(nowPage);
        return false;
    });
    $("#page-next").click(function () {
        nowPage = Math.min(maxPage, nowPage + pageLimit);
        $("#page-item a.page-link").remove();
        page(nowPage, maxPage, pageLimit);
        getData(nowPage);
        return false;
    });
}


function addEndPage(object) {
    var endPage = document.createElement("a");
    endPage.classList.add("page-default");
    endPage.classList.add("page-link");
    endPage.id = "page-next";
    endPage.innerHTML = ">>";
    object.appendChild(endPage);

}

var nodes = pageItem.children;

function addPage(begin, end, nowPage) {
    for (let i = begin; i <= end; i++) {
        let aItem = document.createElement("a");
        aItem.classList.add("page-default");
        aItem.classList.add("page-link");
        aItem.innerHTML = i;
        if (i === nowPage) {
            aItem.classList.add("active-page");
        }
        pageItem.appendChild(aItem);
        aItem.onclick = function (e) {
            e.target.className += " active-page";
            for (var i = 0; i <  nodes.length; i++) {
                if (nodes[i] != e.target) {
                    nodes[i].classList.remove("active-page");
                }
            }
        };
    }
}


$("#page-item").click(function () {
    var index = 0;
    index = $("#page-item").find(".active-page").html();
    getData(index);
});

function getData(index) {

    var search_type;
    if($("#btn_search_type").val() == "环形"){
        search_type = 1;
    }else if($("#btn_search_type").val() == "矩形"){
        search_type = 2;
    }else if($("#btn_search_type").val() == "多边形"){
        search_type = 3;
    }

    var click_json = {
        "name": $("#btn_search_name").val() || null,
        "group": $("#btn_search_group").val() || null,
        "type": search_type || null,
        "startTime": $("#btn_search_start").val() || null,
        "endTime": $("#btn_search_end").val() || null,
        "pageSize": 10 || null,
        "pageNum": index || null
    };
    click_json = JSON.stringify(click_json);

    $.ajax({
        url: "/data_monitor/moonlight/fence/query",
        type: "post",
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        data: click_json,
        success: function (data) {
            var datas = data.data.data;
            /*地理围栏表格*/
            var tableSource = "<table id='example' class='table table-striped table-bordered'>" +
                "<thead><tr><th>id</th> <th>名称</th> <th>分组</th> <th>类型</th> <th>地理围栏信息</th> <th>创建时间</th><th>操作</th></tr></thead><tbody>";
            var datas_type;
            for (var j = 0; j < datas.length; j++) {
                if(datas[j].type == "1") datas_type = "环形";
                if(datas[j].type == "2") datas_type = "矩形";
                if(datas[j].type == "3") datas_type = "多边形";

                tableSource += "<tr><th class='delete_id' style='font-weight:normal'>" + datas[j].id + "</th><th style='min-width:70px;font-weight:normal'>" + datas[j].name + "</th><th style='min-width:70px;font-weight:normal'>" + datas[j].group + "</th><th id='fence_type' style='min-width:70px;font-weight:normal'>" + datas_type + "</th><th class='tabData_geo' style='font-weight:normal'>" + datas[j].geo + "</th><th style='width:180px;font-weight:normal'>" + datas[j].createTime + "</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";
            }
            tableSource += "</tbody></table>";
            $("#tab_fence").html(tableSource);
            delete_data();
        }
    });
}


/*search按钮点击时的搜索功能*/
$(".search").click(function () {
    $("#page-item a.page-link").remove();
    var search_type;
    if($("#btn_search_type").val() == "环形"){
        search_type = 1;
    }else if($("#btn_search_type").val() == "矩形"){
        search_type = 2;
    }else if($("#btn_search_type").val() == "多边形"){
        search_type = 3;
    }
    var search_json = {
        "name": $("#btn_search_name").val() || null,
        "group": $("#btn_search_group").val() || null,
        "type": search_type || null,
        "startTime": $("#btn_search_start").val() || null,
        "endTime": $("#btn_search_end").val() || null,
        "pageSize": 10 || null,
        "pageNum": 1 || null
    };
    search_json = JSON.stringify(search_json);

    var data_Json = send_post("/data_monitor/moonlight/fence/query", search_json);
    var dataJson = data_Json.data.data;
    var totle_search = Math.ceil(data_Json.data.total / 10);
    var search_Page = data_Json.data.nowPage;
    var search_Limit = Math.min(9, totle_search);
    page(search_Page, totle_search, search_Limit);
    click_btn(search_Page, totle_search, search_Limit);

    /*地理围栏表格*/
    var tableSource = "<table id='example' class='table table-striped table-bordered'>" + "<thead><tr><th>id</th> <th>名称</th> <th>分组</th> <th>类型</th> <th>地理围栏信息</th> <th>创建时间</th><th>操作</th></tr></thead><tbody>";
    var datas_type;

    for (var j = 0; j < dataJson.length; j++) {
        if(dataJson[j].type == "1") datas_type = "环形";
        if(dataJson[j].type == "2") datas_type = "矩形";
        if(dataJson[j].type == "3") datas_type = "多边形";
        tableSource += "<tr><th class='delete_id' style='font-weight:normal'>" + dataJson[j].id + "</th><th style='min-width:70px;font-weight:normal'>" + dataJson[j].name + "</th><th style='min-width:70px;font-weight:normal'>" + dataJson[j].group + "</th><th id='fence_type' style='min-width:70px;font-weight:normal'>" + datas_type + "</th><th class='tabData_geo' style='font-weight:normal'>" + dataJson[j].geo + "</th><th style='width:180px;font-weight:normal'>" + dataJson[j].createTime + "</th><th class='btn_fence'><button class='btn_look btn-info'>查看</button><button class='btn_delete btn-danger'>删除</button></th>";

    }
    tableSource += "</tbody></table>";
    $("#tab_fence").html(tableSource);
    delete_data();
    $("#page-item a.page-default").removeClass("active-page");
    $("#page-item a.page-default").eq(1).addClass("active-page");
    //return false;
});
