// list server info
$(document).on("click", "#server-info", function() {
    // // load config
    if (config === null) {
        $("a.default").click();
    } else {
        const BASEURL = "https://" + config["ip"];
        const TOKEN = "X-Plex-Token=" + config["token"];
        var url = BASEURL + "/?" + TOKEN;
        $.get(url, function(xmlData) {
            var mediaContainer = $(xmlData).find("MediaContainer");
            $(".server-container").empty();
            $(mediaContainer).each(function() {
                $.each(this.attributes, function() {
                    if (this.specified) {
                        $(".server-container").append("<span class='text-light'>" + this.name + ":</span> <span class='text-info'>" + this.value + "</span><br>");
                    }
                });
            });
        }).done(function() {

        }).fail(function() {

        }).always(function() {

        });
    }
});