var nodown = "no-move-down";
var noup = "no-move-up";

function del(e) {

    var obj = $(e).parent("td").parent("tr");

    if (obj.siblings(".cats-sub").not(obj.siblings(".cats-sub:hidden")).length == 0) {//删除父级
        var parent = obj.siblings(".cats-sup");
        if (parent.attr("id") == undefined) {
            parent.remove();
            parent.parent("tbody").remove();
        } else {
            parent.attr("model", "del").hide();
            parent.parent("tbody").hide();
        }

    }
    if (obj.attr("id") == undefined) {
        obj.remove();
    } else {
        obj.attr("model", "del").hide();
    }


}

function addSub(e) {
    var cate = $(e).parent("td").parent("tr").siblings(".cats-sub");
    var newSub = $("#Category_Temp").find("tbody").clone().find(".cats-sub");
    var oldSub = cate.last();
    oldSub.after(newSub);
    oldSub.find(".move-down").removeClass(nodown);
    newSub.find(".move-up").removeClass(noup);
}

function move(e, tag) {
    var className = $(e).attr("class");

    if (className.indexOf("no-") > -1) {
        return false;
    }
    var sub = $(e).parent("td").parent("tr");
    if (tag == "tbody") {
        sub = sub.parent("tbody");
    }
    if (className.indexOf("move-down") > -1) {//down
        var nextTr = sub.next(tag);
        if (nextTr.next(tag).html() == undefined) {
            sub.find(".move-down").addClass(nodown);
            nextTr.find(".move-down").removeClass(nodown);
        }
        if (sub.prev(tag).html() == undefined) {
            sub.find(".move-up").removeClass(noup);
            nextTr.find(".move-up").addClass(noup);
        }

        nextTr.after(sub);
    } else {//up
        var prevTr = sub.prev(tag);
        if (prevTr.prev(tag).html() == undefined) {
            sub.find(".move-up").addClass(noup);
            prevTr.find(".move-up").removeClass(noup);
        }
        if (sub.next(tag).html() == undefined) {
            sub.find(".move-down").removeClass(nodown);
            prevTr.find(".move-down").addClass(nodown);
        }

        prevTr.before(sub);
    }
}

$(function () {
    var table = $("#Category");
    var tbody = $("#Category_Temp").find("tbody");
    $("#NewCategory").click(function () {
        var newCate = tbody.clone();
        newCate.appendTo(table);
        if (table.find("tbody").length <= 1) {
            newCate.find(".move-up").addClass(noup);
        } else {
            newCate.prev("tbody").find(".move-down").removeClass(nodown);
        }


    });

    table.find(".cats-sup").first().find(".move-up").addClass(noup);
    table.find(".cats-sup").last().find(".move-down").addClass(nodown);
    table.find("tbody").each(function (i, e) {
        var tb = $(e);
        tb.find(".cats-sub").first().find(".move-up").addClass(noup);
        tb.find(".cats-sub").last().find(".move-down").addClass(nodown);
    });



    $("#J_CatsSubmit").click(function () {
        save();
    });
});

var isSub = true; var layerClose;
function save() {
    if (!isSub) {
        alertInfo("您操作太频繁了，请稍候再试");
        layer.close(layerClose);
        return;
    }
    isSub = false;
    var obj = [];

    var isChenck = true;
    var noUpNum = 0;
    var Msg = "";

    $("#Category .cats-sup").each(function (i) {
        var tr = $(this);
        var model = {};
        model.children = [];
        var id = tr.attr("id");
        var text = tr.find("input:text");
        model.id = id == undefined ? 0 : parseInt(id);
        if (model.id == 0) {
            isReload = true;
        }
        model.productTypeName = $.trim(text.val());
        model.productTypeLogo = $.trim(text.attr("img"));
        if (tr.is(":hidden")) {
            model.cmd = -1;
        } else {
            model.cmd = 0;
            if (model.productTypeName + i + model.productTypeLogo != text.attr("name")) {
                model.cmd = -2;
            } else {
                noUpNum++;
            }
        }

        if (model.productTypeName.length <= 0) {
            isChenck = false;
            Msg = "请输入分类名称";
            text.css("border", "1px solid red");
        } else {
            text.removeAttr("style");
        }
        model.orderNo = i;

        $(this).siblings("tr.cats-sub").each(function (j) {//子分类
            var ctr = $(this);
            var children = {};
            var cid = ctr.attr("id");
            var ctext = ctr.find("input:text");
            children.id = cid == undefined ? 0 : parseInt(cid);
            if (children.id == 0) {
                isReload = true;
            }
            children.productTypeName = $.trim(ctext.val());
            children.productTypeLogo = $.trim(ctext.attr("img"));
            if (ctr.is(":hidden")) {
                children.cmd = -1;
            } else {
                children.cmd = 0;
                if (children.productTypeName + j + children.productTypeLogo != ctext.attr("name")) {
                    children.cmd = -2;

                } else {
                    noUpNum++;
                }
            }
            children.orderNo = j;
            if (children.productTypeName.length <= 0) {
                isChenck = false;
                Msg = "请输入分类名称";
                ctext.css("border", "1px solid red");
            } else {
                ctext.removeAttr("style");
                model.children.push(children);
            }

        });
        obj.push(model);
    });

    if (Msg != "") {
        alertInfo(Msg);
        layer.close(layerClose);
        isSub = true;
        return false;
    }

    if (!isChenck || obj.length <= 0 || $("#Category tr").length == noUpNum) {
        alertOK("保存成功！", function () {
        });
        layer.close(layerClose);
        isSub = true;
        return false;
    }
    layerClose = layer.load();
    var models = TJSON.stringify(obj);
    $.ajax({
        url: "Category.html",
        data: { action: "editShopProductType", obj: models },
        dataType: "json",
        type: 'POST',
        success: function (data) {
            layer.close(layerClose);
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                alertOK("更新成功！", function () {
                    winReload();
                });
            }
            else {
                alertInfo(data.message);
            }
            isSub = true;
        },
        error: function () {
            isSub = true;
            alertInfo("分类更新失败，请稍候再试！");
            layer.close(layerClose);
        }
    });
}