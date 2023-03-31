console.debug("loading navbar.js");

// navbar link behavior
$(document).on("click", "a.dropdown-item", function() {
    $("div.container").removeClass("hide");
    // hide & show junk appropriately
    var $this = $(this);
    $("div.section").hide();
    var section = $this.attr("data-import");
    console.debug("section=" + section);
    $("div.section#" + section).show();
});

