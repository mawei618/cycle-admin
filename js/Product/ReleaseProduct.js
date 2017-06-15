
var idAll = 0;
var ids = null;//分类ID级别
var proid = 0;//商品ID
var oldTypeId = "";//原分类ID
var add = "";//添加
$(function () {
    oldTypeId = getQueryString("typeId");
    proid = getQueryString("proid");
    add = getQueryString("add");
    if (oldTypeId != null && !isNaN(oldTypeId)) {
        $.post("Handler/ReleaseProduct.ashx", { Action: "getProductNameStrById", id: oldTypeId }, function (data) {
            if (data.status) {
                var model = data.data;
                ids = model.productTypeIDStr.split(',');
                $(".mylist .item").eq(0).find("li#" + ids[1]).trigger("click");

            }
        }, "json");
        if (add != "true") {
            $(".catePublish button").html("修改分类");
        }
    }

    $(".agreement").load("notice.aspx");
    $("#SearchButton").click(function () {

        var val = $.trim($("#searchKeyWord").val());
        if (val == "" || val == "请输入查找名称") {
            alert("请输入查找名称"); return;
        }
        loasSearch(val);
        $(".catlist").hide();
        $(".cate-container").show();
    });

    // 退出搜索
    $("#exitLei").click(function () {
        var obj = $("#key_data").find("li[class='selected']");
        var idStr = obj.attr("idStr");
        exitSearch(idStr, obj.attr("name"));
    });

    //文本获取与失去焦点框事件
    $(".search input,.search-keyword").focus(function () {
        if ($(this).val() == '请输入查找名称') {
            $(this).val("").css("color", "#130c0e");
        }

    });
    $(".search input,.search-keyword").blur(function () {
        if ($(this).val() == '') {
            $(this).val("请输入查找名称").css("color", "#CCCCCC");
        }

    });



    $("#key_data").on("click", "li", function (event) {

        $(this).parent().find("li").removeClass("selected");
        var name = $(this).addClass("selected").attr("name");
        var id = $(this).attr("id");
        getMonthSalesPro(id, 1, 2);
        $("#productTypeName").html(name);
    });

    $("#key_data").on("dblclick", "li", function (event) {

        $(this).parent().find("li").removeClass("selected");
        var typeName = $(this).addClass("selected").attr("name");
        var typeId = $(this).attr("id");
        //alert(typeId);
        var typeIdStr = $(this).attr("idstr");
        if (parseInt(typeId) > 0) {
            goProductDetail(typeId, typeIdStr, typeName);
        }

    });
    //执行发布商品
    $(".cateBtn").click(function () {
        if ($(this).hasClass("cateBtn-disabled")) {
            return;
        }
        var selectObj = $(".item:eq(2) .list li[class='select']");
        var typeId = selectObj.attr("id");
        var typeName = selectObj.attr("name");
        var typeIdStr = "";
        selectObj = $(".item .list li[class='select']");
        $.each(selectObj, function (i, e) {
            typeIdStr += "," + e.id;
        });
        goProductDetail(typeId, typeIdStr, typeName);
    });

    //分类列表点击事件
    $(".list").on("click", "li", function (event) {
        if ($(this).hasClass("select")) {
            return false;
        }
        $(".cateBottom span").addClass("cateBtn-disabled");
        $(this).parent().parent().parent().find("li").removeClass("select");
        var id = $(this).addClass("select").attr("id");
        var count = $(this).attr("count");
        if (idAll == id) {
            return false;
        }
        idAll = id;
        var index = $(this).parent().parent().parent().index();


        $(".item:gt(" + index + ")").hide();
        $(".item:eq(" + (index + 1) + ")").show();

        if (index == 2) {
            var name = $(this).attr("name");
            if (name == undefined) {
                return;
            }
            $(".cateBottom span").removeClass("cateBtn-disabled");
            $("#productTypeName").html(name);

            getMonthSalesPro(id, 0, 2);
        }
        else {

            var obj = $(".list ul").eq(index + 1);
            obj.empty();

            if (count == 0) {
                obj.append("<li style='color:red;background:none;'>没有搜索到数据</li>");
            }
            else {
                loadTypeLevel(index + 1, id);
            }
            $("#productTypeName").html("无");

        }

    });

    //文本框搜索事件
    $(".search").on("keyup", "input", function () {// 搜索
        var temp = $(this).val();
        var obj = $(this).parent().siblings().children().children();



        $.each(obj, function (i, e) {

            var span = $(this).find("span");
            $(this).find("span").replaceWith(span.html());
            $(this).find("span").remove();
            var text = $(this).html();

            var textLower = text.toLowerCase();
            var index = textLower.indexOf(temp.toLowerCase());

            if (index == -1) {
                $(this).html(text).css("display", "none");
                return;
            }
            var start = text.substring(0, index);
            var end = text.substring(index + temp.length);
            var newText = start + "<span style='color:red'>" + temp + "</span>" + end;

            $(this).html(newText).css("display", "block");

        });



    });

});

