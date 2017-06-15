/* File Created: 十二月 6, 2013 */
var section_temp;
var regionA; //当前选择地区a标签
var isView = false;
var isPackageMailVal;
function returnFreigth(test, id) {//关闭本窗体，返回父窗体选择运费模板select option

    if (getQueryString("single") == "false") {
        window.opener.setFreigth(id);
    } else {
        var select = $("#comFreigth", window.opener.document);
        if (select.find("option[value='" + id + "']").length == 0) {
            var option = $("<option>");
            option.val(id);
            option.text(test);
            option.appendTo(select);
        }
        select.val(id);
    }
    window.focus();
    window.opener = null;
    window.close();
}
$(function () {
    section_temp = $("#section_temp");

    if (getQueryString("view") == "ture") {//是否查看 表示有父窗体
        $("button[name='view']").click(function () {
            var button = $(this);
            returnFreigth(button.attr("data-name"), button.attr("data-id"));
        });
        isView = true;
    } else {
        $("div.view").remove();
    }

    $("input:radio[name='isPackageMail']").click(function () {
        isPackageMailVal = parseInt(this.value);
        if (isPackageMailVal == 2 && confirm("选择“卖家承担运费”后，所有地区的运费将设成0且无法恢复，您确定要修改吗？")) {
            var setting = $(".setting");
            $(".postage-detail", setting).hide();
            $("table", setting).remove();
            $("input[name='firstArticleKG'],input[name='continueArticleKG']", setting).val("1");
            $("input[name='firstCharge'],input[name='continueCharge']", setting).val("0");
        } else if (isPackageMailVal == 1) {
            $("input[name='shippingMethod']:checked").each(function () {
                $(this).parent().next(".hide").show();
            });
        }

    });
});
function showFeigth() {//显示编辑层
    $(".manage-list").hide();
    var setting = $(".setting");
    setting.show();
    $("#templateName", setting).val("").attr("data-id", "0");
    //$("input:checkbox", setting).prop("checked", false);
    $("table", setting).remove();
    var text = $("input:text", setting)
    text.removeAttr("style");
    $("input[name='firstArticleKG']").attr("data-id", "0");
    $("#editText").html("新增运费模板");

    $("input[name='firstArticleKG'],input[name='continueArticleKG']", setting).val("1");
    $("input[name='firstCharge'],input[name='continueCharge']", setting).val("0");

}
function hideFeigth() {//隐藏编辑层
    $(".manage-list").show();
    $(".setting").hide();
}

