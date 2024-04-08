// Functions
function setScreen(id) {
    if (document.getElementById(id) != null) {
        for (let s = 0; s < document.querySelectorAll(".scrn").length; s++) {
            if (document.querySelectorAll(".scrn")[s].id == id) {
                document.querySelectorAll(".scrn")[s].hidden = false;
            } else {
                document.querySelectorAll(".scrn")[s].hidden = true;
            }
        }
        return true
    } else {
        console.error("The screen doesn't exist")
        return false
    }
}
function getScreen() {
    return(document.querySelector('.scrn:not([hidden])'))
}
function animation(elem, name, duration) {
    elem.style.animationName = name;
    elem.style.animationDuration = duration;
    elem.style.animationFillMode = "forwards"
    elem.style.animationTimingFunction = "calc()"
}
function navOpen() {
    document.getElementById("navBarrier").hidden = false;
    animation(document.getElementById("navDiv"), "navOpen", "0.5s")
    animation(document.getElementById("navBarrier"), "fadeIn", "0.5s")
}
function navClose() {
    animation(document.getElementById("navDiv"), "navClose", "0.5s")
    animation(document.getElementById("navBarrier"), "fadeOut", "0.5s")
    setTimeout(function() {
        document.getElementById("navBarrier").hidden = true;
    }, 500)
}
function sortObject(data, sortBy, aToZ) {
    let sortedData;
    if (aToZ == true) {
        sortedData = Object.fromEntries(Object.entries(data).sort(([,a], [,b]) => (a[sortBy] || '').localeCompare(b[sortBy] || '')));
    } else {
        sortedData = Object.fromEntries(Object.entries(data).sort(([,b], [,a]) => (a[sortBy] || '').localeCompare(b[sortBy] || '')));
    }
    return sortObject;
}
function previousDate(time) {
    let tempDate = time.split("-");
    let year = tempDate[0];
    let month = tempDate[1];
    let date = tempDate[2];
    date -= 1;
    if (date <= 0) {
        month -= 1;
        console.log(month)
        if ([1,3,5,7,8,10,12].includes(month)) {
            date = 31;
        } else if ([4,6,9,11].includes(month)) {
            date = 30;
        } else {
            if (year % 4 == 0) {
            date = 29;
            } else {
            date = 28
            }
        }
    };
    if (month <= 0) {
        year -= 1;
    };
    return(`${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`)
}
function timeToWords(time) {
    let tempTime = time.split('-');
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return(`${months[parseInt(tempTime[1]) - 1]} ${tempTime[2]}, ${tempTime[0]}`)
}
function getTodayDate() {
    let time = new Date();
    return(`${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`);
}
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
function getDate(time) {
    return(`${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`);
}
function getTimeDifference(now, then) {
    let timeNow = new Date(now);
    let timeThen = new Date(then);
    let hour = timeNow.getHours() - timeThen.getHours();
    let min = timeNow.getMinutes() - timeThen.getMinutes();
    let sec = timeNow.getSeconds() - timeThen.getSeconds();
    if (sec < 0) {
        sec = 60 + sec;
        min -= 1;
    }
    if (min < 0) {
        min = 60 + min;
        hour -= 1;
    }
    if (hour < 0) {
        hour = 0;
    }
    return(`${hour}-${min}-${sec}`)
}

