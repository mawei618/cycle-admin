function cancel() {
    $("#formModel").hide();
}
function addModel() {
    $("#formModel").show();
}
function isNum(val) {// 验证是否数字
    var patten = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
    return patten.test(val);
}
$(function () {

    $("#savebank").click(function () {
        //银行的国家省份城市
        var bankDistrictName = $("#countryBank").find("option:selected").text();
        if ($("#ProvinceBank").val() != "" && $("#ProvinceBank").val() > 0) {
            bankDistrictName += " " + $("#ProvinceBank").find("option:selected").text();
        }
        if ($("#CityBank").val() != "" && $("#CityBank").val() > 0) {
            bankDistrictName += " " + $("#CityBank").find("option:selected").text();
        }
        var model = {
            brankName :$.trim($("#brankName").val()),
            bankAccountName: $.trim($("#bankAccountName").val()),
            bankAccount: $.trim($("#bankAccount").val()),
            bankDistrictName: bankDistrictName,
            BankBranch: $.trim($("#BankBranch").val())
        }
        if (model.bankDistrictName.length <= 0) {
            alertInfo("请选择开户银行所在城市！");
            return false;
        }
        if ($("#TipDrpAreaBank").html().length > 1)
        {
            alertInfo("请选择开户银行所在城市！");
            return false;
        }
        if (model.brankName.length <= 0) {
            alertInfo("请选择开户银行！");
            return false;
        }
        if (model.bankAccountName.length <= 0) {
            alertInfo("请输入账户名称！");
            $("#bankAccountName").focus();
            return false;
        }
        if (model.bankAccount.length <= 0) {
            alertInfo("请输入开户账号！");
            $("#bankAccount").focus();
            return false;
        }
        if (model.bankAccount != $.trim($("#bankAccountConfirm").val())) {
            alertInfo("2次账号不一致,请确认！");
            $("#bankAccountConfirm").focus();
            return false;
        }
        if (model.BankBranch.length <= 0){
            alertInfo("请输入所属支行！");
            $("#BankBranch").focus();
            return false;
        }
        var josn = TJSON.stringify(model);
        $.layer({
            shade: [0],
            area: ['310px', 'auto'],
            title: ['提示', true],
            dialog: {
                msg: '确定提交账户信息？<br/><span class="red">请仔细核对信息，提交后不可修改</span>',
                btns: 2,
                type: -1,
                btn: ['取消', '确定'],
                yes: function (index) {
                    layer.close(index);
                }, no: function (index) {
                    $.ajax({
                        url: "Handler/Commom.ashx",
                        data: { action: "SetShopCooperation", obj: josn },
                        type: 'POST',
                        dataType: "json",
                        success: function (data) {
                            if (data.status) {
                                alertOK("提交成功！", function () {
                                    winReload();
                                });
                            }
                            else {
                                alertInfo(data.message);
                            }
                        },
                        error: function () {
                            alertInfo("出错！");
                        }
                    });
                }
            }
        });
    });

    $("#save").click(function () {
        var amount = $.trim($("#money").val());
        if (amount.length <= 0) {
            alertInfo("请输入要提现的金额！");
            $("#money").focus();
            return false;
        }
        if (!isNum(amount)) {
            alertInfo("金额格式不正确！");
            $("#money").focus();
            return false;
        }
        if (parseFloat(amount) <= 0) {
            alertInfo("请输入要提现的金额！");
            $("#money").focus();
            return false;
        }
        if (parseFloat(amount) > parseFloat($.trim($("#hidAmt").val()))) {
            alertInfo("提现金额不能大于余额！");
            $("#money").focus();
            return false;
        }
        var fee = amount * parseFloat($("#shopFee").val()) * 0.01;
        fee = ToManeyUp(fee, 2);
        $.layer({
            shade: [0],
            area: ['310px', 'auto'],
            title: ['申请提现', true],
            dialog: {
                msg: '提现金额：<i class="prize-icon"></i>' + amount + '<br/>手 续 费：<i class="prize-icon"></i>' + fee + '<br/>实际到账：<span class="red"><i class="prize-icon"></i>' + (amount - fee).toFixed(2) + '</span>',
                btns: 2,
                type: -1,
                btn: ['取消', '确认提现'],
                yes: function (index) {
                    layer.close(index);
                }, no: function (index) {
                    $.ajax({
                        url: "Handler/Commom.ashx",
                        data: { action: "aplayWithdrawals", amount: amount },
                        type: 'POST',
                        dataType: "json",
                        success: function (data) {
                            if (!checkLogin(data)) {
                                return false;
                            }
                            if (data.status) {
                                alertOK("申请成功！", function () {
                                    winReload();
                                });

                            }
                            else {
                                alertInfo(data.message);
                            }

                        },
                        error: function () {
                            alertInfo("出错！");
                        }
                    });
                }
            }
        });
    });
});