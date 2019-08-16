// load config
var config = JSON.parse(localStorage.getItem("perplexity_config"));
if (config !== null) {
    // set constants
    const BASEURL = "http://" + config["ip"];
    const TOKEN = "X-Plex-Token=" + config["token"];
}

// navbar link behavior
$("a.dropdown-item").click(function() {
    // $("#config-container").hide();
    $("#server-output").empty();
});

// server config button
$("#edit-config").click(function() {
    // $("#config-container").show();
});