function editFrieight(e) {//编辑 或保存 运费模板 
    showFeigth();
    $("#editText").html("编辑运费模板");
    e = $(e);
    var data = e.parent().parent().parent();
    var setting = $(".setting");
    var _default = $(".entity .default", setting);
    var _except = $(".entity .tbl-except", setting);
    var _attach = $(".entity .tbl-attach", setting);
    var templateName = $("#templateName", setting);
    var freight = data.find(".J_Title");
    templateName.val($.trim(freight.attr("data-templateName")));
    templateName.attr("data-id", freight.attr("data-id"));
    $("#fullNum", setting).val(freight.attr("data-fullnum"));
    if (freight.attr("data-fullfree") == "1") {
        document.getElementById("isFullFree").checked = true;
    } else {
        document.getElementById("isFullFree").checked = false;
    }

    var setting = $(".setting");
    $("input:radio[value='" + freight.attr("data-mail") + "'][name='isPackageMail']", setting).prop("checked", true);
    //$("input:radio[value='" + freight.attr("data-area") + "'][name='areaRestricted']", setting).prop("checked", true);
    if (freight.attr("data-area") == "1") {
        document.getElementById("areaRestricted").checked = false;
    } else {
        document.getElementById("areaRestricted").checked = true;
    }

    //默认运费
    $(".entity tr[data-default='1']", data).each(function (i, tr) {
        tr = $(tr);
        var method = parseInt(tr.find("td[name='shippingMethod']").attr("data-method"));
        myDefault = _default.eq(method - 1);
        $("#shippingMethod" + method, setting).trigger("click");

        /**显示运送方式**/
        var div = $("#shippingMethod" + method).parent().siblings("div");
        if (!$("#shippingMethod" + method).prop("checked")) {
            div.hide();
        } else {
            div.show();
        }


        var firstArticleKG = $("input[name='firstArticleKG']", myDefault);
        firstArticleKG.val($.trim(tr.find("td[name='firstArticleKG']").text()));
        firstArticleKG.attr("data-id", tr.attr("data-id"));

        $("input[name='firstCharge']", myDefault).val($.trim(tr.find("td[name='firstCharge']").text()));
        $("input[name='continueArticleKG']", myDefault).val($.trim(tr.find("td[name='continueArticleKG']").text()));
        $("input[name='continueCharge']", myDefault).val($.trim(tr.find("td[name='continueCharge']").text()));

        tr.siblings("tr[data-default='0'][data-method='" + method + "']").each(function (i, tr) {//页面数据
            tr = $(tr);
            var a = $(".J_AddRule", _attach.eq(method - 1)).trigger("click");
            var valTr = $("tr:last", _except.eq(method - 1));

            var firstArticleKG = $("input[name='firstArticleKG']", valTr);
            firstArticleKG.val($.trim(tr.find("td[name='firstArticleKG']").text()));
            firstArticleKG.attr("data-id", tr.attr("data-id"));

            $("input[name='firstCharge']", valTr).val($.trim(tr.find("td[name='firstCharge']").text()));
            $("input[name='continueArticleKG']", valTr).val($.trim(tr.find("td[name='continueArticleKG']").text()));
            $("input[name='continueCharge']", valTr).val($.trim(tr.find("td[name='continueCharge']").text()));

            var distrctCode = tr.find("td[name='distrctCode']");
            $(".area-group", valTr).attr("data-ids", distrctCode.attr("data-ids")).attr("data-text", distrctCode.attr("data-text")).html(distrctCode.text());
        });

    });
    isPackageMailVal = parseInt($("input:radio:checked[name='isPackageMail']").val());
    if (isPackageMailVal == 2) {
        $(".postage-detail", setting).hide();
    }
}

function initRegion(div) {//加载省市区
    div.css({
        "position": "absolute",
        "background": "#FFF",
        "border": "1px solid #AAA",
        "display": "none",
        "width": "560",
        "height": "360"
    });
    div.load('Region.htm?', function () {
        var div = $(this);
        div.find("a[name='close'],button[name='close']").click(function () {
            div.hide();
        });
        div.find("#region_ok").click(function () {
            var ids = ",";
            var name = "";
            var dataname = "";
            var procheck = $(".region-body input[name='province']:checked");

            procheck.each(function (i) {
                var citys = $(this).parent().parent();
                if (citys.find(".citys input[name='areas']").length == citys.find(".citys input[name='areas']:checked").length) {
                    if (this.value != "on" && this.value != "") {
                        var item = this.value.split(",");
                        if (i < (procheck.length - 1)) {
                            name += item[1] + "、";
                        } else {
                            name += item[1];
                        }
                    }
                } else {
                    var areascheck = citys.find(".citys input[name='areas']:checked");
                    areascheck.each(function (j) {
                        if (this.value != "on" && this.value != "") {
                            var item = this.value.split(",");
                            name += item[1] + "、";
                        }
                    });
                }
            });
            if (name.substring(name.length - 1, name.length) == "、") {
                name = name.substring(0, name.length - 1);
            }


            var checkedBox = $(".region-body input:checkbox:checked", div);
            var checkedBoxL = checkedBox.length;
            checkedBox.each(function (i) {
                //if ($(this).attr("name") == "region" || $(this).attr("id").indexOf("region") != -1) {
                //    return;
                //}

                //if ($(this).attr("name") == "province") {
                //    if (parseInt($(this).siblings("span[name='provinceNum']").text()) > 0) {
                //        return;
                //    }
                //}

                if (this.value != "on" && this.value != "") {
                    var item = this.value.split(",");
                    if (i < (checkedBoxL - 1)) {
                        dataname += item[1] + "、";
                    } else {
                        dataname += item[1];
                    }
                    ids += item[0] + ",";
                }

            });
            regionA.siblings(".area-group").html(name).attr("data-ids", ids).attr("data-text", dataname);
            div.hide();
        });
        setTimeout(function () {
            div.show();
            setRegionCheckbox();
        }, 100);
    });

}
function showRegion(e) {//显示对应省份下的市
    regionA = $(e);
    var regionOffset = regionA.offset();
    var div = $("#myRegion");
    $("input:checkbox", div).prop("checked", false);
    if (div.find("div").length == 0) {
        initRegion(div);
    } else {
        div.show();
        setRegionCheckbox();
    }
    div.css({

        //"top": (10) + "px",
        //"left": (10) + "px"
        "top": (regionOffset.top - 300) + "px",
        "left": (regionOffset.left - 300) + "px",
        "height": "auto"
    });
}

