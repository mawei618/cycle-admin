drpAreaList = ['country', 'selProvince', 'city', 'town'];
if (document.getElementById(drpAreaList[0]).options.length <= 1) {
    setup();
    SelectBind('中国');
}
$("#JaddAddress").click(function () {
    scrollEdit();
})
$("#btnSave").click(function () {
    var model = {
        country: $("#country").val(),
        province: $("#selProvince").val(),
        city: $("#city").val(),
        area: $("#town").val(),
        countryName: $("#country").find("option:selected").text(),
        provinceName: $("#selProvince").find("option:selected").text(),
        cityName: document.getElementById("city").selectedIndex == 0 ? "" : $("#city").find("option:selected").text(),
        areaName: document.getElementById("town").selectedIndex == 0 ? "" : $("#town").find("option:selected").text(),
        detailAddress: $("#detailAddress").val(),
        contactName: $("#contactName").val(),
        phoneNumber: $("#phoneNumber").val(),
        telephoneNumber: $("#areaCode").val() + "-" + $("#telNum").val() + "-" + $("#suffix").val(),
        isDefault: $("#setDefaultAdr").is(':checked') ? 1 : 0,
        id: $("#formModel").attr("data-id") == "" ? 0 : $("#formModel").attr("data-id")
    };
    if (!CheckAreaValidator()) {
        alertInfo("请选择地区下拉框");
        return;
    }
    if (model.detailAddress.length > 50) {
        alertInfo("详细地址最多填写50个字符");
        return;
    }
    if (model.detailAddress == "") {
        alertInfo("请填写详细地址！");
        $("#detailAddress", "#formModel").focus();
        return;
    }
    if (model.contactName == "") {
        alertInfo("请填写联系人！");
        $("#contactName", "#formModel").focus();
        return;
    }
    if (model.phoneNumber == "" && model.telephoneNumber=="--") {
        alertInfo("手机号码、固定电话必须填一项！");
        $("#phoneNumber", "#formModel").focus();
        return;
    }
    if (model.id == null || typeof model.id == "undefined") {
        model.id = 0;
    } else {
        model.id = parseInt(model.id);
    }
    var josn = TJSON.stringify(model);
    $.ajax({
        url: "Handler/ShopDepotAddress.ashx",
        data: { action: "save", obj: josn },
        type: 'POST',
        dataType: "json",
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                alertOK("保存成功！", function () {
                    winReload();
                });
            }
            else {
                alertInfo(data.message);
            }

        },
        error: function () {
            alertInfo("保存出错！");
        }
    });
})

function isDefault(id) {
    $.ajax({
        url: "Handler/ShopDepotAddress.ashx",
        data: { action: "updateAddressDefault", id: id },
        type: 'POST',
        dataType: "json",
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                alertOK("设置成功！", function () {
                    winReload();
                });
            }
            else {
                alertInfo(data.message);
            }

        },
        error: function () {
            alertInfo("保存出错！");
        }
    });

}

function getDate(id) {
    scrollEdit();
    $("#formModel").attr("data-id", "0");
    $("#formModel")[0].reset();
    $.ajax({
        url: "Handler/ShopDepotAddress.ashx",
        data: { action: "getModel", id: id },
        type: 'POST',
        dataType: "json",
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                var model = data.data;
                SelectBind(model.countryName + " " + model.provinceName + " " + model.cityName + " " + model.areaName);

                $("#contactName").val(model.contactName);
                $("#phoneNumber").val(model.phoneNumber);
                $("#telephoneNumber").val(model.telephoneNumber);
                $("#detailAddress").val(model.detailAddress);
                $("#orderNo").val(model.orderNo);
                $("#setDefaultAdr").prop("checked", model.isDefault > 0);

                var telephoneNumber = model.telephoneNumber.toString();
                if (telephoneNumber != "") {
                    var item = telephoneNumber.split('-');
                    if (item.length == 3) {
                        $("#areaCode").val(item[0]);
                        $("#telNum").val(item[1]);
                        $("#suffix").val(item[2]);
                    }
                }
               

                $("#formModel").attr("data-id", id);
                loadAddr($('#comDistrictID'), model.province, model.city);
                loadAddr($('#comArea'), model.city, model.area);
                if ($("#comProvinceDistrictID option").length > 0) {
                    $("#comProvinceDistrictID").val(model.province);
                    province = 0;
                } else {
                    province = model.province;
                }
            }
            else {
                alertInfo(data.message);
            }

        },
        error: function () {
            alertInfo("获取地址出错！");
        }
    });
}

function delDate(id) {
    confirmInfo("确定要删除该数据吗？", function () {
        $.ajax({
            url: "Handler/ShopDepotAddress.ashx",
            data: { action: "delModel", id: id },
            type: 'POST',
            dataType: "json",
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (data.status) {
                    winReload();
                }
                else {
                    alertInfo(data.message);
                }

            },
            error: function () {
                alertInfo("出错！");
            }
        });
    });
}

function loadAddr(sel, pid, selValue) {

    if (pid == -1) {
        sel.empty();
        sel.append("<option value='0' selected='selected'></option>");
        return;
    }
    $.ajax({//Ajax异步提交
        async: true,
        url: domain.font + "/Handler/Common.ashx",
        type: "POST",
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: { action: "loadAddr", parentId: pid },
        success: function (data) {
            sel.empty();
            if (data) {
                if (data.length > 0) {
                    sel.append("<option value='0' selected='selected'>请选择</option>");
                } else {
                    sel.append("<option value='0' selected='selected'></option>");
                }

                $(data).each(function (i, e) {
                    sel.append("<option value='" + e.id + "'>" + e.districtName + "</option>");
                });
                if (selValue != undefined && selValue > 0) {
                    sel.val(selValue);
                }
                if (sel.attr("id") == "comProvinceDistrictID" && province > 0) {
                    sel.val(province);
                }
            }
        },
        error: function (xhr) {
            alertInfo("获取地址出错！");
        }
    });
}

function scrollEdit() {
    $("html,body").animate({ scrollTop: $("#addAddressMain").offset().top }, 500);
}

$(".number").live("keyup paste", function () {
    var reg = $(this).val().match(/\d+/);
    var txt = '';
    if (reg != null) {
        txt = reg[0];
    }
    $(this).val(txt);
})