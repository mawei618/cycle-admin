
$(function () {
    var sort = getQueryString("sort");
    var order = getQueryString("order");
    var searchType = getQueryString("searchType");
    if (searchType == 0) {
        $(".changeAmount").remove();
    }
    else if (searchType == 1) {
        $("#searchStatus").html("<br />");
    }
    if (searchType != "") {
        $(".tabs-nav li:eq(" + searchType + ")").addClass("current");
        $("input[name='searchType']").val(searchType);
    }

    if (order != "") {
        $(".list-head th a").attr("class", "order order-by-gray-desc");
        if (order == "desc") {
            $(".list-head th a[sort='" + sort + "']").attr("class", "order order-by-desc").attr("order", "asc");
        }
        else {
            $(".list-head th a[sort='" + sort + "']").attr("class", "order order-by-asc").attr("order", "desc");
        }
    }
    //排序搜索
    $(".list-head .order").on("click", function () {
        var sort = $(this).attr("sort");
        var order = $(this).attr("order");
        $("input[name='sort']").val(sort);
        $("input[name='order']").val(order);
        $(".stock-search-btn").click();
    });
    $(".popup-panel").on("click", ".close-btn", function () {
        $(this).parent().hide();
    });

    //全选
    $("input:checkbox.all-selector").on("click", function () {
        $("tbody").find("input:checkbox").prop("checked", this.checked);
    });

    //上架与删除、修改库存
    $(".operations .trigger-btn").on("click", function () {
        var status = $(this).val();
        var obj = $(".data").find("input:checkbox:checked");
        //推荐商品
        if (status == -1) {
            var idList = "";
            $.each(obj, function (i, e) {
                if ($(this).attr("isrecommend") != 1) {
                    idList += $(this).attr("data") + ",";
                }
            });
            if (idList == "") {
                alertInfo("请选择没有设置推荐的商品");
            }
            else {
                idList = idList.substring(0, idList.length - 1);

                $.ajax({
                    url: "Handler/ProductInfo.ashx",
                    data: { action: "recommendPro", idlist: idList, isRecommend: 1 },
                    dataType: "json",
                    type: 'POST',
                    success: function (data) {
                        if (!checkLogin(data)) {
                            return false;
                        }
                        if (data.status) {
                            var arr = data.message.split(',');

                            var count = arr[0];
                            if (arr.length == 2) {
                                alertInfo("您已设置了" + arr[1] + "件商品为推荐，最多只能设置20件");
                            }
                            else if (count <= 0) {
                                alertInfo("设置失败");
                            }
                            else {
                                $(".stock-search-btn").click();
                            }
                        }
                        else {
                            alertInfo("设置失败");
                        }
                    },
                    error: function () {
                        alertInfo("设置失败");
                    }
                });
            }
            return false;
        }
        //取消推荐
        if (status == -2) {
            var idList = "";
            $.each(obj, function (i, e) {
                if ($(this).attr("isrecommend") == 1) {
                    idList += $(this).attr("data") + ",";
                }
            });
            if (idList == "") {
                alertInfo("请选择推荐的商品");
            }
            else {
                idList = idList.substring(0, idList.length - 1);
                $.ajax({
                    url: "Handler/ProductInfo.ashx",
                    data: { action: "recommendPro", idlist: idList, isRecommend: 0 },
                    dataType: "json",
                    type: 'POST',
                    success: function (data) {
                        if (!checkLogin(data)) {
                            return false;
                        }
                        if (data.status) {
                            var arr = data.message.split(',');
                            var count = arr[0];
                            if (count <= 0) {
                                alertInfo("设置失败");
                            }
                            else {
                                $(".stock-search-btn").click();
                            }
                        }
                        else {
                            alertInfo("设置失败");
                        }
                    },
                    error: function () {
                        alertInfo("设置失败");
                    }
                });
            }
            return false;
        }
        //修改库存
        if (status == 0) {
            var inventory = $.trim($(this).parent().find(".text-amount").val());
            if (!validate.isNum(inventory) || inventory <= 0) {
                alertInfo("商品库存必须大于0的数字");
                return false;
            }
            obj = $(".data").find("input:checkbox");
            var idList = "";
            $.each(obj, function (i, e) {
                idList += $(this).attr("data") + ",";
            });
            idList = idList.substring(0, idList.length - 1);
            $.ajax({
                url: "Handler/ProductManager.ashx",
                data: { action: "updatePriceInventory", idlist: idList, val: inventory, yuanS: "=", type: 0 },
                dataType: "json",
                type: 'POST',
                success: function (data) {
                    if (!checkLogin(data)) {
                        return false;
                    }
                    if (data.status) {
                        $(".stock-search-btn").click();
                    }
                    else {
                        alertInfo("保存失败");
                    }
                },
                error: function () {
                    alertInfo("保存失败");
                }
            });
            return false;
        }
        //上架、删除      
        if (obj.length == 0) {
            alertInfo("请选择商品"); return false;
        }
        else {
            var idList = "";
            $.each(obj, function (i, e) {
                idList += $(this).attr("data") + ",";
            });

            idList = idList.substring(0, idList.length - 1);
            $.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                url: "Handler/ProductManager.ashx",
                data: { idList: idList, status: status, action: "updateStatus" },
                success: function (data) {
                    if (!checkLogin(data)) {
                        return false;
                    }
                    if (!data.status) {
                        if (data.data == -1) {
                            alertInfo("商品发布规则变动，请编辑商品后再上架");
                        } else {
                            alertInfo(data.message);
                        }
                    }
                    else {
                        $(".stock-search-btn").click();
                    }
                }
            });
        }
    });

    //编辑商品名称
    $(".look-name .edit-item-title").on("click", function () {
        hideShow();
        selectTr($(this));
        $(this).parent().hide();
        $(this).parent().siblings().show();
        var name = $(this).siblings().find("a").attr("title");
        var obj = $(this).parent().siblings().find(".new-item-title");
        obj.val(name);
        onTitleChange(obj);
    });
    //保存商品名称
    $(".edit-name .edit-save").on("click", function () {
        var trObj = $(".data tr[class='with-sid current']");
        var id = $(trObj).attr("data");
        var status = $(trObj).attr("status");
        var name = $(this).siblings(".new-item-title").val();
        var obj = $(this).parent().siblings().find("p a");
        if ($.trim(name) == "") {
            alertInfo("请输入商品名称");
            return false;
        }
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "Handler/ProductInfo.ashx",
            data: { id: id, productName: name,status:status, type: 0, action: "updateProInfo" },
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (!data.status) {
                    alertInfo("保存失败");
                }
                else {
                    obj.html(name);
                    obj.attr("title", name);
                    hideShow();
                }
            }
        });
    });

    //判断商品名称长度
    $(".edit-name .new-item-title").on("keyup", function () {
        onTitleChange($(this));
    });


    //编辑商品价格
    $(".look-price .item-SKU-price-area").on("click", function () {
        hideShow();
        selectTr($(this));
        var prices = $.trim($(this).siblings().html());
        var parentObj = $(".data tr[class='with-sid current']");
        var detail = parentObj.attr("detail");
        if (detail == 1) {
            var id = parentObj.attr("data");
            var status = parentObj.attr("status");
            var wordInputOffset = $(this).offset();
            var src = "EditPriceSKUFrame.aspx?proId=" + id + "&prices=" + prices + "&type=0&status=" + status + "&t=" + getDateStr();
            $("#J_edit-SKU iframe").attr("src", src);
            var skuDiv = $("#J_edit-SKU").show();
            skuDiv.css({ left: (wordInputOffset.left - (skuDiv.width() - 50)) + "px", top: (wordInputOffset.top - (skuDiv.height() - 120)) + "px" });

        }
        else {
            $(this).parent().hide();
            $(this).parent().siblings().show();
            var obj = $(this).parent().siblings().find(".new-item-price");
            obj.val(prices);
        }

    });
    //保存商品价格
    $(".edit-price .edit-save").on("click", function () {
        var prices = $(this).siblings().val();
        var trObj= $(".data tr[class='with-sid current']");
        var id = trObj.attr("data");
        var status = trObj.attr("status");
        var obj = $(this).parent().siblings().find(".price-now");
        if ($.trim(prices) == "") {
            alertInfo("请输入商品价格");
            return false;
        }
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "Handler/ProductInfo.ashx",
            data: { id: id, prices: prices, status:status,type: 1, action: "updateProInfo" },
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (!data.status) {
                    alertInfo("保存失败");
                }
                else {
                    obj.html(parseFloat(prices).toFixed(2));
                    hideShow();
                }
            }
        });

    });

    //编辑商品库存
    $(".look-inventory .item-num-area").bind("click", function () {
        hideShow();
        selectTr($(this));
        var inventory = $.trim($(this).siblings().html());
        var parentObj = $(".data tr[class='with-sid current']");
        var detail = parentObj.attr("detail");
        if (detail == 1) {
            var id = parentObj.attr("data");
            var wordInputOffset = $(this).offset();
            var src = "EditPriceSKUFrame.aspx?proId=" + id + "&inventory=" + inventory + "&type=1&t=" + getDateStr();
            $("#J_edit-SKU iframe").attr("src", src);
            var skuDiv = $("#J_edit-SKU").show();
            skuDiv.css({ left: (wordInputOffset.left - (skuDiv.width() - 50)) + "px", top: (wordInputOffset.top - (skuDiv.height() - 120)) + "px" });

        }
        else {
            $(this).parent().hide();
            $(this).parent().siblings().show();
            var obj = $(this).parent().siblings().find(".new-item-num");
            obj.val(inventory);
        }

    });

    //保存商品库存
    $(".edit-inventory .edit-save").on("click", function () {
        var inventory = $(this).siblings().val();
        var id = $(".data tr[class='with-sid current']").attr("data");

        var obj = $(this).parent().siblings().find(".inventory-now");

        if (!validate.isNum(inventory) || inventory < 0) {
            alertInfo("商品库存必须大于0的数字");
            return false;
        }
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "Handler/ProductInfo.ashx",
            data: { id: id, inventory: inventory, type: 2, action: "updateProInfo" },
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (!data.status) {
                    alertInfo("保存失败");
                }
                else {
                    obj.html(inventory);
                    hideShow();
                }
            }
        });

    });


    //商家分类显示隐藏
    $(".ks-tree-row .ks-tree").on("click", function () {
        $(this).parent().siblings().toggle();
        if ($(this).hasClass("ks-tree-expand-icon")) {
            $(this).removeClass("ks-tree-expand-icon").addClass("ks-tree-fold-icon");
        }
        else {
            $(this).removeClass("ks-tree-fold-icon").addClass("ks-tree-expand-icon");
        }
        return false;
    });
    //商家分类显示隐藏
    $(".ks-tree-item .ks-tree-row").on("click", function () {
        $(".ks-tree-row").removeClass("ks-tree-row-select");
        $(this).addClass("ks-tree-row-select");
        var val = $(this).attr("data");
        var idList = "";
        if ($(this).attr("level") == 1) {
            var obj = $(this).siblings().find(".ks-tree-row");
            $.each(obj, function (i, e) {
                idList += "," + $(this).attr("id");
            });
        }
        else {
            idList = "," + $(this).attr("id");
        }
        if (idList != "") {
            idList += ",";
        }
        $("input[name='shopProTypeIDStr']").val(idList);
        $(".search-shoptype").val(val);
        $("#shopType-div").toggle();
    });

    //选择商家分类
    $(".search-form .search-shoptype").on("click", function () {
        var wordInputOffset = $(this).offset();
        var typeDIV = $("#shopType-div").toggle();
        //typeDIV.css({ left: (wordInputOffset.left - (typeDIV.width() - 153)) + "px", top: (wordInputOffset.top - (typeDIV.height() - 130)) + "px" });

    });
    //选择商家分类
    $(".search-form .icon-dropdown").on("click", function () {
        var wordInputOffset = $(this).offset();
        var typeDIV = $("#shopType-div").toggle();
        //typeDIV.css({ left: (wordInputOffset.left - (typeDIV.width() - 10)) + "px", top: (wordInputOffset.top - (typeDIV.height() - 130)) + "px" });

    });

    //验证价格
    $(".search-form .search-price").on("keyup", function () {
        var val = $(this).val();
        if (!validate.isFloat2(val)) {
            $(this).val("");
        }
    });
    //验证价格
    $(".edit-price .new-item-price").on("keyup", function () {
        var val = $(this).val();
        if (!validate.isFloat2(val)) {
            $(this).val("");
        }
    });
    //验证总销量
    $(".search-form .search-num").on("keyup", function () {
        var val = $(this).val();
        if (!validate.isNum(val)) {
            $(this).val("");
        }
    });

    //保存商品库存
    $(".with-sid .changeInventory").on("click", function () {
        hideShow();
        selectTr($(this));

        var inventory = $(this).parent().find(".text-amount").val();
        var id = $(".data tr[class='with-sid current']").attr("data");
        if (inventory == undefined) {
            updateProductStatus(1);
        }
        else {
            inventory = $.trim(inventory);
            if (!validate.isNum(inventory) || inventory <= 0) {
                alertInfo("商品库存必须大于0的数字");
                return false;
            }
            $.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                url: "Handler/ProductInfo.ashx",
                data: { id: id, inventory: inventory, action: "shelvesAndInventory" },
                success: function (data) {
                    if (!checkLogin(data)) {
                        return false;
                    }
                    if (!data.status) {
                        alertInfo("上架失败");
                    }
                    else {
                        $(".stock-search-btn").click();
                    }
                }
            });
        }
    });

});

