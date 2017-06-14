
(function ($) {
    // 向jQuery中被保护的“fn”命名空间中添加你的插件代码，用“pluginName”作为插件的函数名称
    $.fn.myInput = function (options) {
        //设置默认值并用逗号隔开 
        var defaults = {
            width: 150,
            height: 20,
            attr: "title"
        }
        // 返回“this”（函数each（）的返回值也是this），以便进行链式调用。
        return this.each(function () {
            var input = $(this);
            options = $.extend(defaults, options);
            input.css({
                "background": "rgba(0,0,0,0)",
                "background-color": "transparent",
                "border": "0 none",
                "border-radius": "2px 0 0 2px",
                "color": "#666",
                "font-weight": "500",
                "height": options.height + "px",
                "line-height": options.height + "px",
                "left": "0",
                "margin": "0",
                "position": "relative",
                "width": options.width + "px",
                "z-index": "2",
                "padding-left": "2px"
            });
            var mydiv = $("<div>")
            .css({
                "background": "none repeat scroll 0 0 #FFFFFF", "border-radius": "2px", " border": "1px solid #47B839", "position": "relative",
                "height": options.height + "px", "width": options.width + "px", "line-height": options.height + "px", "border": "1px solid #CCC",
                "float": "left", "overflow": "hidden"
            });
            var label = $("<label>")
            .css({ "padding-left": "2px", "color": "#AAA", " left": "8px", "position": "absolute", "top": "0", "z-index": "1", "visibility": "visible", "cursor": "default ", "line-height": options.height + "px" });
            var inputId = input.attr("id");
            if (inputId == undefined) {
                inputId = "inputId";
                while ($("#" + inputId).length > 0) {
                    inputId += "_";
                }
                inputId.attr(id, inputId);
            }
            label.attr("for", inputId);
            label.html(input.attr(options.attr));
            label.appendTo(mydiv);
            input.before(mydiv);
            mydiv.append(input);
            if ($.trim(input.val()).length > 0) {
                label.css("visibility", "hidden");
            }
            input.keyup(function () {//搜索input 事件
                if ($.trim(input.val()).length != "") {
                    label.css("visibility", "hidden");
                }
            }).focus(function () {
                if ($.trim(input.val()).length != "") {
                    label.css("visibility", "hidden");
                } else {
                    label.css({ "visibility": "visible", "color": "#CCC" });
                }
            }).blur(function () {
                if ($.trim(input.val()).length <= 0) {
                    label.css({ "visibility": "visible", "color": "#AAA" });
                }
            });

        });
    }
})(jQuery);

//  获取URL参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function getQueryString2(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

String.prototype.repAll = function (exp, exp1) { return this.replace(new RegExp(exp, "g"), exp1); }
String.prototype.repAllNull = function (exp) { return this.repAll(exp, ''); }

$(function () {

    //    $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    //    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    //    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    //    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

    $("#key").myInput({ width: 468, height: 32 });
})
//获取divpage 高度
function getPageH() {
    return $(".page").height();
}
//获取浏览器高度
function getWinH() {
    return $(window).height();
}
//#region 验证登录
function checkLogin(data) {
    try {
        if (data.data == undefined) {
            return true;
        } else
            if (data.data == "Error") {
                if (data.message == null) {
                    data.message = "/index.html";
                }
                window.parent.location.href = data.message
                return false;
            }
    } catch (e) {
        return false;
    }

    return true;
}



