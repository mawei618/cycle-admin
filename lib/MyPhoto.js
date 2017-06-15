
(function ($) {
    var domainJs = domain.misc + "/member/default/js/",
        domainCss = domain.misc + "/member/default/css/"
    $.fn.extend({
        //将可选择的变量传递给方法
        photo: function (options) {
            //设置默认值并用逗号隔开
            var defaults = {
                width: 800,
                height: 500,
                pageSize: 12,
                rows: 2,
                scripts: [domainJs+'My97DatePicker/WdatePicker.js', domainJs+'jquery.pagination.js', domainJs+'uploadify/jquery.uploadify.js'],
                styles: [domainCss + 'pagination.css', domainJs + 'uploadify/uploadify.css', domainCss + 'UserControl/KindEditor.css'],
                piclist: ".pic-list",
                id: "#photoList",
                afterCreatel: function () { },
                insertClick: function (imgs) { }
            }
            var options = $.extend(defaults, options);
            var token = "";

            if (!/msie/.test(navigator.userAgent.toLowerCase())) {
                $.post("/Photo/Handler/Photo.ashx", { action: "getToken" }, function (data) {
                    if (!checkLogin(data)) {
                        return false;
                    }
                    token = data.data;
                }, "json");
            }
            var body = $("body");
            $(options.scripts).each(function (i, e) {
                if ($("script[src*='" + e + "']").length == 0) {
                    body.append("<script src=\"" + e + "?t=" + Math.random() + "\" type=\"text/javascript\"></script>");
                }

            });

            $(options.styles).each(function (i, e) {
                if ($("link[href*='" + e + "']").length == 0) {
                    body.append("<link href=\"" + e + "\" rel=\"stylesheet\" type=\"text/css\" />");
                }
            });


            var container = $("<div>").css("overflow", "hidden");
            var textarea = $(this);
            //textarea.after(container);
            // textarea.appendTo(container);
            var photoList = $(options.id)
            var picList = $("<div>").addClass("pic-list").hide();
            picList.css({ width: options.width, "margin-top": "5px" });
            photoList.append(picList);
            var fileId = "file_upload";
            while ($("#" + fileId).length > 0) {
                fileId += "1";
            }

            var search = " <ul  class=\"tab\"> <li class=\"selected\">从图片空间中选择 </li> <li>上传新图片 </li></ul> ";
            search += "<div class=\"list-container\"><div>";
            search += "<label>分类：</label><select name=\"cid\"> <option value=\"0\">所有分类</option></select>";
            search += "<label> 上传日期：</label> <input type=\"text\" style=\"width:90px\" name=\"startDate\"  class=\"Wdate\" onfocus=\"WdatePicker()\" />";
            search += " <input type=\"text\" style=\"width:90px\" name=\"endDate\"   class=\"Wdate\" onfocus=\"WdatePicker()\" />";
            search += " <input type=\"text\" name=\"oldImageName\"  style=\"width:90px\"  class=\"text20\" /> <button cmd=\"doSearch\" class=\"btn btn-ts btn-corBlue\">搜索</button></div>";
            search += " <div><div class=\"list-box\"><div class=\"list\" id=\"list\"> <ul class=\"list-item\"> </ul> </div> </div></div>";
            search += " <div class=\"digg\"> </div>";
            search += "  <div class=\"opt\" style='position:relative'> <button cmd=\"insert\" class=\"btn btn-ts btn-corOrange\"> 插入</button> <button cmd=\"cancel\"class=\"btn btn-ts btn-corGrey\">取消</button></div></div>";
            search += "<div class='list-container' style='display:none;'> <input type=\"file\" name=\"file_upload\" id=\"" + fileId + "\"  /></div>";
            picList.append(search);
            var itemH = options.rows * 175;
            picList.find(".list-item").css({ height: itemH })
            container.css({ width: options.width + 10 });
            // textarea.css({ width: options.width });
            // $(this).css({ width: options.width, height: options.height });

            textarea.click(function () {
                photoList.show();
                doSearch(0);
                picList.show();
                loadCate();
            });

            photoList.find(".opt button[cmd='insert']").click(function () {
                var imgs = [];
                photoList.find(".list-item .select").each(function () {
                    var img = $(this).find("img").attr("src");

                    if (img.indexOf("/upload/") > -1) {
                        img = img.substring(0, img.lastIndexOf("_"));
                        img = /upload/ + img.split("/upload/")[1];
                    }
                    var model = {
                        id: parseInt($(this).find("img").attr("_id")),
                        src: img
                    }
                    imgs.push(model);
                    $(this).removeClass("select");
                });
                if (options.insertClick(imgs)) {
                    photoList.hide();
                }
                return false;
            });
            photoList.find(".tab li").click(function () {
                $(this).addClass("selected").siblings("li").removeClass("selected");
                var index = $(this).index();
                var div = $(this).parent().siblings("div:eq(" + index + ")");
                div.show().siblings("div").hide();
            });

            loadCate: function loadCate() {
                var selectCate = photoList.find("select");
                if (selectCate.find("option").length <= 1) {
                    $.ajax({
                        type: "Post",
                        cache: false,
                        dataType: "json",
                        url: "/UserControl/Handler/UserControl.ashx",
                        data: { action: "getPhotoCate" },
                        success: function (data) {
                            if (!checkLogin(data)) {
                                return false;
                            }
                            var selectCate = photoList.find("select");
                            var cidData = $(data)
                            cidData.each(function (i, e) {
                                selectCate.append("<option value=\"" + e.id + "\">" + e.className + "</option>");
                            });

                            var files = picList.find("input:file");
                            files.uploadify({
                                'sizeLimit': 1024 * 1024 * 1, //设置单个文件大小限制，单位为byte   
                                'onQueueComplete': function (queueData) {
                                    picList.find(".tab li").eq(0).trigger("click");
                                    picList.find("button[cmd='doSearch']").trigger("click");
                                },
                                'onUploadSuccess': function (file, data, response) {
                                    data = eval("(" + data + ")");
                                    if (!checkLogin(data)) {
                                        return false;
                                    }
                                    if (data != "1") {
                                        //alert(data.filename+"上传成功");
                                    }
                                },
                                'onUploadStart': function (file) {

                                    var cidVal = selectCate.val();
                                    if (cidVal == "0") {
                                        cidVal = cidData[0].id;
                                    }

                                    var data = { 'action': 'addPic', cid: cidVal, token: "" }
                                    if (token != undefined && token.length > 0) {
                                        data.token = token
                                    }

                                    files.uploadify('settings', 'formData', data);
                                },
                                'fileObjName': 'Filedata', // 上传参数名称
                                'buttonText': '浏览',  // 按钮上的文字
                                'fileTypeDesc': '图片类型', //出现在上传对话框中的文件类型描述
                                'fileTypeExts': '*.jpg;*.jpeg;*.png;*.gif;*.bmp', //控制可上传文件的扩展名，启用本项时需同时声明fileDesc
                                'swf': '/js/uploadify/uploadify.swf',
                                'uploader': '/Photo/Handler/Photo.ashx'
                            });

                        }
                    });
                }
            }

            photoList.find(".opt button[cmd='cancel']").click(function () {
                photoList.hide();
                return false;
            });
            photoList.find("button[cmd='doSearch']").click(function () {
                doSearch(0);
                return false;
            });


            doSearch: function doSearch(page) {
                var ul = photoList.find(".list-item");
                ul.html("<li class=\"li-none\">数据加载中，请稍后……</li>");
                var pagesize = options.pageSize;
                var count = 0;
                var obj = {
                    oldImageName: photoList.find("input[name='oldImageName']").val(),
                    startDate: photoList.find("input[name='startDate']").val(),
                    endDate: photoList.find("input[name='endDate']").val(),
                    classID: photoList.find("select[name='cid']").val()
                }
                var data = {
                    action: "getPicList",
                    page: (page + 1),
                    rows: pagesize,
                    obj: TJSON.stringify(obj)
                };
                $.ajax({
                    type: "Post",
                    cache: false,
                    url: "/UserControl/Handler/UserControl.ashx",
                    dataType: "json",
                    data: data,
                    success: function (data) {

                        if (!checkLogin(data)) {
                            return;
                        }
                        photoList.find(".digg").pagination(data.total,
                     {
                         callback: function (p) { doSearch(p); },
                         prev_text: '上一页',
                         next_text: '下一页',
                         items_per_page: pagesize,
                         num_display_entries: 5,
                         current_page: page,
                         num_edge_entries: 1
                     });
                        if (data.total == 0) {
                            ul.html("<li class=\"li-none\">没有搜索到图片！</li>");
                            return;
                        }
                        ul.empty();

                        $(data.rows).each(function (i, e) {
                            var li = "<li name=\"kindediotr_tempLi\" class=\"thumb-box\"><a class=\"thumb\" style=\"height: 106px; width: 106px;\">";
                            li += "<img _id=\"" + e.id + "\"  src=\"" + GetImgFormat(e.imageName, "60x60") + "\"></a>&nbsp;&nbsp;&nbsp;&nbsp;<div class=\"thumb-name\" style=\"width: 90px;\">" + e.oldImageName + "</div></li>";
                            ul.append(li);
                        });

                        ul.find("li").click(function () {
                            var className = $(this).attr("class");
                            if (className.indexOf("select") > -1) {
                                $(this).removeClass("select");
                            } else {
                                $(this).addClass("select").siblings("li").removeClass("select");
                            }

                        });
                    },
                    error: function () {
                        ul.html("<li class=\"li-none\">系统繁忙，请稍后再试！</li>");
                    }
                });
            }
            return textarea;
        }
    });
})(jQuery);







