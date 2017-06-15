var nodown = "no-move-down";
var noup = "no-move-up";
function del(e) {
    var tbody = $(e).parent("td").parent("tr").parent("tbody");
    if (tbody.attr("id") == undefined) {
        tbody.remove();
    } else {
        tbody.attr("model", "del").hide();
    }
}

function move(e) {
    var className = $(e).attr("class");

    if (className.indexOf("no-") > -1) {
        return false;
    }
    var sub = $(e).parent("td").parent("tr").parent("tbody");

    if (className.indexOf("move-down") > -1) {//down
        var nextTr = sub.next("tbody");
        if (nextTr.next("tbody").html() == undefined) {
            sub.find(".move-down").addClass(nodown);
            nextTr.find(".move-down").removeClass(nodown);
        }
        if (sub.prev("tbody").html() == undefined) {
            sub.find(".move-up").removeClass(noup);
            nextTr.find(".move-up").addClass(noup);
        }
        nextTr.after(sub);
    } else {//up
        var prevTr = sub.prev("tbody");

        if (prevTr.prev("tbody").html() == undefined) {
            sub.find(".move-up").addClass(noup);
            prevTr.find(".move-up").removeClass(noup);
        }

        if (sub.next("tbody").html() == undefined) {
            sub.find(".move-down").removeClass(nodown);
            prevTr.find(".move-down").addClass(nodown);
        }

        prevTr.before(sub);
    }
}
function save() {

    var obj = [];
    var isChenck = true; 
    $("#Category tbody").each(function (i) {
        var tbody = $(this);
        var model = {};
        var id = tbody.attr("id");
        var text = tbody.find("input:text");
        model.id = id == undefined ? 0 : parseInt(id);
        if (model.id == 0) {
            isReload = true;
        }
        model.className = $.trim(text.val());
        model.orderNo = i + 100;
        if (tbody.is(":hidden")) {
            model.imageTotal = -1;
        } else {
            model.imageTotal = 0;
            if (model.className + model.orderNo == text.attr("name")) {
                return; //没更新数据
            }
        }

        if (model.className.length <= 0) {
            isChenck = false;
            text.css("border", "1px solid red");
        } else {
            text.removeAttr("style");
        }

        obj.push(model);
    });
    if (!isChenck || obj.length <= 0) {
        alertInfo("没有更新数据！");
        return;
    }
    var models = TJSON.stringify(obj);

    $.ajax({
        url: "Handler/Photo.ashx",
        data: { action: "editClassType", obj: models },
        dataType: "json",
        type: 'POST',
        success: function (data) {
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
        },
        error: function () {
            alertInfo("分类更新失败，请稍候再试！");
        }
    });
}

$(function () {
    var table = $("#Category");
    var tbody = $("#Category_Temp").find("tbody");
    $("#NewCategory").click(function () {
        var newCate = tbody.clone();
        newCate.appendTo(table);
        if (table.find("tbody").length > 1) {
            var oldSub = newCate.prev();
            oldSub.find(".move-down").removeClass(nodown);
            newCate.find(".move-up").removeClass(noup);
        }
    });
    table.find("tbody").first().find(".move-up").addClass(noup);
    table.find("tbody").last().find(".move-down").addClass(nodown);
});