//更新商品状态
function updateProductStatus(status) {
    var obj = $(".data tr[class='with-sid current']");
    var idList = "";
    $.each(obj, function (i, e) {
        idList += $(this).attr("data") + ",";
    });
    if (idList != "") {
        idList = idList.substring(0, idList.length - 1);
    }
    else {
        if (status == 1) {
            alertInfo("请选择要上架的商品"); return false;
        }
        else if (status == 3) {
            alertInfo("请选择要删除的商品"); return false;
        }
    }

    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        url: "Handler/ProductInfo.ashx",
        data: { idList: idList, status: status, action: "updateProductStatus" },
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (!data.status) {
                alertInfo("上架失败");
            }
            else {
                $(".stock-search-btn").click();
            }
        }
    });
}

//选择表格一行数据
function selectTr(obj) {
    $(obj).parents(".with-sid").addClass("current");
}

//显示隐藏编辑商品名称、价格、库存
function hideShow() {

    $(".look-name").show();
    $(".edit-name").hide();
    $(".look-price").show();
    $(".edit-price").hide();
    $(".look-inventory").show();
    $(".edit-inventory").hide();
    $("#shopType-div").hide();
    $(".with-sid").removeClass("current");
}

//商品title字符验证
function onTitleChange(o) {
    var max = 60;
    if ($.trim($(o).val()).getByteLength() <= max) {
        var num = parseInt((max - $.trim($(o).val()).getByteLength()) / 2);
        $(o).parent().find(".surplus-words .word-num").html(num);
    }
    else {
        $(o).parent().find(".surplus-words .word-num").html(0);
        var val = $(o).val();
        val = val.substring(0, 60);
        $(o).val(val);
    }
}
function winClick(e) {
    e = e ? e.target : window.event.srcElement;
    if ($(e).hasClass("edit-item-title") || $(e).hasClass("new-item-title") || $(e).hasClass("item-SKU-price-area") || $(e).hasClass("new-item-price") || $(e).hasClass("item-num-area") || $(e).hasClass("new-item-num") || $(e).hasClass("search-shoptype") || $(e).hasClass("icon-dropdown") || $(e).hasClass("edit-save")) {

    }
    else {
        hideShow();
    }
}
//点击本窗体
document.onclick = winClick;

$(function () {
    initZclip();
});