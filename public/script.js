var win = document.querySelector(".window");
var forms = document.querySelector(".forms");
document.querySelector("#toggle-reg").addEventListener("click", function () {
        win.style.cssText = 'left : 45%; transition: 0.25s;';
        forms.style.cssText = 'transform: translateX(-50%);';
});

document.querySelector("#toggle-log").addEventListener("click", function () {
        win.style.cssText = 'left : 32%; transition: 0.25s;';
        forms.style.cssText = 'transform: translateX(0%);';
});

document.querySelector("#log-btn").addEventListener("click", function () {
        var email = document.querySelector("#log-email").value;
        var password = document.querySelector("#log-pass").value;
        const url = '/login';
        var data = {
                email,
                password
        }
        fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(function (response) {
                return response.json();
        }).then(function (data) {
                if(data.status==0){
                        window.location.replace("/dashboard");
                }
                else{
                        notification(data);
                }
        })
});

document.querySelector("#reg-btn").addEventListener("click", function () {
        var name = document.querySelector("#reg-name").value;
        var email = document.querySelector("#reg-email").value;
        var phone = document.querySelector("#reg-phone").value;
        var pass = document.querySelector("#reg-pass").value;
        var cpass = document.querySelector("#reg-cpass").value;
        const url = '/register';
        const data = {
                name,
                email,
                phone,
                pass,
                cpass
        }
        fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(function (response) {
                return response.json();
        }).then(function (data) {
                notification(data);
                if(data.status==0){
                        win.style.cssText = 'left : 32%; transition: 0.25s;';
                        forms.style.cssText = 'transform: translateX(0%);';
                }
        })
});
function notification(data){
        new Noty({
                type: data.status?'error':'success',
                theme: 'nest',
                layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                timeout: 1500,
                text: data.message
        }).show();
}

