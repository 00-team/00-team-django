var csrfToken = document.currentScript.getAttribute("csrfToken");
var userToken = document.currentScript.getAttribute("userToken");
var projectId = document.currentScript.getAttribute("projectId");

$(".stars").click(function() {
    $.ajax({
        type: "POST",
        url: "/projects/modify-star/",
        data: {
            csrfmiddlewaretoken: csrfToken,
            token: userToken,
            project_id: projectId
        },
        success: function(data) {
            window.location.reload()
        },
        error: function (request) {
            alert(request.responseJSON.Error);
        }
    });
});