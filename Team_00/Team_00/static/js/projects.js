$(".project").click(function () {
    try {
        var slug = $(this).attr("slug-link");
        window.location = "/projects/p/" + slug
    } catch(err) {
        console.log(err.message);
    }
});