function winReload(url) {
    if (url) {
        window.location.href = url;
    } else {
        window.location.href = window.location.href.replace(/#/g, "");
    }
}

function goUrl(url) {
    window.location.href = url;
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值 跳转
function repUrlGo(paramName, replaceWith) {
    var oUrl = this.location.href.toString();
    if (oUrl.toLowerCase().indexOf(paramName) > -1) {
        oUrl = repUrl(paramName, replaceWith);
    } else {
        if (oUrl.indexOf("?") > 0) {
            oUrl = oUrl + "&" + paramName + "=" + replaceWith;
        } else {
            oUrl = oUrl + "?" + paramName + "=" + replaceWith;
        }
    }
    this.location = oUrl.repAllNull('#');
}
//替换指定传入参数的值,paramName为参数,replaceWith为新值 不跳转
function repUrl(paramName, replaceWith) {
    var oUrl = this.location.href.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    return oUrl.replace(re, paramName + '=' + replaceWith);
}

//分页 DIVid total总数 pagesize分页大小 pageindex当前页
function page(id, total, pagesize, pageindex) {
    $("#" + id).pagination(total,
    {
        callback: function (p) { p = p + 1; repUrlGo("page", p); },
        prev_text: '<<上一页',
        next_text: '下一页>>',
        items_per_page: pagesize,
        num_display_entries: 3,
        current_page: pageindex,
        num_edge_entries: 1
    });
}
//通过url参数 给 Form里面Input的name设置值
function setForm(obj) {
    $(obj).find("input").each(function () {
        var name = $(this).attr("name");
        var val = getQueryString(name);

        if (val != undefined) {
            $(this).val(val);
        }
    });
}


//判断文件大小
function fileChangeGetSize(target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !target[0].files) {
        var filePath = target[0].value;
        try {
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } catch (e) {
            //alert('如果你用的是ie 请将安全级别调低！');
        }
    } else {
        fileSize = target[0].files[0].size;
    }
    return fileSize / 1024;
}

//创建提示信息对象
function getWarn() {
    return $("<span class='alert-warn'></span>").fadeIn("4000");
}

function getAlert() {
    return $("<span class='alert'></span>").fadeIn("4000");
}

function getTip() {
    return $("<span class='alert-tip'></span>").fadeIn("4000");
}
function fadeOutAlert(alert) {
    setTimeout(function () {
        $(alert).fadeOut("slow");
    }, 4000);
}

function setSelectNav(nav) {
    var url = window.location.toString().toLowerCase();
    $(nav).find("a").each(function () {
        var a = $(this);
        var href = a.attr("href").toLowerCase();
        if (url.indexOf(href) > -1) {
            a.addClass("select");
            return false;
        }
    });
}




//生成图片100x100
function formatImg(imgUrl, format) {
    var domaUrl = GetImgFormat(imgUrl, format);
    var img = "<img style='border:1px solid #ccc;margin:2px;' onerror=\"this.src='/Images/nopic.jpg'\"";
    img += " src='" + domaUrl + "' complete='complete' img.onerror=\"function(){'this.onerror='null;}\" ";
    img += " onmouseover=\"MouseOver.call(_,event,this)\"  onmouseout=\"MouseOut.call(_)\" alt=\"图片未加载\"/>";
    return img;
}



//#region 返回不同格式图片

//返回不同格式的图片地址url:原图片地址，format：图片格式（50x50、100x100）
function GetImgFormat(url, format) {
    var arrspace = new Array(); //图片存储空间数组   


    var bol = true;
    for (var i = 0; i < arrspace.length; i++) {
        if (url.indexOf(arrspace[i]) >= 0) {
            bol = true;
        }
    }
    if (!bol) {
        return url;
    }
    bol = IsFormat(format);
    if (!bol) { return url; }
    var index = url.lastIndexOf('.');
    var reg = url.substring(index);

    var indexhttp = url.lastIndexOf('_');
    var src = "";

    if (indexhttp != -1) {
        src = url.substring(0, indexhttp) + "_" + format + reg;
    }
    else {
        src = url + "_" + format + reg;
    }

    return src;
}

//返回原图片:url
function GetImage(url) {
    var index = url.lastIndexOf('.');
    var reg = url.substring(index);
    var indexhttp = url.lastIndexOf('_');
    var src = "";
    if (indexhttp != -1) {
        src = url.substring(0, indexhttp);
    }
    else {
        src = url;
    }

    return src;
}
function IsFormat(FormerFormat) {
    switch (FormerFormat) {
        case "30x30": return true; break;
        case "60x60": return true; break;
        case "110x110": return true; break;
        case "220x220": return true; break;
        case "460x460": return true; break;
        case "750x750": return true; break;
        case "1200x1200": return true; break;
        default: return false; break;
    }
}
//#endregion


//#region ********************************查看商品列表缩略图************************************
_ = window;
_.MouseOver = function (event, o) {
    var div = document.getElementById("ShowImg");
    if (div == null) {
        div = document.createElement("div");
        div.style.cssText = "position: absolute; width: auto; height: auto; z-index: 99999;overflow: hidden; display: none; color: #33ccff";
        div.setAttribute("id", "ShowImg");
        document.body.appendChild(div);
    }

    var src = o.src.substring(o.src.length - 9);
    if (src != "nopic.jpg") {
        src = GetImgFormat(o.src, "220x220");
    }
    else {
        src = o.src;
    }

    event = event || window.event;
    var xx = event.clientX;
    var yy = event.clientY;
    div.style.top = (event.clientY - 20) + "px";
    div.style.left = (event.clientX + 15) + "px";
    div.style.display = 'block';
    div.style.visibility = "hidden";


    var xh = div.offsetHeight;
    var xw = div.offsetWidth;
    var doc = document.documentElement ? document.documentElement : document.body;
    var w = doc.clienWidth;
    var h = doc.clientHeight;
    if (xx + xw > w) {
        if (src != "nopic.png") {
            div.style.left = (xx - xw + 20) + "px";
        }
        else {
            div.style.left = (xx - xw + 20) + "px";
        }
    }
    if (yy + xh > h) {
        if (src != "nopic.png") {
            div.style.top = (yy - xh + 30) + "px";
        }
        else {
            div.style.top = (yy - xh + 100) + "px";
        }
    }

    div.innerHTML = "<img src='" + src + "' alt='图片未加载' />";
    div.style.visibility = "visible";

}
_.MouseOut = function () {
    document.getElementById("ShowImg").style.display = "none";

}

//#region 时间格式化、日期时间比较
Date.prototype.format = function (format) {
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//格式化时间
function fomatDateTime(str) {
    if (str == null)
        return "";
    return (new Date(parseInt(str.substring(str.indexOf('(') + 1, str.indexOf(')'))))).format("yyyy-MM-dd hh:mm:ss");
}
//格式化日期
function fomatDate(str) {
    if (str == null)
        return "";
    return (new Date(parseInt(str.substring(str.indexOf('(') + 1, str.indexOf(')'))))).format("yyyy-MM-dd");
}


function sysExport(obj, i) {
    var linkbutton = $(obj);
    var iframeSysExportId = "iframeSysExport" + i;
    var iframesysExport = $(iframeSysExportId);
    if (!iframesysExport || iframesysExport.length == 0) {
        iframesysExport = $("<iframe id='" + iframeSysExportId + "' style='display:none;'></iframe>");
        $("body").append(iframesysExport);
    }

    linkbutton.click(function () {
        var iframeSysExport = document.getElementById(iframeSysExportId);
        if (iframeSysExport) {
            // loading("正在导出数据...");
            var _this = $(this);
            var action = _this.attr("action");
            var body = $(iframeSysExport.contentWindow.document.body);
            var form = _this.parents("form").clone();

            form.attr("method", "post").attr("action", form.attr("action") + "?et=" + new Date().getTime());
            form.append("<input name='export' value='true'>");
            body.empty();
            body.append(form);
            form.submit();
            // setTimeout(function () { loadEnd(); }, 2500);
        }
    });
}

$(function () {//导出按钮
    $("*[export='true']").each(function (i) {
        var _this = $(this);
        _this.addClass("export").attr("action", "getSysExport" + i);
        sysExport(_this, i);
    });
})



//#endregion ********************************查看商品列表缩略图************************************


var validate = {
    isInteger: function (val) {//验证正整数，包括0
        var patten = /^[1-9]\d*|0$/;
        return patten.test(val);
    },
    isIdcard: function (val) {//验证身份证 
        var patten = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
        return patten.test(val);
    },
    idPhone: function (val) {//验证电话号码 
        var patten = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
        return patten.test(val);

    },
    isMobile: function validateNum(val) {// 验证手机号码 
        var patten = /^(13|14|15|17|18)\d{9}$/;
        return patten.test(val);

    },
    isTelephone: function (val) { //验证手机或电话号
        var patten = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(0[0-9]{2,3}))+\d{7,8})$/;
        return patten.test(val);
    },
    isEmail: function (val) {//验证email账号
        var patten = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        return patten.test(val);
    },
    isNum: function (val) {//验证整数
        var patten = /^-?\d+$/;
        return patten.test(val);
    },
    isRealNum: function (val) {//验证实数 
        var patten = /^-?\d+\.?\d*$/;
        return patten.test(val);

    },
    isFloat2: function validateNum(val) {//验证小数，保留2位小数点 
        var patten = /^-?\d+\.?\d{0,2}$/;
        return patten.test(val);

    },
    isFloat: function (val) {//验证小数
        var patten = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
        return patten.test(val);
    },

    isNumOrLetter: function (val) {//只能输入数字和字母
        var patten = /^[A-Za-z0-9]+$/;
        return patten.test(val);
    },

    isColor: function (val) {//验证颜色
        var patten = /^#[0-9a-fA-F]{6}$/;
        return patten.test(val);
    },

    isUrl: function (val) { //验证URL
        var patten = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        return patten.test(val);
    },

    isNull: function (val) {//验证空
        return val.replace(/\s+/g, "").length == 0;
    },

    isData: function (val) {//验证时间2010-10-10
        var patten = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/;
        return patten.test(val);
    },

    isNumLetterLine: function (val) {//只能输入数字、字母、下划线
        var patten = /^[a-zA-Z0-9_]{1,}$/;
        return patten.test(val);
    }
}



