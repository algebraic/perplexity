console.debug("loading perplexity.js");

$(function() {

    $("a.default").click();

    // search by name for movies/episodes
    $("#search-form").submit(function(e) {
        e.preventDefault();
        console.debug("search form submit");

        // hide other sections & show search junk
        $("div.container").removeClass("hide");
        $("div.section").hide();
        $("div.section#search-results").show();

        var search = $("#search-text").val();
        console.debug("search term: '" + search + "'");
        var url = BASEURL + "/search?query=" + search + "&" + TOKEN;
        console.debug("search url: " + url);

        var fields = ["librarySectionTitle", "guid", "key", "title", "type", "summary", "rating", "year", "thumb"]

        $.get(url, function(xmlData) {
            console.debug("GET " + url);
            console.debug(xmlData);

            var mediaContainer = $(xmlData).find("MediaContainer");
            var length = $(mediaContainer).children("Video").length;
            $("#output-container").empty().append("<h5>Search Results for '" + search + "' (" + length + ")</h5><br>");

            console.debug("-----------------------------------");
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

                console.debug("imgpath: " + imgpath);
                console.debug("title: " + title);
                
                var itemblock = "<div class='thumb-container'>";
                itemblock += "<img class='thumb' src=" + BASEURL + imgpath + "?" + TOKEN + ">";

                // zj: guid doesn't have the imdb stuff in it anymore, so this is broken
                // zj: used to append a little imdb logo & clicky link to imdb page
                // var guid_raw = $(this).attr("guid");
                // var src_url = getLinkFromGuid(guid_raw, type);
                // var src_type = guid_raw.split(/[\.://,]+/)[3];
                // var src_logo = "<img src='img/" + src_type + ".png' class='src_icon icon_" + src_type + "' data-url='" + src_url + "'>";
                // debug output of variables
                // console.debug("guid_raw: " + guid_raw);
                // console.debug("src_url: " + src_url);
                // console.debug("src_type: " + src_type);
                // console.debug("src_logo: " + src_logo);
                // itemblock += src_logo;

                itemblock += "<span class='thumb-footer " + type + "'>" + title + "</span>";
                itemblock += "</div>";
                $("#output-container").append(itemblock);

                // $(document).on("click", ".src_icon", function() {
                //     window.open($(this).attr("data-url"));
                // });

                console.debug("-----------------------------------");
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
function getLinkFromGuid(guid_raw, type) {
    var guid = guid_raw.split(/[\.://,]+/);
    var src_url = "";
    switch (guid[3]) {
        case "imdb":
            src_url = "https://www.imdb.com/title/" + guid[4];
            break;
        case "themoviedb":
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