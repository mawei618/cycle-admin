
var editorId = "txtDescribe";
var editor;

function editImg(id, src) {
    $.ajax({
        url: "ShopInfo.html",
        data: { action: "editImg", f: id, src: src },
        dataType: "json",
        type: 'POST',
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                if (src.indexOf(".") > -1)
                    src = domain.img + GetImgFormat(src, "110x110");
                $(id).attr("src", src);
            }
            else {
                alertInfo(data.message);
            }

        },
        error: function () {
            alertInfo("更新图片出错！");
        }
    });
}
$(function () {
    $("#a_shopBanner").photo({
        id: "#shopBannerList", insertClick: function (imgs) {
            var imgSrc = imgs[0].src;
            editImg("#imgShopBanner", imgSrc);
            return true;
        }
    });
    $("#a_shopwapBanner").photo({
        id: "#shopwapBannerList", insertClick: function (imgs) {
            var imgSrc = imgs[0].src;
            editImg("#imgshopwapBanner", imgSrc);
            return true;
        }
    });
    $("#a_shopLogo").photo({
        id: "#imgShopLogoList", insertClick: function (imgs) {
            var imgSrc = imgs[0].src;
            editImg("#imgShopLogo", imgSrc)
            return true;
        }
    });


    editor = $("#describe").editor({ pageSize: 10, width: 650, height: 250 });

    $('#formShopInfo').ajaxForm({
        url: "ShopInfo.html?action=saveData",
        dataType: 'json',
        beforeSubmit: function () {
            $("span").remove(".alert-warn").remove(".alert");
            var warn = $("<span class='alert-warn'></span>").show();
            var shopName = $("input[name='shopName']");
            var contactAddress = $("input[name='contactAddress']");

            var bol = true;

            if ($.trim(shopName.val()) == "") {
                shopName.after(getWarn().text("请填写店铺名称"));
                bol = false;
            }
            if ($.trim(contactAddress.val()) == "") {
                contactAddress.after(getWarn().text("请填写联系地址"));
                bol = false;
            }
            //if ($("#isLineShop").attr("checked")) {
            //    if ($.trim($("#returnRatio").val()).length == 0 || parseFloat($.trim($("#returnRatio").val())) < 0 || parseFloat($.trim($("#returnRatio").val()))>100) {
            //        $("#returnRatio").after(getWarn().text("线下店铺让利比在0-100之间"));
            //        bol = false;
            //    }
            //}
            return bol;
        },
        success: function (data) {
            $("span").remove(".alert-warn");
            if (data.status) {
                alertOK(data.message);
            } else {
                alertInfo(data.message);
            }
            fadeOutAlert(".alert");
        }
    });


    $('#shopBannerBg').minicolors({
        control: $(this).attr('data-control') || 'hue',
        defaultValue: $(this).attr('data-defaultValue') || '',
        inline: $(this).attr('data-inline') === 'true',
        letterCase: $(this).attr('data-letterCase') || 'lowercase',
        opacity: $(this).attr('data-opacity'),
        position: $(this).attr('data-position') || 'bottom left',
        change: function (hex, opacity) {
            var log;
            try {
                log = hex ? hex : 'transparent';
                if (opacity) log += ', ' + opacity;
            } catch (e) { }
        },
        theme: 'default'
    });

    $("#isLineShop").on("click", function () {
        if ($(this).attr("checked")) {
            $(".returnRatio").show();
        } else {
            $(".returnRatio").hide();
        }
    });
});

function myOnsubmit() {
    editor.sync();

    return true;
}
function uploadLogo(e) {

    var li = $(e).parents("li.ml3");
    var fileElementId = $(e).attr("id");
    var imgId = "";
    var msg;
    var tipId;
    if (fileElementId == "shopBanner") {
        msg = "建议文件格式GIF、JPG、JPEG、PNG文件大小1M以内，1400x140";
        imgId = "#imgShopBanner";
        tipId = "#infoshopBannerTip";
    } else if (fileElementId == "shopwapBanner") {
        msg = "建议文件格式GIF、JPG、JPEG、PNG文件大小1M以内，750x234";
        imgId = "#imgshopwapBanner";
        tipId = "#infoshopwapBannerTip";
    }
    else {
        msg = "建议文件格式GIF、JPG、JPEG、PNG文件大小80K以内，尺寸200x200";
        imgId = "#imgShopLogo";
        tipId = "#infoTip";
    }
    $("#infoTip", li).text("图片上传中...");
    $.ajaxFileUpload({
        url: "ShopInfo.aspx?action=uploadLogo&f=" + fileElementId,
        secureuri: false,
        fileElementId: fileElementId,
        dataType: "json",
        success: function (data) {
            if (data.status == false) {
                $(tipId, li).text(data.message);
            }
            else {
                $(imgId, li).attr("src", data.message);
                $(tipId, li).text(msg);
            }
        },
        error: function (data, status, e) {
            $(tipId, li).text("上传出错");
        }
    });

}
