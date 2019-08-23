// load config
if (config != null) {
    $.each(config, function(k, v) {
        $("#" + k).val(v);
    });
}

// save config
$("#save").click(function() {
    const config = JSON.stringify($("form").serializeFormJSON());
    localStorage.setItem("perplexity_config", config);
});