//获取目标字符串在gbk编码下的字节长度
String.prototype.getByteLength = function () {
    return String(this).replace(/[^\x00-\xff]/g, "ci").length;
};

//返回时间字符串
function getDateStr() {
    return Date.parse(new Date());
}

//初始化复制 用法 <a copy="true" data-copy="复制内容">复制内容</a>
function initZclip() {
    if ($("script[src*='ZeroClipboard.js']").length == 0) {
        $("body").append("<script src=\""+domain.misc+"/member/default/Js/ZeroClipboard/ZeroClipboard.js\" type=\"text/javascript\"></script>");
    }
    if ($("script[src*='layer.min.js']").length == 0) {
        $("body").append("<script src=\"" + domain.misc + "/member/default/Js/layer/layer/layer.min.js\" type=\"text/javascript\"></script>");
    }
    $('*[copy="true"]').mouseover(function () {
        $(this).zclip({
            path: domain.misc + '/member/default/Js/ZeroClipboard/ZeroClipboard.swf',
            copy: function () {
                var _this = $(this);
                return _this.attr("data-copy");
            },
            beforeCopy: function () { },
            afterCopy: function () {
                layer.msg("复制成功！", 1, 1);
            }
        });
        $(this).unbind("mouseover");
    });
}

//#region 表单序列化
function paramString2obj(serializedParams) {
    var obj = {};
    function evalThem(str) {
        var indexEq = str.indexOf('=');
        var attributeName = str.substring(0, indexEq);
        var attributeValue = str.substring(indexEq + 1)
        if (!attributeValue) {
            return;
        }

        var array = attributeName.split(".");
        for (var i = 1; i < array.length; i++) {
            var tmpArray = Array();
            tmpArray.push("obj");
            for (var j = 0; j < i; j++) {
                tmpArray.push(array[j]);
            };
            var evalString = tmpArray.join(".");
            if (!eval(evalString)) {
                eval(evalString + "={};");
            }
        };
        eval("(obj." + attributeName + "='" + attributeValue + "');");
        eval("(obj." + attributeName + "=decodeURIComponent(obj." + attributeName + ",true));");
    };
    var properties = serializedParams.split("&");
    for (var i = 0; i < properties.length; i++) {
        evalThem(properties[i]);
    };
    return obj;
}

