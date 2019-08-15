// load config
var config = JSON.parse(localStorage.getItem("perplexity_config"));
$.each(config, function(k, v) {
    $("#" + k).val(v);
});

// save config
$("#save").click(function() {
    var config = JSON.stringify($("form").serializeFormJSON())
    localStorage.setItem("perplexity_config", config);
});