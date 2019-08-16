$(document).on("click", "#load-libraries", function() {
    // list libraries on server
    if (typeof BASEURL === "undefined" || typeof TOKEN === "undefined") {
        // warn
        $(".library-container").text("No server configuration found");
    } else {
        var url = BASEURL + "/library/sections?" + TOKEN;
        $.get(url, function(xmlData) {
            var mediaContainer = $(xmlData).find("MediaContainer");
            var output = "<div id='lib-list'>";
            $(mediaContainer).children("Directory").each(function() {
                var lib_image_src = BASEURL + $(this).attr("composite") + "?" + TOKEN;
                output += "<div class='row'><div class='col-lg-2'>";
                output += "<img class='library-thumb' src=" + lib_image_src + ">";
                output += "</div><div class='col-lg-10'>"
                output += "<h3 class='library' data-key='" + $(this).attr("key") + "' data-img='" + lib_image_src + "'>" + $(this).attr("title") + "</h3>";

                output += "<div class='library-action'>";
                output += "<button class='btn btn-sm btn-outline-info dropdown-toggle' type='button' id='library-action-btn' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                output += "<i class='fas fa-cog'></i></button><div class='dropdown-menu bg-info' aria-labelledby='library-action-btn'><a class='dropdown-item' href='#'>Scan Library</a>";
                output += "<a class='dropdown-item' href='#'>Refresh Library</a></div></div><br>";

                $(this).children("Location").each(function() {
                    output += "<span class='text-muted'>" + $(this).attr("path") + "</span><br>";
                });
                output += "</div></div><hr>";
            });
            output += "</div>";
            $(".library-container").append(output);
        }).done(function() {
            // list contents of library
            $(".library[data-key]").click(function() {
                var url = BASEURL + "/library/sections/" + $(this).attr("data-key") + "/all?" + TOKEN;
                $("#lib-list").hide();
                var bgimg = "<img src='" + $(this).attr("data-img") + "' class='section-bg'></img>";
                $(this).parents(".library-container").prepend(bgimg);
                var output = "<div id='lib-contents'>";
                $.get(url, function(xmlData) {
                    var mediaContainer = $(xmlData).find("MediaContainer");
                    output += "<h6 class='library-header' id='back' class='back' title='back'><i class='fas fa-level-up-alt fa-flip-horizontal'></i> back</span></h6>";
                    output += "<h4 class='library-header'>" + $(mediaContainer).attr("title1") + " (" + $(mediaContainer).children("Video, Directory").length + ")</h4><div class='row'>";

                    // Directory for shows
                    $(mediaContainer).children("Directory").each(function() {
                        output += "<div class='col-lg-4 item' data-posterType='banner' data-bannerid='" + $(this).attr("updatedAt") + "' data-children='" + $(this).attr("ratingKey") + "'>" + $(this).attr("title") + "</div>";
                    });
                    // Video for movies
                    $(mediaContainer).children("Video").each(function() {
                        output += "<div class='col-lg-4 item' data-postertype='thumb' data-bannerid='" + $(this).attr("updatedAt") + "' data-children='" + $(this).attr("ratingKey") + "'>" + $(this).attr("title") + "</div>";
                    });

                    output += "</div></div>";
                    $(".library-container").append(output);
                }).done(function() {
                    $(".item").click(function() {
                        var postertype = $(this).data("postertype");
                        var banner = BASEURL + "/library/metadata/" + $(this).data("children") + "/" + postertype + "/" + $(this).data("bannerid") + "?" + TOKEN;

                        // check for show or movie, slightly different url...
                        var section = "?" // for movies
                        if (postertype == "banner") {
                            section = "/allLeaves?"; // for shows
                        }
                        var url = BASEURL + "/library/metadata/" + ($(this).data("children")) + section + TOKEN;

                        $("#lib-contents, .section-bg").hide();
                        var output = "<div id='lib-children'>";
                        $.get(url, function(xmlData) {
                            var mediaContainer = $(xmlData).find("MediaContainer");

                            output += "<h6 class='library-header' id='back2' title='back' class='back'><i class='fas fa-level-up-alt fa-flip-horizontal'></i> back</span></h6>";

                            // handle show vs movie...
                            if (postertype == "thumb") {
                                // movie
                                var movie = $(mediaContainer).find("Video");
                                output += "<div class='row'><div class='col-lg-4'>";
                                output += "<img class='detail-" + postertype + " float-left' src='" + banner + "'>";
                                output += "</div><div class='col-lg-8'>";
                                // movie title
                                output += "<h2 class='mb-0'>" + $(movie).attr("title") + " (" + $(movie).attr("year") + ")</h2>";
                                // tagline
                                output += "<span class='text-muted'>" + showMovieAttr(movie, "tagline", "") + "</span>";
                                output += "</span><br><br>";

                                // movie summary
                                output += "<div class='movie-detail'>";
                                output += "<p class='font-weight-normal'>" + $(movie).attr("summary") + "</p><hr>";

                                output += "<div class='col-lg-12'>";
                                // metadata section
                                output += "<div class='metadata'><div class='row'><div class='col-lg-4'>";
                                output += "<div>" + showMovieAttr(movie, "contentRating", "") + "</div></div>";
                                output += "<div class='col-lg-4'>";
                                output += "<div>" + showMovieAttr(movie, "studio", "") + "</div></div></div>";

                                output += "<div class='row'><div class='col-lg-4'>";
                                output += "<div>" + msToTime($(movie).attr("duration")) + "</div></div>";
                                output += "<div class='col-lg-4'>";
                                output += "<div>Released " + formatDate($(movie).attr("originallyAvailableAt")) + "</div></div></div>";

                                output += "<div class='row'><div class='col-lg-4'>";
                                output += "<div>View Count: " + showMovieAttr(movie, "viewCount", "0") + "</div></div>";
                                output += "<div class='col-lg-4'>";
                                output += "<div>Added " + epochToDate($(movie).attr("addedAt")) + "</div></div></div>";

                                output += "<div class='row'><div class='col-lg-4'>";
                                if ($(movie).attr("guid").indexOf("none") == -1) {
                                    output += "<div><a href='" + getLinkFromGuid($(movie).attr("guid")) + "' target='_blank'><img src='img/imdb_small.png'/> <span class='adjust-top'>" + showMovieAttr(movie, "rating", "") + "</a></span></div></div>";
                                } else {
                                    // just empty to hide it
                                    output += "<div></div></div>";
                                }
                                output += "<div class='col-lg-4'>";
                                output += "<div>Last Viewed " + epochToDate($(movie).attr("lastViewedAt")) + "</div></div></div>";


                                output += "<br><hr><div class='row'><div class='col-lg-4'>";
                                output += "<div></span></div></div>";
                                output += "<div class='col-lg-4'>";
                                output += "<div></div></div></div>";

                                // spit out all attributes for debug stuff
                                // $(mediaContainer).children("Video").each(function() {
                                //     // put in a get here for the actual movie deets
                                //     $.each(this.attributes, function() {
                                //         if (this.specified) {
                                //             output += "<dd class='text-light'>" + this.name + ":</dd> <dt class='text-info'>" + this.value + "</dt>";
                                //             console.log(this.name, this.value);
                                //         }
                                //     });
                                // });

                                output += "</div></div></div>";
                            } else {
                                // show
                                output += "<img class='detail-" + postertype + "' src='" + banner + "'></h4><div class='row'>";
                                $(mediaContainer).children("Video, Directory").each(function() {
                                    output += "<div class='col-lg-6 episode'>S" + pad($(this).attr("parentIndex"), 2) + "E" + pad($(this).attr("index"), 2) + " - " + $(this).attr("title") + "</div>";
                                });
                            }

                            output += "</div></div>";
                            $(".library-container").append(output);
                        })
                    });
                });
            });
        }).fail(function() {
            alert("error");
        }).always(function() {

        });
    }
});

// back button
$(document).on("click", "#back", function() {
    $("#lib-contents, .section-bg").remove();
    $("#lib-list").show();
});
$(document).on("click", "#back2", function() {
    $("#lib-children").remove();
    $("#lib-contents, .section-bg").show();
});