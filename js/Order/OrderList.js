$(function () {
    var tabType = getQueryString("tabType");

    if (tabType != null && tabType != "") {
        $(".item-list-tabs li").removeClass("current");
        $(".item-list-tabs li[data='" + tabType + "']").addClass("current");
    }
    //选项卡事件
    $(".item-list-tabs li").on("click", function () {
        var data = $(this).attr("data");
        if (data != "") {
            $(this).siblings().removeClass("current");
            $(this).addClass("current");
            if (data != -1) {
                $("#comOrderStatus").val(data);
                $("#comEvalStatus").val(0);
            }
            else {
                $("#comEvalStatus").val(1);
                $("#comOrderStatus").val(0);
            }
            $("#tabType").val(data);
            $("#searchData").click();
        }
    });

    //查询条件分钟控制
    $(".minute").on("blur", function () {
        var val = $(this).val();
        var bol = validate.isNum(val);
        if (!bol) {
            $(this).val(0);
        }
        else {
            if (val > 59) {
                $(this).val(59);

            }
        }
    });

    //关闭交易、修改价格事件
    $(".trade-status .close-order").on("click", function () {
        var height = $(window).height();
        var width = $(window).width();
        var id = $(this).parents("tr").attr("data");
        var code = $(this).parents("tr").attr("code");
        var left = 0, top = 0, iframeWidth = 0, iframeHeight = 0;
        var src = "CancelOrder.html?id=" + id + "&code=" + code + "&s=" + getDateStr(); //关闭订单
        var data = "cancel";
        if ($(this).hasClass("modify-price")) {//修改价格
            src = "ModifyPrice.html?id=" + id + "&code=" + code+"&s=" + getDateStr();
            iframeWidth = 767;
            iframeHeight = 380;
            $("#panel").css({ width: 787, height: 400 });
            left = width / 2 - 350;
            top = height / 2 - 140;
            data = "modify";
        }
        else {
            iframeWidth = 380;
            iframeHeight = 250;
            $("#panel").css({ width: 400, height: 270 });
            left = width / 2 - 200;
            top = height / 2 - 100;
        }
        $("#showPanel iframe").css({ width: iframeWidth, height: iframeHeight });
        $("#showPanel iframe").attr("src", src);
        $("#showPanel").show().css({ left: left, top: top }).attr("data", data);
        $("#panelMask").show();

    });

    //窗口大小改变事件
    $(window).resize(function () {
        var height = $(window).height();
        var width = $(window).width();

        var obj = $("#showPanel");
        if (!obj.is(":hidden")) {
            var data = obj.attr("data");
            var left = 0, top = 0;
            if (data == "modify") {
                left = width / 2 - 350;
                top = height / 2 - 140;
            }
            else {
                left = width / 2 - 200;
                top = height / 2 - 100;
            }
            obj.css({ left: left, top: top });
        }

    });

    //关闭交易窗口事件
    $(".container-close").on("click", function () {
        $("#showPanel,#panelMask").hide();
        $("#showPanel iframe").attr("src", "").html("");

    });

    $("#resetData").click(function () {
        $("#trade-search-box").find("input[type='text']").each(function () {
            if (!$(this).hasClass("minute")) {
                $(this).val("");
            }
        })
        $("#trade-search-box").find("select").each(function () {
            $(this).get(0).selectedIndex = 0;
        })
    })

});