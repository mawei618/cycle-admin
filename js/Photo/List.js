$(function () {

    var options = {
        beforeSubmit: showRequest,  // pre-submit callback 
        success: showResponse, // post-submit callback  
        type: 'post',        // 'get' or 'post', override for form's 'method' attribute 
        dataType: 'json',        // 'xml', 'script', or 'json' (expected server response type) 
        clearForm: true,       // clear all form fields after successful submit 
        resetForm: true        // reset the form after successful submit 
    };

    // bind to the form's submit event 
    $('#formRepace').submit(function () {
        $(this).ajaxSubmit(options);
        return false;
    });

    $("#all").click(function () {
        $("input[name='img']").prop("checked", this.checked);
    });
    var cid = getQueryString("cid");
    cid = cid == undefined ? 0 : cid;
    $("#cid_" + cid).addClass("select");
    iniCopy();
});

function iniCopy() {
    $('.copy-btn').mouseover(function () {
        $(this).zclip({
            path: '../Js/ZeroClipboard/ZeroClipboard.swf',
            copy: function () {
                var a = $(this);
                var text = $.trim(a.html());
                var html = a.parent().parent().attr("name");
                if (text == "代码") {
                    html = "<img src=\"" + a.parent().parent().attr("name") + "\" />";
                }
                return html;
            },
            beforeCopy: function () { },
            afterCopy: function () {
                alertOK("复制成功！");
            }
        });
        $(this).unbind("mouseover");
    });
}

// pre-submit callback 
function showRequest(formData, jqForm, options) {
    if (formData[0].value.length <= 0) {
        alertInfo("请选择要上传的图片！");
        return false;
    }
    if (formData[1].value == "0") {
        alertInfo("请选择要替换的图片！");
        return false;
    }
    layerClose = layer.load();
    return true;
}

function closeRep() {
    layer.close(layerIndex);
}
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {


    if (responseText.status) {
        lalertOK("图片替换成功");
        var repImg = $("#" + repID);
        repImg.attr("src", repImg.attr("src") + "?");
    } else {
        alertInfo(responseText.message);
    }
    layer.close(layerIndex);
    layer.close(layerClose);

}

var repID = "";
var layerIndex = 0, layerClose = 0;
function test(e) {
    var form = $("#formRepace");
    repID = $(e).attr("name");
    var para = repID.split("_");
    form.find("input[name='cid']").val(para[1]);
    form.find("input[name='id']").val(para[0]);
    layerIndex = $.layer({
        type: 1,
        title: "替换图片",
        offset: ['150px', ''],
        border: false,
        area: ['400px', '150px'],
        page: { dom: '#repImg' }
    });
}
function delAll() {
    if ($("input[name='img']:checked").length == 0) {
        alertInfo("请选择要删除的图片！");
        return;
    }
    var ids = "0";
    $("input[name='img']:checked").each(function (i, e) {
        ids += "," + e.value;
    });
    del(ids);
}

function del(id) {
    confirmInfo('是否删除该图片，删除图片后您可以从回收站还原图片？', function () {
        $.ajax({
            type: "Post",
            cache: false,
            dataType: "json",
            url: "./Handler/Photo.ashx",
            data: { action: "DelImg", id: id },
            success: function (data) {
                if (!checkLogin(data)) {
                    return false;
                }
                if (data.status) {
                    alertOK("图片删除成功");
                    id = id.toString();
                    if (id.indexOf(",") > -1) {
                        var count = 0;
                        $("input[name='img']:checked").each(function (i, e) {
                            $("img[id^='" + e.value + "_']").parent().parent().remove();
                            count++;
                        });
                        if (count == 20) {
                            window.location = window.location;
                        }
                    } else {
                        $("img[id^='" + id + "_']").parent().parent().remove();
                    }
                } else {
                    alertInfo("图片删除失败");
                }
            }
        });
    });


}


var moveIndex; var moveIDs = "";
//移动分类
function moveShow(e) {
    if (e) {
        moveIDs = $(e).siblings(":checkbox").val();//单个
    } else {//批量
        moveIDs = "";
        if ($("input[name='img']:checked").length == 0) {
            alertInfo("请选择要移动的图片！");
            return;
        }

        $("input[name='img']:checked").each(function (i, e) {
            moveIDs += e.value + ",";
        });

        moveIDs = moveIDs.substring(0, moveIDs.length - 1);
    }
    moveIndex = $.layer({
        type: 1,
        title: "移动分类图片",
        offset: ['150px', ''],
        border: false,
        area: ['250px', '150px'],
        page: { dom: '#moveImg' }
    });
}
function closeMove() {
    layer.close(moveIndex);
}
function move() {
    var cid = getQueryString("cid");
    cid = cid == undefined ? 0 : cid;

    var newCid = $("#selCateMove").val();
    if (cid == newCid) {
        alertInfo("分类未移动，请选择其他分类！");
        return;
    }
    $.ajax({
        type: "Post",
        cache: false,
        dataType: "json",
        url: "./Handler/Photo.ashx",
        data: { action: "MoveImg", id: moveIDs, newCid: newCid },
        success: function (data) {
            if (!checkLogin(data)) {
                return false;
            }
            if (data.status) {
                alertOK("图片移动成功", function () {
                    winReload();
                });

            } else {
                alertInfo("图片移动失败");
            }
        }
    });
}