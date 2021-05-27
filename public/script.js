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


document.querySelector("#reg-btn").addEventListener("click", function () {
        console.log("working");
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
        console.log(data);
        fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(function (response) {
                console.log("script");
                return response.json();
        }).then(function (data) {
                notification(data);
                // if (data.status === 0) {
                //         new Noty({
                //                 type: 'success',
                //                 theme: 'nest',
                //                 layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                //                 timeout: 1500,
                //                 text: 'Successfully Registered'
                //         }).show();
                //         win.style.cssText = 'left : 32%; transition: 0.25s;';
                //         forms.style.cssText = 'transform: translateX(0%);';
                // }
                // else if (data.status === 1) {
                //         new Noty({
                //                 type: 'error',
                //                 theme: 'nest',
                //                 layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                //                 timeout: 1500,
                //                 text: 'User already Exists'
                //         }).show();
                // }
                // else if (data.status === 2) {
                //         new Noty({
                //                 type: 'error',
                //                 theme: 'nest',
                //                 layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                //                 timeout: 1500,
                //                 text: 'Passwords do not match'
                //         }).show();

                // }
                // else if (data.status === 3) {
                //         new Noty({
                //                 type: 'error',
                //                 theme: 'nest',
                //                 layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                //                 timeout: 1500,
                //                 text: 'Enter a valid Phone number'
                //         }).show();
                // }
                // else if (data.status === 4) {
                //         new Noty({
                //                 type: 'error',
                //                 theme: 'nest',
                //                 layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                //                 timeout: 1500,
                //                 text: 'Enter a valid Email'
                //         }).show();
                // }
                // console.log(data);
        })
        function notification(data){
                new Noty({
                        type: data.status?'error':'success',
                        theme: 'nest',
                        layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
                        timeout: 1500,
                        text: data.message
                }).show();
        }
});