function setRegionCheckbox() {//设置地区是否可用选
    var myRegion = $("#myRegion");
    var _thisGroup = regionA.siblings(".area-group");

    var _thisIds = _thisGroup.attr("data-ids");

    if (_thisIds != undefined) {
        _thisIds = _thisIds.split(',');
        $(_thisIds).each(function (i, code) {
            if (code.length <= 0) return;
            $("#" + $.trim(code), myRegion).prop("checked", true);
        });
    }

    //去掉禁用
    $("input[name='province']").attr("disabled", false);
    $("input[name='areas']").attr("disabled", false);


    $(".setting .area-group").not(_thisGroup).each(function (i, div) {//市
        var ids = $(div).attr("data-ids").split(',');
        $(ids).each(function (j, code) {
            if (code.length <= 0) return;
            $("#" + $.trim(code), myRegion).attr("disabled", true);
        });
    });

    $(".province-name").each(function () {//省
        var _this = $(this);
        var citys = _this.siblings(".citys");
        var num = parseInt(_this.find("span[name='provinceNum']").text());
        if (num > 0 && num == $("input[disabled='disabled']", citys).length) {
            $("input:checkbox", _this).attr("disabled", true);
        } else if ($("input:checkbox:checked", citys).length > 0) {
            $("input:checkbox", _this).prop("checked", true);
        }
    });


}
function addArea(e) {//添加指定地区tr
    $("#myRegion").hide();
    var div = $(e).parent();
    if (div.siblings("div.tbl-except").find("table").length <= 0) {
        var section = section_temp.clone();
        section.removeAttr("id").removeAttr("style");
        section.appendTo(div.siblings("div.tbl-except"));
    } else {
        var tr = div.parent().find("tr").last();
        var section = section_temp.find("tr").last().clone();
        tr.after(section);
    }
}
//删除单行
function delRow(e) {
    confirmInfo("确认要删除当前地区的设置么？", function (confirmIndex) {
        var tr = $(e).parent().parent();
        if (parseInt($("input[name='firstArticleKG']", tr).attr("data-id")) > 0) {
            tr.hide();
        } else {
            $(e).parent().parent().remove();
        }
        confirmEnd(confirmIndex);
    });
}
//保存
function saveFreigth() {
    var templateName = $("#templateName");
    var eroorCss = { "border": "1px solid red" };

    if ($.trim(templateName.val()) == "") {
        templateName.css(eroorCss);
    } else {
        templateName.removeAttr("style");
    }
    $(".setting .section").find("input:text:visible").each(function () {
        var input = $(this);
        if ($.trim(input.val()) == "" || !validate.isFloat2(input.val())) {
            input.css(eroorCss);

        } else {
            input.removeAttr("style");
        }
    });
    if ($(".setting  input:text:visible[style*='border']").length > 0) {
        alertInfo("请输入必填项！");
        return;
    }
    var freightTem = {
        templateName: templateName.val(),
        isPackageMail: 1,//parseInt($("input:radio:checked[name='isPackageMail']").val()),
        areaRestricted: document.getElementById("areaRestricted").checked ? 0 : 1, //parseInt($("input:radio:checked[name='areaRestricted']").val()),
        shippingMethod: [],
        isFullFree: document.getElementById("isFullFree").checked ? 1 : 0,
        fullNum: parseInt($("#fullNum").val()),
        id: parseInt(templateName.attr("data-id"))
    }
    var shippingMethodAddOrUpdate = 0;
    //if (freightTem.isPackageMail == 1) {
    var noarea = false;
    $(".setting .section").each(function () {//运费方式 
        var section = $(this);
        var checkboxCheck = section.find("input[name='shippingMethod']");
        if (checkboxCheck[0].checked) {
            var defaultDiv = section.find(".default");
            var defaultMethod = {};

            var firstArticleKG = parseFloat(defaultDiv.find("input[name='firstArticleKG']").val());
            var firstCharge = parseFloat(defaultDiv.find("input[name='firstCharge']").val());
            var continueArticleKG = parseFloat(defaultDiv.find("input[name='continueArticleKG']").val());
            var continueCharge = parseFloat(defaultDiv.find("input[name='continueCharge']").val());

            if (firstArticleKG < 1 || continueArticleKG < 1) {
                alertInfo("件数不能小于1！");
                event.stopPropagation();
                return false;
            }

            if (firstCharge < 0 || continueCharge < 0) {
                alertInfo("运费不能小于0！");
                event.stopPropagation();
                return false;
            }

            defaultMethod.firstArticleKG = firstArticleKG;
            defaultMethod.firstCharge = firstCharge;
            defaultMethod.continueArticleKG = continueArticleKG;
            defaultMethod.continueCharge = continueCharge;

            //defaultMethod.firstArticleKG = parseFloat(defaultDiv.find("input[name='firstArticleKG']").val());
            //defaultMethod.firstCharge = parseFloat(defaultDiv.find("input[name='firstCharge']").val());
            //defaultMethod.continueArticleKG = parseFloat(defaultDiv.find("input[name='continueArticleKG']").val());
            //defaultMethod.continueCharge = parseFloat(defaultDiv.find("input[name='continueCharge']").val());
            defaultMethod.cmd = 0;
            defaultMethod.id = defaultDiv.find("input[name='firstArticleKG']").attr("data-id");
            defaultMethod.isDefaultShipp = 1;
            defaultMethod.shippingMethod = checkboxCheck.val();
            freightTem.shippingMethod.push(defaultMethod);
            shippingMethodAddOrUpdate++;
            section.find("tbody tr").each(function () {
                var tr = $(this);
                if (tr.find("div.area-group").text().indexOf("未添加地区") > -1) {
                    noarea = true;
                    return;
                }
                var defaultMethod = {};

                var firstArticleKG2 = parseFloat(tr.find("input[name='firstArticleKG']").val());
                var firstCharge2 = parseFloat(tr.find("input[name='firstCharge']").val());
                var continueArticleKG2 = parseFloat(tr.find("input[name='continueArticleKG']").val());
                var continueCharge2 = parseFloat(tr.find("input[name='continueCharge']").val());

                if (firstArticleKG2 < 1 || continueArticleKG2 < 1) {
                    alertInfo("件数不能小于1！");
                    event.stopPropagation();
                    return false;
                }

                if (firstCharge2 < 0 || continueCharge2 < 0) {
                    alertInfo("运费不能小于0！");
                    event.stopPropagation();
                    return false;
                }

                defaultMethod.firstArticleKG = firstArticleKG2;
                defaultMethod.firstCharge = firstCharge2;
                defaultMethod.continueArticleKG = continueArticleKG2;
                defaultMethod.continueCharge = continueCharge2;

                //defaultMethod.firstArticleKG = parseFloat(tr.find("input[name='firstArticleKG']").val());
                //defaultMethod.firstCharge = parseFloat(tr.find("input[name='firstCharge']").val());
                //defaultMethod.continueArticleKG = parseFloat(tr.find("input[name='continueArticleKG']").val());
                //defaultMethod.continueCharge = parseFloat(tr.find("input[name='continueCharge']").val());
                defaultMethod.shippingMethod = checkboxCheck.val();
                if (tr.is(":hidden") || isPackageMailVal == 2) {
                    defaultMethod.cmd = -1;
                }
                else {
                    defaultMethod.cmd = 0;
                }
                defaultMethod.id = tr.find("input[name='firstArticleKG']").attr("data-id");
                defaultMethod.isDefaultShipp = 0;
                var areaGroup = tr.find(".area-group");
                defaultMethod.distrctCode = areaGroup.attr("data-ids");
                defaultMethod.distrctName = $.trim(areaGroup.attr("data-text"));
                defaultMethod.SimpleName = $.trim(areaGroup.text());
                freightTem.shippingMethod.push(defaultMethod);
                shippingMethodAddOrUpdate++;
            });

        } else if (freightTem.id > 0) {  //删除
            var shippingMethod = {};
            shippingMethod.templateID = freightTem.id;
            shippingMethod.cmd = -1;
            var defaultDiv = section.find(".default");
            shippingMethod.id = parseInt(defaultDiv.find("input[name='firstArticleKG']").attr("data-id"));
            freightTem.shippingMethod.push(shippingMethod);
            shippingMethod.shippingMethod = checkboxCheck.val();
            freightTem.shippingMethod.push(shippingMethod);
        }

    });
    if (noarea) {
        alertInfo("指定地区城市为空！");
        return;
    }
    if (freightTem.shippingMethod.length <= 0) {
        alertInfo("请至少选择一种运送方式！");
        return;
    }
    //}
    var obj = TJSON.stringify(freightTem);

    var isSub = true;
    if (isSub) {
        isSub = false;
        $.ajax({
            url: "./Handler/Freight.ashx",
            data: { action: "editFreight", obj: obj, "addOrUpdate": shippingMethodAddOrUpdate },
            dataType: "json",
            type: 'POST',
            cache: false,
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (data.status) {
                    if (freightTem.id == 0 && isView) {
                        returnFreigth(freightTem.templateName, data.data.id);
                    } else {
                        winReload();
                    }
                }
                else {
                    alertInfo(data.message);
                }
                isSub = true;
            },
            error: function () {
                isSub = true;
                alertInfo("系统繁忙，请稍后！");
            }
        });
    }
}

//删除
function delFreight(id) {
    confirmInfo("删除后将造成使用该运费模板的商品运费为0,是否确认删除？", function () {
        var freightTem = {
            id: id,
            cmd: -1
        }
        var obj = TJSON.stringify(freightTem);
        $.ajax({
            url: "./Handler/Freight.ashx",
            data: { action: "editFreight", obj: obj },
            dataType: "json",
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (data.status) {
                    alertOK("删除成功！", function () {
                        winReload();
                    });

                }
                else {
                    alertInfo(data.message);
                }

            },
            error: function () {
                isSub = true;
                alertInfo("删除失败！");
            }
        });
    });
}

function copy(id) {
    $.ajax({
        url: "./Handler/Freight.ashx",
        data: { action: "copy", id: id },
        dataType: "json",
        cache: false,
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                alertOK("复制成功！", function () {
                    winReload();
                });

            }
            else {
                alertInfo(data.message);
            }
        },
        error: function () {
            alertInfo("复制失败！");
        }
    });

}

