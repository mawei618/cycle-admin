/* jsLoader */
var JSLoader = function () {

    var scripts = {}; // scripts['a.js'] = {loaded:false,funs:[]}

    function getScript(url) {
        var script = scripts[url];
        if (!script) {
            script = { loaded: false, funs: [] };
            scripts[url] = script;
            add(script, url);
        }
        return script;
    }


    function run(script) {
        var funs = script.funs,
            len = funs.length,
            i = 0;

        for (; i < len; i++) {
            var fun = funs.pop();
            fun();
        }
    }

    function add(script, url) {
        var scriptdom = document.createElement('script');
        scriptdom.type = 'text/javascript';
        scriptdom.loaded = false;
        scriptdom.src = url;

        scriptdom.onload = function () {
            scriptdom.loaded = true;
            run(script);
            scriptdom.onload = scriptdom.onreadystatechange = null;
        };

        //for ie
        scriptdom.onreadystatechange = function () {
            if ((scriptdom.readyState === 'loaded' ||
                    scriptdom.readyState === 'complete') && !scriptdom.loaded) {

                run(script);
                scriptdom.onload = scriptdom.onreadystatechange = null;
            }
        };

        document.getElementsByTagName('head')[0].appendChild(scriptdom);
    }

    return {
        load: function (url) {
            var arg = arguments,
                len = arg.length,
                i = 1,
                script = getScript(url),
                loaded = script.loaded;

            for (; i < len; i++) {
                var fun = arg[i];
                if (typeof fun === 'function') {
                    if (loaded) {
                        fun();
                    } else {
                        script.funs.push(fun);
                    }
                }
            }
        }
    };
}();

/* trancelate */

$(document).ready(function () {
        JSLoader.load('http://www.microsoftTranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**', function () {
            $("#translateLoading").hide();
            fillList(Microsoft.Translator.Widget.GetLanguagesForTranslateLocalized(), 'langs');
            var transdom = $("#langs").html();
            var datalang = $.cookie('language_cookie');
            if (datalang) {
                Microsoft.Translator.Widget.Translate('zh-CHS', datalang, function () {
                    Microsoft.Translator.Widget.domTranslator.showHighlight = false;
                    Microsoft.Translator.Widget.domTranslator.showTooltips = false;
                    $("#langs").html(transdom);
                    $("#WidgetFloaterPanels").hide();
                });

            }
        });

    

});


$(".dropdown .trancelate").on("click", "a", function () {
    var transdom = $("#langs").html();
    var datalang = $(this).attr("data-language");
    Microsoft.Translator.Widget.Translate('zh-CHS', datalang, function () {
        $("#langs").html(transdom);
    });
    Microsoft.Translator.Widget.domTranslator.showHighlight = false;
    Microsoft.Translator.Widget.domTranslator.showTooltips = false;
    $.cookie('language_cookie', datalang);

    $("#WidgetFloaterPanels").hide();
})


function fillList(listOfLanguages, listId) {
    var ddlLangs = document.getElementById("langs");
    for (var key in listOfLanguages) {
        var row = document.createElement('li');
        var c1 = document.createElement('a');
        c1.innerHTML = listOfLanguages[key].Name;
        c1.setAttribute("href", "javascript:;");
        c1.setAttribute("data-language", listOfLanguages[key].Code);
        row.appendChild(c1);
        ddlLangs.appendChild(row);
    }
}

$(".dropdown").hover(function () {
    $(this).addClass("hover")
    $(".dropdown-icon,.trancelate").stop().show()
}, function () {
    $(this).removeClass("hover");
    $(".dropdown-icon,.trancelate").stop().hide()
})