$.fn.form2json = function () {
    var serializedParams = this.serialize();
    var reg = new RegExp("%2F", "g"); //创建正则RegExp对象(由于序列化后/字符会变成%2F)
    serializedParams = serializedParams.replace(reg, "/");

    reg = new RegExp("%40", "g"); //创建正则RegExp对象(由于序列化后@字符会变成%40)
    serializedParams = serializedParams.replace(reg, "@");

    reg = new RegExp("%3A", "g"); //创建正则RegExp对象(由于序列化后:字符会变成％3A)
    serializedParams = serializedParams.replace(reg, ":");
    serializedParams = serializedParams.replace(/\+/g, " ");
    // serializedParams = decodeURIComponent(serializedParams, true);
    var obj = paramString2obj(serializedParams);
    var josnObj = TJSON.stringify(obj);
    return josnObj;
}
//#endregion

/* File Crea"ted: 十一月 12, 2013 */
/*****json**********/
//http://www.TJSON.org/
if (!this.TJSON) {
    TJSON = {};
}
(function () {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) + 'Z';
        };
        String.prototype.toJSON =
Number.prototype.toJSON =
Boolean.prototype.toJSON = function (key) {
    return this.valueOf();
};
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
gap,
indent,
meta = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
},
rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
'"' + string.replace(escapable, function (a) {
    var c = meta[a];
    return typeof c === 'string' ? c :
'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
}) + '"' :
'"' + string + '"';
    }
    function str(key, holder) {
        var i,
k,
v,
length,
mind = gap,
partial,
value = holder[key];
        if (value && typeof value === 'object' &&
typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' :
gap ? '[\n' + gap +
partial.join(',\n' + gap) + '\n' +
mind + ']' :
'[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' :
gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof TJSON.stringify !== 'function') {
        TJSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
(typeof replacer !== 'object' ||
typeof replacer.length !== 'number')) {
                throw new Error('TJSON.stringify');
            }
            return str('', { '': value });
        };
    }
    if (typeof TJSON.parse !== 'function') {
        TJSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ?
walk({ '': j }, '') : j;
            }
            throw new SyntaxError('TJSON.parse');
        };
    }
})();