function notify(message) {
    let barrier = document.createElement("div");
    barrier.style = "position: fixed; width: 100%; height: 100%; left: 0%; top: 0%; animation-name: darken; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards; z-index: 999;";
    document.body.appendChild(barrier);
    let div = document.createElement("div");
    div.style = "padding: 10px; background-color: #ffffff; border: 1px solid #000000; border-radius: 10px; width: 90%; max-width: 500px; max-height: 50%; overflow: auto; overflow-wrap: break-word; position: absolute; left: 50%; top: 25%; transform: translateX(-50%); animation-name: popUp; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards;";
    barrier.appendChild(div);
    let messageDiv = document.createElement("div");
    messageDiv.style = "font-size: 16px;"
    messageDiv.innerHTML = message.replaceAll("\n", "<br>");
    div.appendChild(messageDiv);
    div.appendChild(document.createElement("br"));
    let button = document.createElement("button");
    button.innerHTML = "OK";
    button.style = "background-color: rgb(0, 60, 255); color: white; border: none; padding: 10px 20px; font-size: 12px; cursor: pointer; border-radius: 4px; float: right;";
    div.appendChild(button);
    let clear = document.createElement("div");
    clear.style = "clear: both;";
    div.appendChild(clear);
    button.onclick = function() {
        div.style.animationDuration = "150ms";
        div.style.animationName = "popOut";
        barrier.style.animationDuration = "150ms";
        barrier.style.animationName = "lighten";
        barrier.onanimationend = function() {
            barrier.remove();
        }
    }
}
function inquire(message, def, code) {
    let barrier = document.createElement("div");
    barrier.style = "position: fixed; width: 100%; height: 100%; left: 0%; top: 0%; animation-name: darken; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards; z-index: 999;";
    document.body.appendChild(barrier);
    let div = document.createElement("div");
    div.style = "padding: 10px; background-color: #ffffff; border: 1px solid #000000; border-radius: 10px; width: 90%; max-width: 500px; max-height: 50%; overflow: auto; overflow-wrap: break-word; position: absolute; left: 50%; top: 25%; transform: translateX(-50%); animation-name: popUp; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards;";
    barrier.appendChild(div);
    let messageDiv = document.createElement("div");
    messageDiv.style = "font-size: 16px;"
    messageDiv.innerHTML = message.replaceAll("\n", "<br>");
    div.appendChild(messageDiv);
    div.appendChild(document.createElement("br"));
    let input = document.createElement("input");
    input.value = def;
    input.style = "padding: 5px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; width: 100%;";
    div.appendChild(input);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.style = "background-color: #ffffff; color: black; border: none; outline: solid lightgrey 1px; padding: 10px 20px; font-size: 12px; cursor: pointer; border-radius: 4px; float: right;";
    div.appendChild(cancel);
    let br1 = document.createElement("div")
    br1.style = "float: right; color: rgba(0, 0, 0, 0);";
    br1.innerHTML = "__";
    div.appendChild(br1);
    let ok = document.createElement("button");
    ok.innerHTML = "OK";
    ok.style = "background-color: rgb(0, 60, 255); color: white; border: none; outline: solid lightgrey 1px; padding: 10px 20px; font-size: 12px; cursor: pointer; border-radius: 4px; float: right;";
    div.appendChild(ok);
    let clear = document.createElement("div");
    clear.style = "clear: both;";
    div.appendChild(clear);
    ok.onclick = function() {
        div.style.animationDuration = "150ms";
        div.style.animationName = "popOut";
        barrier.style.animationDuration = "150ms";
        barrier.style.animationName = "lighten";
        code(input.value);
        div.onanimationend = function(aa) {
            if (aa.animationName == "popOut") {
                barrier.remove();
            }
        }
    }
    input.onkeydown = function(ev) {
        if (ev.code == "Enter") {
            ok.click();
        }
    }
    cancel.onclick = function() {
        div.style.animationDuration = "150ms";
        div.style.animationName = "popOut";
        barrier.style.animationDuration = "150ms";
        barrier.style.animationName = "lighten";
        code(null);
        div.onanimationend = function(aa) {
            if (aa.animationName == "popOut") {
                barrier.remove();
            }
        }
    }
    input.focus();
}
function verify(message, code) {
    let barrier = document.createElement("div");
    barrier.style = "position: fixed; width: 100%; height: 100%; left: 0%; top: 0%; animation-name: darken; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards; z-index: 999;";
    document.body.appendChild(barrier);
    let div = document.createElement("div");
    div.style = "padding: 10px; background-color: #ffffff; border: 1px solid #000000; border-radius: 10px; width: 90%; max-width: 500px; max-height: 50%; overflow: auto; overflow-wrap: break-word; position: absolute; left: 50%; top: 25%; transform: translateX(-50%); animation-name: popUp; animation-duration: 150ms; animation-timing-function: linear; animation-fill-mode: forwards;";
    barrier.appendChild(div);
    let messageDiv = document.createElement("div");
    messageDiv.style = "font-size: 16px;"
    messageDiv.innerHTML = message.replaceAll("\n", "<br>");
    div.appendChild(messageDiv);
    div.appendChild(document.createElement("br"));
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.style = "background-color: #ffffff; color: black; border: none; outline: solid lightgrey 1px; padding: 10px 20px; font-size: 12px; cursor: pointer; border-radius: 4px; float: right;";
    div.appendChild(cancel);
    let br1 = document.createElement("div")
    br1.style = "float: right; color: rgba(0, 0, 0, 0);";
    br1.innerHTML = "__";
    div.appendChild(br1);
    let ok = document.createElement("button");
    ok.innerHTML = "OK";
    ok.style = "background-color: rgb(0, 60, 255); color: white; border: none; outline: solid lightgrey 1px; padding: 10px 20px; font-size: 12px; cursor: pointer; border-radius: 4px; float: right;";
    div.appendChild(ok);
    let clear = document.createElement("div");
    clear.style = "clear: both;";
    div.appendChild(clear);
    ok.onclick = function() {
        div.style.animationDuration = "150ms";
        div.style.animationName = "popOut";
        barrier.style.animationDuration = "150ms";
        barrier.style.animationName = "lighten";
        code(true);
        div.onanimationend = function(aa) {
            if (aa.animationName == "popOut") {
                barrier.remove();
            }
        }
    }
    cancel.onclick = function() {
        div.style.animationDuration = "150ms";
        div.style.animationName = "popOut";
        barrier.style.animationDuration = "150ms";
        barrier.style.animationName = "lighten";
        code(false);
        div.onanimationend = function(aa) {
            if (aa.animationName == "popOut") {
                barrier.remove();
            }
        }
    }
}