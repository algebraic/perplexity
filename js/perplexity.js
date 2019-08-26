$(function() {
    // import navbar
    var navbar_import = document.querySelector("#import-navbar");
    console.info("navbar_import::");
    console.info(navbar_import);

    var navbar_content = navbar_import.import.querySelector("content");
    console.info("navbar_content: " + navbar_content);

    $("content.import-navbar").html(document.importNode(navbar_content, true));

    // import section content
    $("a.section-link").click(function() {
        var $this = $(this);
        var import_id = $this.attr("data-import");
        var section_import = document.querySelector("#" + import_id);
        var section_content = section_import.import.querySelector("content");
        var content = document.importNode(section_content, true);
        $("div#import-container").html(content).find("content").find("div").show();
    });

    // show config page if config file doesn't exist
    if (!localStorage.getItem("perplexity_config")) {
        $("a.default").click();
    }

    // search by name for movies/episodes
    $("#search-form").submit(function(e) {
        e.preventDefault();
        var search = $("#search-text").val();
        var url = BASEURL + "/search?query=" + search + "&" + TOKEN;

        var fields = ["librarySectionTitle", "guid", "key", "title", "type", "summary", "rating", "year", "thumb"]

        $.get(url, function(xmlData) {
            var mediaContainer = $(xmlData).find("MediaContainer");
            var length = $(mediaContainer).children("Video").length;
            $("#output-container").empty().append("<h5>Search Results for '" + search + "' (" + length + ")</h5><br>");

            $(mediaContainer).children("Video").each(function() {
                var imgpath = null;
                var type = null;
                if ($(this).attr("type") == "episode") {
                    // tv show
                    imgpath = $(this).attr("parentThumb");
                    if (imgpath == null) {
                        imgpath = $(this).attr("grandparentThumb");
                    }
                    var season = $(this).attr("parentIndex");
                    var episode = $(this).attr("index");
                    var title = "S" + pad(season, 2) + "E" + pad(episode, 2) + " - " + $(this).attr("title");
                    type = "tv";
                } else if ($(this).attr("type") == "movie") {
                    // movie
                    imgpath = $(this).attr("thumb");
                    var title = $(this).attr("title");
                    type = "movie";
                }
                var itemblock = "<div class='thumb-container'>";
                itemblock += "<img class='thumb' src=" + BASEURL + imgpath + "?" + TOKEN + ">";

                var guid_raw = $(this).attr("guid");
                var src_url = getLinkFromGuid(guid_raw);
                var src_type = guid_raw.split(/[\.://,]+/)[3];
                var src_logo = "<img src='img/" + src_type + ".png' class='src_icon icon_" + src_type + "' data-url='" + src_url + "'>";
                itemblock += src_logo;
                itemblock += "<span class='thumb-footer " + type + "'>" + title + "</span>";
                itemblock += "</div>";
                $("#output-container").append(itemblock);

                $(document).on("click", ".src_icon", function() {
                    window.open($(this).attr("data-url"));
                });

            });
        }).done(function() {
            
        }).fail(function() {
            alert("error");
        }).always(function() {
            
        });
    });

});



// convert form to json object
$.fn.serializeFormJSON = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// pad number with leading zeroes if necessary
function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

// convert ms to standard time in hh:mm
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // leading zeroes
    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + "h " + minutes + "m";
}

// get link to movie/tv site from guid
function getLinkFromGuid(guid_raw) {
    var guid = guid_raw.split(/[\.://,]+/);
    var src_url = "";
    switch (guid[3]) {
        case "imdb":
            src_url = "https://www.imdb.com/title/" + guid[4];
            break;
        case "themoviedb":
            var type = "tv";
            src_url = "https://www.themoviedb.org/" + type + "/" + guid[4];
            break;
        case "thetvdb":
            src_url = "https://www.thetvdb.com/dereferrer/series/" + guid[4];
            break;
    }
    return src_url;
}

function showMovieAttr(movie, attribute, replaceString) {
    return $(movie).attr(attribute) === undefined ? replaceString: $(movie).attr(attribute);
}

function epochToDate(epochdate) {
    if (epochdate === undefined) {
        return "-";
    } else {
        var date = new Date(0);
        date.setUTCSeconds(epochdate);
        return date.toLocaleDateString();
    }
    
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}