console.debug("loading config.js");

$(function () {
    
    if (config != null) {
        $.each(config, function (k, v) {
            $("#" + k).val(v);
        });
    }

    // save config
    $(document).on("click", "#save", function () {
        alert("save button");
        console.debug("saving config");
        const config = JSON.stringify($("form").serializeFormJSON());
        localStorage.setItem("perplexity_config", config);
    });

});