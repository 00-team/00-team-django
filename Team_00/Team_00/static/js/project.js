var csrf_token = document.currentScript.getAttribute("csrf_token");
var user_token = document.currentScript.getAttribute("user_token");
var project_id = document.currentScript.getAttribute("project_id");

$(".stars").click(function() {
    $.ajax({
        type: "POST",
        url: "/projects/modify-star/",
        data: {
            csrfmiddlewaretoken: csrf_token,
            token: user_token,
            pid: project_id
        },
        success: function(data) {
            if (data.success) {
                window.location.reload()
            } else (
                console.log(data.error)
            )
        }
    });
});