/******end json*********/

function confirmInfo(msg, fun) {
    var confirmIndex = layer.confirm(msg, function () {
        fun(confirmIndex);
    }, "提示(Tips)");
}
function confirmEnd(index) {
    layer.close(index);
}
function loading(msg) {
    //加载层
    if (!msg) {
        msg = "正在提交数据";
    }
    msgIndex = layer.load(msg, 0);
}
function loadEnd() {
    layer.close(msgIndex);
}
function alertInfo(msg, fun, timeout) {
    if (!timeout) {
        timeout = 2;
    }
    layer.msg(msg, timeout, 8, fun);
}

function alertOK(msg, fun, timeout) {
    if (!timeout) {
        timeout = 2;
    }
    layer.msg(msg, timeout, 1, fun);
}


var txtHelper = {
    //正整数
    positiveInteger: function (t, num) {
        var value = $(t).val();
        var patten = /^\d+$/;
        if (!patten.test(value)) {
            if (num) {
                $(t).val(num);
            }
            else {
                $(t).val("");
            }
        }
    },

    // 只能输入英文字母和数字,不能输入中文
    enOrNum: function (t, num) {
        var value = $(t).val();
        var patten =/^[0-9a-zA-Z]+$/g;
        if (!patten.test(value)) {
            if (num) {
                $(t).val(num);
            }
            else {
                $(t).val("");
            }
        } 
    },

    //验证小数，保留2位小数点 
    Float2: function (t, num) {
        var value = $(t).val();
        var patten = /^-?\d+\.?\d{0,2}$/;
        if (!patten.test(value)) {
            if (num) {
                $(t).val(num);
            }
            else {
                $(t).val("");
            }
        }
    },

    //验证小数
    Float: function (t, num) {
        var value = $(t).val();
        var patten = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
        if (!patten.test(value)) {
            if (num) {
                $(t).val(num);
            }
            else {
                $(t).val("");
            }
        }
    },
    NoChain: function (t, num) {
        var value = $(t).val();
        var patten = /^[^\u4e00-\u9fa5]{0,}$/g;
        if (!patten.test(value)) {
            if (num) {
                $(t).val(num);
            }
            else {
                $(t).val("");
            }
        } 
    }
};

