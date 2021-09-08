console.debug("loading config.js");
const config = JSON.parse(localStorage.getItem("perplexity_config"));

$(function () {
    
    if (config != null) {
        $.each(config, function (k, v) {
            console.debug("'" + k + "' : '" + v + "'");
            console.warn("$('#" + k + "').val('" + v + "');");
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