function goProductDetail(typeId, typeIdStr, typeName) {
    if (oldTypeId != null && !isNaN(oldTypeId) && add != "true" && proid!=0) {
        window.location.href = "Handler/ReleaseProduct.ashx?Action=editProductType&typeid=" + typeId + "&proid=" + proid + "&typeIdStr=" + typeIdStr;
        return;
    }
    window.location.href = "ProductDetail.html?typeId=" + typeId + "&typeIdStr=" + typeIdStr + "&typeName=" + escape(typeName);
}
//退出搜索
function exitSearch(idStr, name) {
    if (idStr != undefined && $.trim(idStr) != "") {
        $(".cateBtn").removeClass("cateBtn-disabled");
        $("#productTypeName").html(name);
        idStr = idStr.substring(1);

        var idArr = idStr.split(',');
        for (var i = 0; i < idArr.length; i++) {
            if (idArr[i] != "") {
                if (i == 0) {
                    var objLev = $(".item:eq(0)").find("ul li[id='" + idArr[i] + "']");
                    objLev.addClass("select");
                    var seq = objLev.index();
                    if (seq > 6) {
                        objLev.parent().scrollTop(30 * (seq - 6));
                    }
                }

                loadTypeLevel(i + 1, idArr[i], idArr[i + 1]);
            }
        }
    }
    else {
        $(".item:gt(0)").hide().find("ul").empty();
        showHidePreview(0, 1);
    }
    $(".catlist").show();
    $(".cate-container").hide();
}

//显示隐藏示例商品index:序号，type显示类型
function showHidePreview(index, type) {

    if (type == 1) {
        $(".cate-aside .caption:eq(" + index + ")").hide();
        $(".guid-wrap .hint-content:eq(" + index + ")").show();
        $(".guid-wrap .figure:eq(" + index + ")").show();
        $(".productList:eq(" + index + ")").hide();
    }
    else {
        $(".cate-aside .caption:eq(" + index + ")").show();
        $(".guid-wrap .hint-content:eq(" + index + ")").hide();
        $(".guid-wrap .figure:eq(" + index + ")").hide();
        $(".productList:eq(" + index + ")").show().empty();
    }

}

//加载分类商品
function getMonthSalesPro(productTypeId, index, type) {
    var obj = $(".productList:eq(" + index + ")");
    showHidePreview(index, type);
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "Handler/ReleaseProduct.ashx",
        data: { productTypeId: productTypeId, action: "getMonthSalesPro" },
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            data = eval("(" + data.data + ")");
            if (data == "") {
                showHidePreview(index, 1);
            }
            else {
                //$(".cateBottom span").removeClass("cateBtn-disabled");
            }
            var imgHtml = "";
            $(data).each(function (i, e) {
                var img = '<div class="preview loaded"><div class="wrap"><img width="60" src="' + e.mainPhotoUrl + '"></div></div>'
                imgHtml += img;
            });
            obj.html(imgHtml);

        }
    });

}
//加载二、三级分类
function loadTypeLevel(index, parentId, id) {
    showHidePreview(0, 1);
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "Handler/ReleaseProduct.ashx",
        data: { parentId: parentId, action: "getList" },
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            data = eval("(" + data.data + ")");

            var obj = $(".list ul").eq(index);
            obj.empty();

            if (data == "") {

                obj.append("<li style='color:red;background:none;'>没有搜索到数据</li>");
                return;
            }

            var select = "", style = "", seq = 1;

            $(data).each(function (i, e) {

                if (id != undefined && id == e.id) {
                    select = "select";
                    seq += i;
                    $(".item").show();
                    if (index == 2) {
                        getMonthSalesPro(id, 0, 2);
                    }
                }
                else {
                    if (id == undefined && i == 0 && index == 2) {
                        select = "select";
                        getMonthSalesPro(e.id, 0, 2);
                    }
                    else {
                        select = "";
                    }

                }
                if (index == 2) {
                    style = "background-image:none;";
                }
                else if (e.childNum == 0) {
                    style = "background-image:none;";
                }

                obj.append("<li style='" + style + "' class='" + select + "' id='" + e.id + "' name='" + e.productTypeStr + "' count='" + e.childNum + "'>" + e.productTypeName + "</li>");

            });
            if (seq > 6) {
                obj.parent().scrollTop(30 * (seq - 6));
            }

            if (index == 2) {
                $(".cateBottom span").removeClass("cateBtn-disabled");
                $("#productTypeName").html($(".list ul").eq(index).find("li.select").attr("name"));
            }

            if (ids != null) {
                $(".mylist .item").eq(index).find("li#" + ids[index + 1]).trigger("click");
                if (index >= 2) {
                    ids = null;
                }
            }
        }
    });

}
//搜索分类
function loasSearch(name) {
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "Handler/ReleaseProduct.ashx",
        data: { name: name, action: "getSearch" },
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            data = eval("(" + data.data + ")");
            var obj = $("#key_data");
            obj.empty();
            if (data == "") {
                obj.append("<li class='selected' id='0' style='text-align:center;'>抱歉,没有找到与关键字\"<span style='color:red'>" + name + "</span>\"相关的类目。</li>");
                $("#productTypeName").html("无");
                showHidePreview(1, 1);
                $(".cateBottom span").addClass("cateBtn-disabled");
            }
            else {
                $(".cateBottom").find(".cateBtn").addClass("cateBtn-disabled");
                $("#RecordCount").html(data.length);

            }
            var className = "";
            
            $.each(data, function (i, e) {
                if (i == 0) {
                    className = "selected";
                    $("#productTypeName").html(e.productTypeStr);
                    getMonthSalesPro(e.id, 1, 2);
                    
                }
                else {
                    className = "";
                }
                obj.append("<li class='" + className + "' idStr='" + e.productTypeIDStr + "' id='" + e.id + "' name='" + e.productTypeStr + "'>" + (i + 1) + "." + e.productTypeStr + "</li>");

            });

        }
    });

}