//计算钱保留小数点有效位数后面还有升1
function ToManeyUp(amtstr, n) {
    var res = amtstr;
    if (amtstr.toString().split(".").length > 1) {
        if (amtstr.toString().split(".")[1].length > n) {
            res = (parseInt((amtstr * Math.pow(10, n)).toString().split(".")[0]) + 1) / Math.pow(10, n);
        }
    }
    return res;
}

; (function ($, w) {
    $.extend($.fn,
    {
        oText: function () {
            return $(this).find('option').not(function () { return !this.selected }).text();
        },
        inputAutocomplete: function (config) {
            var timeOutId;
            var delayTime = 300;
            var obj = "#search-mask";
            var url = "";
            if (config) {
                if (config.obj) {
                    obj = config.obj;
                }
                if (config.url) {
                    url = config.url;
                }
            }
            var _ = this;

            _.post = function () {
                clearTimeout(timeOutId);
                timeOutId = setTimeout(function () {
                    var data = config.data();
                    data.noloading = true;
                    _m.post(url, data, config.success, config.error);
                }, delayTime);
            }
            $(this).get(0).addEventListener("input", _.post, false);

            return _;
        },
        upload: function (config) {
            var p = $(this).parent();
            p.css({ "position": "relative", "overflow": "hidden" });
            // Tell FileDrop we can deal with iframe uploads using this URL:
            var url = "/Helper/Common.ashx?action=UploadFile&type=";
            if (!config.type) {
                url += "vip";
            } else {
                url += config.type;
            }
            var options = { iframe: { url: url, fileParam: "fd-file", callbackParam: "fd-callback" } };
            // Attach FileDrop to an area ('zone' is an ID but you can also give a DOM node):
            var zone = new FileDrop($(this).attr("id"), options);
            var loading = true;
            // Do something when a user chooses or drops a file:
            zone.event('send', function (files) {
                if (!loading) {
                    return;
                }
                loading = false;
                if (config.sendBefroe) {
                    config.sendBefroe(files);
                }
                // Depending on browser support files (FileList) might contain multiple items.
                files.each(function (file) {
                    // React on successful AJAX upload:
                    file.event('done', function (xhr) {
                        loading = true;
                        _m.loadEnd();
                        if (config.callback) {
                            var result = JSON.parse(xhr.responseText);
                            config.callback(result);
                            if (!result.status) {
                                alert(result.message);
                            }
                        }
                    });

                    // Send the file:
                    file.sendTo(options.iframe.url);
                });
            });

            // React on successful iframe fallback upload (this is separate mechanism
            // from proper AJAX upload hence another handler):
            zone.event('222iframeDone', function (xhr) {
                if (config.callbackMultiple) {
                    var result = JSON.parse(xhr.responseText);
                    config.callbackMultiple(result);
                }
            });

            // A bit of sugar - toggling multiple selection:
            fd.addEvent(fd.byID('multiple'), 'change', function (e) {
                zone.multiple(e.currentTarget || e.srcElement.checked);
            });
        }


    })
})(window.jQuery || window.Zepto, window);

// 兼容placeholder
(function ($) {
    $.fn.miPlaceholder = function (color) {
        var color = color || "#999";
        //Placeholder Ability
        if ('placeholder' in document.createElement('input')) {
            return false;
        }
        return this.each(function (i, obj) {
            var miPid = (this.name || this.id) + "_miPid_" + i;
            var me = $(this);
            var className = me.attr("class");
            var placeholderText = me.attr("placeholder");
            me.before("<input type='text' id=" + miPid + " class='" + className + "' value='" + placeholderText + "'>");
            $("#" + miPid).hide().css("color", color);
            if (this.value == "") {
                me.hide();
                $("#" + miPid).show();
            }
            $("#" + miPid).focus(function () {
                $(this).hide();
                me.show();
                me.focus();
            });
            me.blur(function () {
                if (this.value == "") {
                    me.hide();
                    $("#" + miPid).show();
                }
            });
        });
    }
})(jQuery);

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

// return Integer Height
function getScrollWidth() {
    var noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll - scroll;
}

