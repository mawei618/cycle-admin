function SaveMobile() {
    $.ajax({
        url: "CompanyInfo.html",
        data: { action: "checkMobile", mobile: $.trim($("#recommendMobile").val()) },
        dataType: "json",
        type: 'POST',
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
}

$(function () {
    $.formValidator.initConfig({
        formid: "subform", onsuccess: function () {
            clickSubmit(); return false;
        }
    });

    $("#legalPerson").formValidator({ onshow: "请输法人代表", onfocus: "法人代表不能为空", oncorrect: " " })
   .inputValidator({ min: 1, max: 20, empty: { leftempty: false, rightempty: false, emptyerror: "法人代表两边不能有空符号" }, onerror: "法人代表不能为空且最多输入20个字符,请确认" });

    $("#capital").formValidator({ tipid: "capitalTip", onshow: "请输注册资金", onfocus: "万元 注册资金必须大于0" })
   .inputValidator({ min: 1, max: 6, empty: { leftempty: false, rightempty: false, emptyerror: "注册资金两边不能有空符号" }, onerror: "最多输入6位数,请确认" })
    .functionValidator({ fun: allEmpty });
    function allEmpty(val, elem) {
        if (val !== null && val != "") {
            var num = parseFloat(val).toFixed(2);
            if (num <= 0) {
                return '注册资金必须大于0';
            }
        } else {
            return '请输注册资金';
        }
        return true;
    }

    $("#businessStartTime").formValidator({ onshow: "请选择营业执照有效期", onfocus: "请选择营业执照有效期", oncorrect: " " })
        .inputValidator({ min: 10, max: 50, onerror: "请选择营业执照有效期" });;


    $("#licenseAppScope").formValidator({ onshow: "请输营业执照经营范围", onfocus: "参照营业执照，请填写正确一致的信息", oncorrect: " " })
        .inputValidator({ min: 1, max: 200, empty: { leftempty: false, rightempty: false, emptyerror: "营业执照经营范围不能为空且最多输入200个字符" }, onerror: "营业执照经营范围不能为空且最多输入200个字符,请确认" });

    $("#officialUrl").formValidator({ onshow: " ", empty: true, onempty: "", onfocus: "如：http://www.myhomevip.com", oncorrect: " " })
     .regexValidator({ regexp: "url", datatype: "enum", onerror: "你输入的公司官网地址格式不正确" });

    $("#customerPhone").formValidator({ onshow: " ", empty: true, onempty:"", onfocus: "格式：020-88888888(或0208-8888888)", oncorrect: " " })
     .regexValidator({ regexp: "tel", datatype: "enum", onerror: "你输入的电话号码格式不正确" });

    $("#fax").formValidator({ onshow: " ", empty: true, onempty: "", onfocus: "格式：020-88888888(或0208-8888888)", oncorrect: " " })
     .regexValidator({ regexp: "tel", datatype: "enum", onerror: "你输入的传真格式不正确" });

    $("#contactName").formValidator({ onshow: "请输联系人", onfocus: "请输入联系人", oncorrect: " " })
        .inputValidator({ min: 1, max: 20, empty: { leftempty: false, rightempty: false, emptyerror: "联系人两边不能有空符号" }, onerror: "联系人不能为空且最多输入20个字符,请确认" });

    $("#email").formValidator({ onshow: "请输电子邮箱", onfocus: "请输入店铺负责人电子邮箱", oncorrect: " " }).
        inputValidator({ min: 1, max: 20, empty: { leftempty: false, rightempty: false, emptyerror: "电子邮箱两边不能有空符号" }, onerror: "电子邮箱不能为空且最多输入20个字符,请确认" })
        .regexValidator({ regexp: "email", datatype: "enum", onerror: "你输入的电子邮箱格式不正确" });

});

function clickSubmit() {
    var model = $("#subform").form2json();

    $.ajax({
        url: "./CompanyInfo.aspx",
        data: { action: "save", obj: model },
        dataType: "json",
        type: 'POST',
        success: function (data) {
            if (data.status) {
                alertOK("提交成功！", function () {
                    winReload();
                });
            } else {
                alertInfo(data.message);
            }
        },
        error: function () {
            alertInfo("资料提交失败，请稍后再试！");
        }
    });
}