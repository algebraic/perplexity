console.debug("loading server.js");

// list server info
$(document).on("click", "#server-info", function() {
    console.debug("server-info clicked");
    // load config
    if (config === null) {
        console.debug("config is null, going to config form");
        $("a.default").click();
    } else {
        console.debug("config found, do some stuff");
        const BASEURL = "https://" + config["ip"];
        const TOKEN = "X-Plex-Token=" + config["token"];
        var url = BASEURL + "/?" + TOKEN;
        console.debug("server url: " + url);
        $.get(url, function(xmlData) {
            console.debug("get function...");
            var mediaContainer = $(xmlData).find("MediaContainer");
            console.debug("::mediaContainer::");
            console.debug(mediaContainer);
            $(".server-container").empty();
            $(mediaContainer).each(function() {
                $.each(this.attributes, function() {
                    console.debug(this.name + " :: " + this.value);
                    if (this.specified) {
                        $(".server-container").append("<span class='text-light'>" + this.name + ":</span> <span class='text-info'>" + this.value + "</span><br>");
                    }
                });
            });
        }).done(function() {
            console.debug("get: done");
        }).fail(function() {
            console.debug("get: fail");
        }).always(function() {
            console.debug("get: always");
        });
    }
});