// 禁止滚动条和鼠标滑动
function noSliding() {
    // 禁止鼠标滚动
    var integer = getScrollWidth();
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    document.documentElement.style.cssText = 'overflow:hidden';
    document.body.style.cssText = 'overflow:hidden;+overflow:none;_overflow:none;padding-right:' + integer + 'px';

    // 禁止键盘滚动
    var move = function (e) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
        e.stopPropagation && e.stopPropagation();
        return false;
    }
    var keyFunc = function (e) {
        if (37 <= e.keyCode && e.keyCode <= 40) {
            return move(e);
        }
    }
    document.body.onkeydown = keyFunc;
}

// 恢复鼠标滑动和滚动条
function sliding() {
    document.documentElement.style.cssText = '';
    document.body.style.cssText = '';
}

// IE browser version
support = (function (support) { var all, a, input, select, fragment, opt, div = document.createElement("div"); div.setAttribute("className", "t"); div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"; all = div.getElementsByTagName("*") || []; a = div.getElementsByTagName("a")[0]; if (!a || !a.style || !all.length) { return support } select = document.createElement("select"); opt = select.appendChild(document.createElement("option")); input = div.getElementsByTagName("input")[0]; a.style.cssText = "top:1px;float:left;opacity:.5"; support.getSetAttribute = div.className !== "t"; support.leadingWhitespace = div.firstChild.nodeType === 3; support.tbody = !div.getElementsByTagName("tbody").length; support.htmlSerialize = !!div.getElementsByTagName("link").length; support.style = /top/.test(a.getAttribute("style")); support.hrefNormalized = a.getAttribute("href") === "/a"; support.opacity = /^0.5/.test(a.style.opacity); support.cssFloat = !!a.style.cssFloat; support.checkOn = !!input.value; support.optSelected = opt.selected; support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>"; support.deleteExpando = true; support.noCloneEvent = true; input.checked = true; support.noCloneChecked = input.cloneNode(true).checked; try { delete div.test } catch (e) { support.deleteExpando = false } input = document.createElement("input"); input.setAttribute("value", ""); support.input = input.getAttribute("value") === ""; input.value = "t"; input.setAttribute("type", "radio"); support.radioValue = input.value === "t"; fragment = document.createDocumentFragment(); fragment.appendChild(input); support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked; if (div.attachEvent) { div.attachEvent("onclick", function () { support.noCloneEvent = false }); div.cloneNode(true).click() } div = all = select = fragment = opt = a = input = null; return support })({});

// IE Update
function ieUpdate() {
    noSliding();
    setCookie("checkBrowser", "1");
    var b = $(".ieupdate"),
        r = getCookie("read_xszy"),
    a = function () {
        var g = $(".dialog-overlay"),
            f = b.find("#updateClose"),
            e = $(document).height();
        g.css("height", e);
        b.show();
        g.show();
        f.on("touchstart click",
        function () {
            g.hide();
            b.hide();
            sliding();
        });
    }
    a();
}

$(function () {
    // 判断为 IE8 或其以下版本就执行操作
    if (support.leadingWhitespace == false) {
        $("body").append('<div class="ieupdate"><div class="update-web"><h3 class="update-tt">HI，您的浏览器版本过低，可能存在安全风险，建议升级浏览器：</h3><div class="update-btn"><a href="http://rj.baidu.com/soft/detail/14744.html?ald" target="_blank" class="left-icon"><img src=\"' + domain.misc + '/member/default/images/chome_icon.jpg\"></a><a href="http://www.firefox.com.cn/" target="_blank"><img src=\"' + domain.misc + '/member/default/images/firefox_icon.jpg\"></a></div></div><div class="update-scan"><span class="scan-tt">或微信扫一扫下载：</span><div class="scan-code"><img src=\"' + domain.misc + '/member/default/images/wxcode.jpg\"><p>善宝分享商城</p></div></div><div class="update-close" id="updateClose"><a href="javascript:;"><img src=\"' + domain.misc + '/member/default/images/close_icon.jpg\"></a></div></div><div class="dialog-overlay"></div>')
        if (!getCookie("checkBrowser")) {
            ieUpdate();
        }
    }
})