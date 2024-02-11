// TODO
/*
Delete feature should be turned off after an hour of posting.
Add filter feature
Make the GUI a little better with stylings.
*/


// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getStorage, ref as stRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUSb8D9xWqda-FGEVfTeEokSMTawyCrFI",
    authDomain: "drukgyel-hss.firebaseapp.com",
    databaseURL: "https://drukgyel-hss-default-rtdb.firebaseio.com",
    projectId: "drukgyel-hss",
    storageBucket: "drukgyel-hss.appspot.com",
    messagingSenderId: "930189749346",
    appId: "1:930189749346:web:22152d4d206ecd6b4ef53b",
    measurementId: "G-D1QK09ZJEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const storage = getStorage(app);

// Firebase Functions
function getAllDatas(code) {
    get(ref(database)).then((snapshot) => {
        if (snapshot.exists()) {
            code(snapshot.val());
        } else {
            code([])
        };
    }).catch((error) => {
        console.error(error);
    });
};
function getData(path, code) {
    get(child(ref(database), path)).then((snapshot) => {
        if (snapshot.exists()) {
            code(snapshot.val());
        } else {
            code([]);
        };
    }).catch((error) => {
        console.error(error);
    });
};
function writeData(path, data, code) {
    set(ref(database, path), data).then(() => {
        code();
    });
};
// Handle Online and Offline Changes
window.onoffline = function() {
    let p = createPrompt();
    p[0].style.height = "auto";
    p[0].style.backgroundColor = "white";
    p[0].style.fontSize = "5vw";
    p[0].style.fontWeight = "bolder";
    p[0].innerHTML = "You went Offline!<br>Please reconnect to continue";
    p[1].hidden = true;
    window.ononline = function() {
        p[1].click();
    };
};

// Basic Functions
function createPrompt() {
    let div = document.createElement("div");
    div.style = "position: fixed; z-index: 2; width: 100%; height: 100%; left: 0%; top: 0%; background-color: rgba(0,0,0,0.5);";
    document.body.appendChild(div);
    let holder = document.createElement("div");
    holder.style = "padding: 5%; position: fixed; z-index: 2; width: 75%; height: 75%; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); border-radius: 5vw; background-color: #0989EC; box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24); text-align: center; overflow: auto; overflow-wrap: break-word; scroll-behavior: smooth;";
    div.appendChild(holder);
    let close = document.createElement("button");
    close.style.backgroundColor = "red";
    close.innerHTML = "&#10006;";
    close.style = "position: fixed; right: 5%; top: 5%; background-color: red; color: white; border: none; padding: 10px 15px; font-size: 3vw; cursor: pointer; z-index: 3; border-radius: 2vw";
    div.appendChild(close);
    close.onclick = function () {
        div.remove();
    };
    return([holder, close])
}
function titleText(holder, text) {
    let b = document.createElement("b");
    b.innerHTML = text;
    b.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(b);
    holder.appendChild(document.createElement("br"));
}
function textInput(holder, placeholder) {
    let inp = document.createElement("input");
    inp.placeholder = placeholder;
    inp.style = "width: 90%";
    holder.appendChild(inp);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    return(inp)
}
function dropdown(holder, placeholder, options) {
    let sel = document.createElement("select");
    sel.innerHTML = `<option value="" selected disabled hidden>${placeholder}</option>`;
    for (let o of options) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        elem.style = "color: black;"
        sel.appendChild(elem);
    }
    sel.style = "width: 90%; color: gray;";
    holder.appendChild(sel);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    sel.oninput = function() {
        sel.style.color = "black";
    }
    return(sel)
}
function textArea(holder, placeholder) {
    let tarea = document.createElement("textarea");
    tarea.placeholder = placeholder;
    tarea.style = "width: 90%; resize: none;";
    holder.appendChild(tarea);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let ch = tarea.clientHeight;
    tarea.oninput = function() {
        if (this.scrollHeight > ch) {
            this.style.height = ch;
            this.style.height = this.scrollHeight + 5;
        }
    }
    return(tarea)
}
function button(holder, text, code) {
    let btn = document.createElement("button");
    btn.innerHTML = text;
    holder.appendChild(btn);
    btn.onclick = function(event) {
        code(event)
    };
    return(btn)
}
function boldText(holder, text) {
    let b = document.createElement("b");
    b.style = "width: 90%; text-align: left; display: inline-block;";
    b.innerHTML = text;
    holder.appendChild(b);
    holder.appendChild(document.createElement("br"));
}
function dateInput(holder) {
    let date = document.createElement("input")
    date.type = "date"
    date.style = "width: 90%"
    holder.appendChild(date);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    return(date)
}

// Setup startup screen
function startup() {
    let urlParams = new URLSearchParams(window.location.search);
    let initialValue = urlParams.get('page');
    let par = initialValue || undefined; // Use a default value if the parameter is not presents
    let availScreens = navList.map(item => item.label);
    if (par != undefined && availScreens.includes(par)) {
        document.getElementById(par + " Btn").click();
    } else {
        if (window.location.search.lastIndexOf('?') == -1) {
            window.history.pushState({}, null, window.location.search + "?page=School Profile");
        };
    };
    if (localStorage.userId == undefined) {
        let users = data.users;
        function createUID() {
            let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            let uid = "";
            for (let i = 0; i < 10; i++) {
                uid += chars[Math.floor(Math.random() * (35 - 0 + 1) + 0)]
            }
            if ((users == undefined) || (uid in users == false)) {
                localStorage.userId = uid;
                writeData(`users/${uid}`, "", function() {
                    if (users == undefined) {
                        users = {}
                    }
                    users[uid] = ""
                })
            } else {
                createUID()
            }
        }
        createUID()
    }
}

// Global Variables
var data = undefined;
var dataStorage = {}

// Splash Screen
var splash = false;
var loading = "loading"
if ((navigator.onLine ? "Online" : "Offline") == "Offline") {
    loading = "Failed"
}
document.getElementById("splashLogo").onanimationend = function () {
    setTimeout(function () {
        splash = true;
        if (data != undefined) {
            document.getElementById("splashDiv").remove();
            loading = "Loaded";
            startup()
        } else {
            if (loading == "loading") {
                document.getElementById("splashLoad").innerHTML = "Loading Data<br>Please Wait";
            } else {
                document.getElementById("splashLoad").innerHTML = "No Internet Connection";
            }
            setTimeout(function() {
                if (loading == "loading") {
                    document.getElementById("splashLoad").innerHTML = "Unstable Network<br>Please Try Again Later";
                }
            }, 5000);
        };
    }, 500);
};
getAllDatas(function (res) {
    data = res;

    // Splash
    if (splash == true) {
        document.getElementById("splashDiv").remove();
        loading = "Loaded";
    };

    // School Profile
    let schoolProfile = data.schoolProfile;
    let txt = `Principal: ${schoolProfile["Principal"]}<br>`;
    for (let x of schoolProfile["Vice Principal"].values()) {
        txt += `Vice Principal: ${x}<br>`;
    };
    txt += `Total Students: ${parseInt(schoolProfile["Boys"]) + parseInt(schoolProfile["Girls"])} [Boarders: ${schoolProfile["Boarders"]} & Day Scholars: ${schoolProfile["Day Scholars"]}] [Boys: ${schoolProfile["Boys"]} & Girls: ${schoolProfile["Girls"]}]<br>`;
    txt += `Total Staff: ${parseInt(schoolProfile["Teachers"]) + parseInt(schoolProfile["Supporting Staffs"])} [Teachers: ${schoolProfile["Teachers"]} & Supporting Staffs: ${schoolProfile["Supporting Staffs"]}]`;
    document.getElementById("schoolProfileA").innerHTML = txt;

    // About
    document.getElementById("aboutDiv").innerHTML = data.aboutSchool.replaceAll("\n", "<br>");

    // Datas
    dataStorage = {
        announcements: data.announcements,
        casualLeaves: data.casualLeaves,
        inCampusLeaves: data.inCampusLeaves,
        studyReports: data.studyReports,
        users: data.users
    }
    for (let x of Object.keys(dataStorage)) {
        if (dataStorage[x] == undefined) {
            dataStorage[x] = {};
        }
    }

    startup()
});

// Setup the navigation drawer;
var navList = [
    { label: "School Profile", logo: "./assets/home.svg" },
    { label: "About School", logo: "./assets/home.svg" },
    { label: "Class Attendance", logo: "./assets/attendance.svg" },
    { label: "Announcements", logo: "./assets/announcement.svg" },
    { label: "Casual Leave", logo: "./assets/sandglass.svg" },
    { label: "In Campus Leave", logo: "./assets/sandglass.svg" },
    { label: "Study Report", logo: "./assets/report.svg" },
    { label: "Staff Profile", logo: "./assets/book.svg" },
    { label: "Staff Attendance", logo: "./assets/attendance.svg" },
    { label: "Contacts", logo: "./assets/contacts.svg" },
    { label: "About", logo: "./assets/about.svg" }
];
for (let d = 0; d < navList.length; d++) {
    let a = document.createElement("a");
    a.style = "text-decoration: none; display: flex; align-items: center;";
    a.value = navList[d].label;
    a.id = navList[d]["label"] + " Btn";
    let img = document.createElement("img");
    img.style = "height: 25px";
    img.src = navList[d].logo;
    a.appendChild(img);
    a.innerHTML += "&nbsp;&nbsp;&nbsp;";
    let b = document.createElement("b");
    b.style = "color: black; font-size: 5vw;";
    b.innerHTML = navList[d].label;
    a.appendChild(b);
    document.getElementById("navSubHolder").appendChild(a);
    document.getElementById("navSubHolder").appendChild(document.createElement("br"));
    a.onclick = function () {
        let val = a.value.replace(" Btn", "")
        if (setScreen(val) == true) {
            // Load Datas and display in screen
            if (val == "Announcements" && dataStorage.announcements != undefined) {
                listLoad(dataStorage.announcements, "announcementDiv", function(div, x, y) {
                    div.innerHTML = `<b style="font-size: 5vw; display: block;">${dataStorage.announcements[y][x].name}</b>
                    <b style="font-size: 4vw;">To: ${dataStorage.announcements[y][x].to}</b>
                    <a style="float: right; font-size: 4vw; color: #555;">${getTime(x)}</a>
                    <hr style="width: 100%;">
                    <b style="display: block; font-size: 5vw; margin-top: 10px;">${dataStorage.announcements[y][x].heading}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open full announcement</a>`;
                    if (dataStorage.announcements[y][x].uid == localStorage.userId) {
                        let delBtn = document.createElement("button");
                        delBtn.innerHTML = "Delete Announcement";
                        delBtn.id = x;
                        div.appendChild(document.createElement("br"))
                        div.appendChild(document.createElement("br"))
                        div.appendChild(delBtn)
                        delBtn.onclick = function() {
                            let conf = confirm("Are you sure you want to delete this announcement?")
                            if (conf == true) {
                                delBtn.disabled = true;
                                delBtn.innerHTML = "Deleting"
                                remove(ref(database, `announcements/${y}/${x}`)).then(() => {
                                    delete dataStorage["announcements"][y][x];
                                    if (Object.keys(dataStorage["announcements"][y]).length == 0) {
                                        delete dataStorage["announcements"][y];
                                    };
                                    document.getElementById("Announcements Btn").click()
                                })
                                .catch((error) => {
                                    console.error("Error deleting data: ", error);
                                });
                            };
                        }
                    }
                }, function(e, x, y, f, event) {
                    e.innerHTML = `From ${dataStorage.announcements[y][x].name} at ${getTime(x)}<br><br>To ${dataStorage.announcements[y][x].to}<br><br>Heading:  ${dataStorage.announcements[y][x].heading}<br><br>${dataStorage.announcements[y][x].message.replaceAll("\n", "<br>")}`
                    if (event.target.id == x) {
                        f.click()
                    }
                });
            } else if (val == "Casual Leave" && dataStorage.casualLeaves != undefined) {
                listLoad(dataStorage.casualLeaves, "casualLeaveDiv", function(div, x, y) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
                    <b style="font-size: 5vw; display: block;">${dataStorage.casualLeaves[y][x].name}</b>
                    <b style="font-size: 4vw;">Reason: ${dataStorage.casualLeaves[y][x].reason}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${dataStorage.casualLeaves[y][x].type}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                    if (dataStorage.casualLeaves[y][x].uid == localStorage.userId) {
                        let delBtn = document.createElement("button");
                        delBtn.innerHTML = "Cancel Leave";
                        delBtn.id = x;
                        div.appendChild(document.createElement("br"))
                        div.appendChild(document.createElement("br"))
                        div.appendChild(delBtn)
                        delBtn.onclick = function() {
                            let conf = confirm("Are you sure you want to cancel your leave?")
                            if (conf == true) {
                                delBtn.disabled = true;
                                delBtn.innerHTML = "Canceling"
                                remove(ref(database, `casualLeaves/${y}/${x}`)).then(() => {
                                    delete dataStorage["casualLeaves"][y][x];
                                    if (Object.keys(dataStorage["casualLeaves"][y]).length == 0) {
                                        delete dataStorage["casualLeaves"][y];
                                    };
                                    document.getElementById("Casual Leave Btn").click()
                                })
                                .catch((error) => {
                                    console.error("Error deleting data: ", error);
                                });
                            };
                        }
                    }
                    
                }, function(e, x, y, f, event) {
                    e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    Name: ${dataStorage.casualLeaves[y][x].name}<hr>
                    Type of Leave: ${dataStorage.casualLeaves[y][x].type}<hr>
                    Duration: ${dataStorage.casualLeaves[y][x].duration}<hr>
                    Start Date:  ${dataStorage.casualLeaves[y][x].startDate}<hr>
                    End Date: ${dataStorage.casualLeaves[y][x].endDate}<hr>
                    Reason: ${dataStorage.casualLeaves[y][x].reason}`
                    if (event.target.id == x) {
                        f.click()
                    }
                });
            } else if (val == "In Campus Leave" && dataStorage.inCampusLeaves != undefined) {
                listLoad(dataStorage.inCampusLeaves, "campusLeaveDiv", function(div, x, y) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${dataStorage.inCampusLeaves[y][x].date} ${dataStorage.inCampusLeaves[y][x].time}</a>
                    <b style="font-size: 5vw; display: block;">${dataStorage.inCampusLeaves[y][x].name}</b>
                    <b style="font-size: 4vw;">Purpose: ${dataStorage.inCampusLeaves[y][x].purpose}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${dataStorage.inCampusLeaves[y][x].period}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                    if (dataStorage.inCampusLeaves[y][x].uid == localStorage.userId) {
                        let delBtn = document.createElement("button");
                        delBtn.innerHTML = "Cancel Leave";
                        delBtn.id = x;
                        div.appendChild(document.createElement("br"))
                        div.appendChild(document.createElement("br"))
                        div.appendChild(delBtn)
                        delBtn.onclick = function() {
                            let conf = confirm("Are you sure you want to cancel your leave?")
                            if (conf == true) {
                                delBtn.disabled = true;
                                delBtn.innerHTML = "Canceling"
                                remove(ref(database, `inCampusLeaves/${y}/${x}`)).then(() => {
                                    delete dataStorage["inCampusLeaves"][y][x];
                                    if (Object.keys(dataStorage["inCampusLeaves"][y]).length == 0) {
                                        delete dataStorage["inCampusLeaves"][y];
                                    };
                                    document.getElementById("In Campus Leave Btn").click()
                                })
                                .catch((error) => {
                                    console.error("Error deleting data: ", error);
                                });
                            };
                        }
                    }
                }, function(e, x, y, f, event) {
                    e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    Name: ${dataStorage.inCampusLeaves[y][x].name}<hr>
                    Date and Time: ${dataStorage.inCampusLeaves[y][x].date} ${dataStorage.inCampusLeaves[y][x].time}<hr>
                    Purpose: ${dataStorage.inCampusLeaves[y][x].purpose}<hr>
                    Period [From - To]:  ${dataStorage.inCampusLeaves[y][x].period}`
                    if (event.target.id == x) {
                        f.click()
                    }
                });
            } else if (val == "Study Report" && dataStorage.studyReports != undefined) {
                listLoad(dataStorage.studyReports, "studyReportDiv", function(div, x, y) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
                    <b style="font-size: 5vw; display: block;">${dataStorage.studyReports[y][x].teacher}</b>
                    <b style="font-size: 4vw; color: #3A3B3C;">${dataStorage.studyReports[y][x].study}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px;">${dataStorage.studyReports[y][x].absentee.replaceAll("\n", "<br>")}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                    if (dataStorage.studyReports[y][x].uid == localStorage.userId) {
                        let delBtn = document.createElement("button");
                        delBtn.innerHTML = "Delete Report";
                        delBtn.id = x;
                        div.appendChild(document.createElement("br"))
                        div.appendChild(document.createElement("br"))
                        div.appendChild(delBtn)
                        delBtn.onclick = function() {
                            let conf = confirm("Are you sure you want to delete this report?")
                            if (conf == true) {
                                delBtn.disabled = true;
                                delBtn.innerHTML = "Deleting"
                                remove(ref(database, `studyReports/${y}/${x}`)).then(() => {
                                    delete dataStorage["studyReports"][y][x];
                                    if (Object.keys(dataStorage["studyReports"][y]).length == 0) {
                                        delete dataStorage["studyReports"][y];
                                    };
                                    document.getElementById("Study Report Btn").click()
                                })
                                .catch((error) => {
                                    console.error("Error deleting data: ", error);
                                });
                            };
                        }
                    }
                }, function(e, x, y, f, event) {
                    e.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    ToD: ${dataStorage.studyReports[y][x].teacher}<hr>
                    Study: ${dataStorage.studyReports[y][x].study}<hr>
                    Date: ${dataStorage.studyReports[y][x].date}<hr>
                    Absentee:<br>${dataStorage.studyReports[y][x].absentee.replaceAll("\n", "<br>")}`
                    if (event.target.id == x) {
                        f.click()
                    }
                });
            } else if (val == "Staff Profile" && dataStorage.users != undefined) {
                document.getElementById("staffProfileDiv").innerHTML = "";
                document.getElementById("staffProfileDiv").appendChild(at)
                let data = dataStorage.users;
                if (Object.keys(data).length == 0) {
                    let b = document.createElement("b")
                    b.innerHTML = "No Data";
                    document.getElementById("staffProfileDiv").insertBefore(b, document.getElementById("staffProfileDiv").firstChild);
                } else {
                    for (let s of Object.keys(data)) {
                        if (data[s] != "") {
                            let div = document.createElement("div");
                            div.style = "width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
                            document.getElementById("staffProfileDiv").insertBefore(div, document.getElementById("staffProfileDiv").firstChild);
                            div.innerHTML = `<b style="font-size: 5vw; display: block;">${data[s].name}</b>
                            <b style="font-size: 4vw;">Class Teacher of ${data[s].classTeacher}</b>
                            <b style="display: block; font-size: 4vw; color: #3A3B3C;">${data[s].subject}</b><br>
                            <a style="font-size: 4vw; color: blue;">Click to open more details</a>`;
                            div.onclick = function() {
                                let elem = createPrompt()
                                elem[0].style.backgroundColor = "white";
                                elem[0].style.textAlign = "left";
                                let con = `<div style="position: relative; left: 50%; transform: translateX(-50%); width: 30%; aspect-ratio: 1/1; overflow: hidden; background-image: url('${data[s].profilePicture}'); background-position: center; background-repeat: no-repeat; background-size: cover;"></div><br>
                                <b style="width: 100%; text-align: center; left: 0%; position: relative; display: inline-block;">${data[s].name}</b><br><br>
                                Class Teacher of&nbsp;${data[s].classTeacher}<hr>
                                Subject: ${data[s].subject}<hr>
                                Currently Teaching Classes: ${data[s].classes}<hr>
                                Phone Number: <a href='tel: ${data[s].phoneNumber}'>${data[s].phoneNumber}</a><hr>
                                Email: <a href='mailto:${data[s].email}'>${data[s].email}</a>`
                                elem[0].innerHTML = con;
                            };
                        }
                    }
                }
            };
            document.getElementById("header").innerHTML = val;
            if (document.getElementById("navBarrier").hidden == false) {
                navClose();
            };
            window.history.pushState({}, null, window.location.search.substring(0, window.location.search.lastIndexOf('?')) + "?page=" + a.value);
        }
    };
};

// For Space beside the plus button and function for loads
var height = 0;
height += window.screen.width * 0.15;
height += window.screen.height * 0.05;
for (let o of document.querySelectorAll(".at")) {
    o.style.height = height;
}
var at = document.createElement("div")
at.style.height = height;

function getTime(x) {
    let time = new Date(parseInt(x));
    let hours = String(time.getHours()).padStart(2, '0');
    let minutes = String(time.getMinutes()).padStart(2, '0');
    let ampm = "am"
    if (parseInt(hours) > 12) {
        hours = parseInt(hours) - 12;
        ampm = "pm"
    }
    return(`${hours}:${minutes} ${ampm}`)
}

function listLoad(data, divElem, code, oncl) {
    document.getElementById(divElem).innerHTML = "";
    document.getElementById(divElem).appendChild(at)
    if (Object.keys(data).length == 0) {
        let b = document.createElement("b")
        b.innerHTML = "No Data"
        document.getElementById(divElem).insertBefore(b, document.getElementById(divElem).firstChild);
    }
    for (let y of Object.keys(data)) {
        document.getElementById(divElem).insertBefore(document.createElement("br"), document.getElementById(divElem).firstChild);
        for (let x of Object.keys(data[y])) {
            let div = document.createElement("div");
            div.style = "width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
            document.getElementById(divElem).insertBefore(div, document.getElementById(divElem).firstChild);
            code(div, x, y)
            div.onclick = function(event) {
                let elem = createPrompt()
                elem[0].style.backgroundColor = "white";
                elem[0].style.textAlign = "left";
                oncl(elem[0], x, y, elem[1], event)
                // event.target.click()
            };
        }
        let date = document.createElement("b");
        let time = new Date();
        if (y == `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`) {
            date.innerHTML = "Today"
        } else if (y == previousDate(`${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`)) {
            date.innerHTML = "Yesterday";
        } else {
            date.innerHTML = timeToWords(y);
        }
        date.style = "font-size: 7vw;"
        document.getElementById(divElem).insertBefore(document.createElement("br"), document.getElementById(divElem).firstChild);
        document.getElementById(divElem).insertBefore(date, document.getElementById(divElem).firstChild);
    };
};

// Class Attendance
var classes = [
    {"class":"12 A", link: "https://tinyurl.com/3pcez7rs"},
    {"class":"12 B", link: "https://tinyurl.com/t3u3yfsr"},
    {"class":"12 C", link: "https://tinyurl.com/5fdfdtyy"},
    {"class":"12 D", link: "https://tinyurl.com/24rh79b9"},
    {"class":"12 E", link: "https://tinyurl.com/4f5twbsn"},
    {"class":"11 A", link: "https://bit.ly/3EPxhs0"},
    {"class":"11 B", link: "https://bit.ly/3EIVEYc"},
    {"class":"11 C", link: "https://bit.ly/3ZDsD8H"},
    {"class":"11 D", link: "https://bit.ly/3mFJ3z5"},
    {"class":"11 E", link: "https://bit.ly/41A5Qfq"},
    {"class":"10 A", link: "https://bit.ly/3FdDcY4"},
    {"class":"10 B", link: "https://tinyurl.com/5ejfasxy"},
    {"class":"10 C", link: "https://tinyurl.com/yskx9h4c"},
    {"class":"10 D", link: "https://bit.ly/3y17fy6"},
    {"class":"10 E", link: "https://tinyurl.com/bdee495t"},
    {"class":"9 A", link: "https://tinyurl.com/yc4r6z3r"},
    {"class":"9 B", link: "https://tinyurl.com/2p93jt88"},
    {"class":"9 C", link: "https://tinyurl.com/558mdcpc"},
    {"class":"9 D", link: "https://tinyurl.com/5hcbwdy2"},
    {"class":"9 E", link: "https://bit.ly/3IOVboS"},
    {"class":"8 A", link: "https://tinyurl.com/586u3p3j"},
    {"class":"8 B", link: "https://tinyurl.com/ysft64v6"},
    {"class":"8 C", link: "https://tinyurl.com/mvns73cx"},
    {"class":"7 A", link: "https://tinyurl.com/2z2cnup9"},
    {"class":"7 B", link: "https://bit.ly/3me8SpF"},
    {"class":"7 C", link: "https://bit.ly/3J5SW0q"}
];
// var classes = ["12 A", "12 B", "12 C", "12 D", "12 E", "11 A", "11 B", "11 C", "11 D", "11 E", "10 A", "10 B", "10 C", "10 D", "10 E", "9 A", "9 B", "9 C", "9 D", "9 E", "8 A", "8 B", "8 C", "7 A", "7 B", "7 C"];
document.getElementById("classListHolder").innerHTML = "";
for (let a = 0; a < classes.length; a++) {
    let btn = document.createElement("button");
    btn.style = "margin: 2%; width: 45%; border-radius: 15px; background-color: black; color: white; font-weight: bolder; font-size: 7.5vw;";
    btn.id = "attendanceBtn" + a;
    btn.innerHTML = classes[a]["class"];
    document.getElementById("classListHolder").appendChild(btn);
    btn.onclick = function() {
        let g = document.createElement("a");
        g.href = classes[a]["link"];
        g.target = "_blank"
        g.click();
    };
};

// Announcements
document.getElementById("announcementBtn").onclick = function () {
    let annElem = createPrompt();
    let holder = annElem[0];
    let closeBtn = annElem[1];
    titleText(holder, "Announcement")
    let annName = textInput(holder, "Name")
    let annTo = dropdown(holder, "Announcement for", ["Captains", "Everyone", "Students", "Teachers", "Others"])
    annTo.onchange = function() {
        if (annTo.value == "Others") {
            let to = "";
            while (to.trim() == "") {
                to = prompt("This announcement is for: ")
                if (to == null) {
                    annTo.firstChild.selected = true;
                    break;
                } else if (to.trim() != "") {
                    let elem = document.createElement("option");
                    elem.innerHTML = to;
                    elem.style = "color: black;"
                    elem.selected = true;
                    annTo.insertBefore(elem, annTo.lastChild);
                }
            }
        }
    }
    let annHeading = textInput(holder, "Heading")
    let annMessage = textArea(holder, "Announcement")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: annName.value.trim(),
            to: annTo.value.trim(),
            heading: annHeading.value.trim(),
            message: annMessage.value.trim()
        };
        if (data.name != "" && data.to != "" && data.heading != "" && data.message != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`announcements/${date}/${ts}`, data, function() {
                closeBtn.click();
                if (dataStorage.announcements[date] == undefined) {
                    dataStorage.announcements[date] = {};
                }
                dataStorage.announcements[date][ts] = data;
                document.getElementById("Announcements Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    })
};

// Casual Leave
document.getElementById("casualLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Casual Leave");
    let clName = textInput(holder, "Name");
    let clType = dropdown(holder, "Leave Type", ["Casual Leave", "Medical Leave", "Maternity Leave", "Paternity Leave", "Earned Leave", "Extra Ordinary Leave", "Medical Escort Leave", "Bereavement Leave"]);
    let clDuration = dropdown(holder, "Duration", ["Half Day", "One Day", "Two Days", "Three Days", "Four Days", "Five Days", "Six Days", "Seven Days", "Eight Days", "Nine Days", "Ten Days"]);
    boldText(holder, "Start Date")
    let clStart = dateInput(holder)
    boldText(holder, "End Date")
    let clEnd = dateInput(holder)
    let clReason = textInput(holder, "Reason")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: clName.value.trim(),
            type: clType.value,
            duration: clDuration.value,
            startDate: clStart.value,
            endDate: clEnd.value,
            reason: clReason.value.trim()
        };
        if (data.name != "" && data.type != "" && data.duration != "" && data.startDate != "" && data.endDate != "" && data.reason != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`casualLeaves/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.casualLeaves[date] = {}
                dataStorage.casualLeaves[date][ts] = data;
                document.getElementById("Casual Leave Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    })
};

// In Campus Leave
document.getElementById("campusLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "In Campus Leave")
    let clName = textInput(holder, "Name")
    boldText(holder, "Date and Time")
    let clDate = document.createElement("input")
    clDate.type = "date"
    clDate.style = "width: 45%"
    holder.appendChild(clDate);
    let clTime = document.createElement("input")
    clTime.type = "time"
    clTime.style = "width: 45%"
    holder.appendChild(clTime);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clPurpose = textInput(holder, "Purpose")
    let clPeriod = textInput(holder, "Period [From - To]")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            name: clName.value.trim(),
            date: clDate.value,
            time: clTime.value,
            purpose: clPurpose.value.trim(),
            period: clPeriod.value.trim()
        };
        if (data.name != "" && data.date != "" && data.time != "" && data.purpose != "" && data.period != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`inCampusLeaves/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.inCampusLeaves[date] = {}
                dataStorage.inCampusLeaves[date][ts] = data;
                document.getElementById("In Campus Leave Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Study Report
document.getElementById("studyReportBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Study Report");
    let srTeacher = textInput(holder, "Teacher (ToD)");
    boldText(holder, "Date");
    let srDate = dateInput(holder);
    let srStudy = dropdown(holder, "Study", ["Morning Study", "Evening Study", "Night Study"]);
    let srAbsentees = textArea(holder, "Absentees [Name,Class,Sec,Bdr/DS,Reason]")
    let uploadBtn = button(holder, "Upload", function() {
        let time = new Date();
        let ts = Date.now();
        let data = {
            uid: localStorage.userId,
            teacher: srTeacher.value.trim(),
            date: srDate.value,
            study: srStudy.value,
            absentee: srAbsentees.value.trim()
        };
        if (data.teacher != "" && data.date != "" && data.study != "" && data.absentee != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let date = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, "0")}-${time.getDate().toString().padStart(2, "0")}`
            writeData(`studyReports/${date}/${ts}`, data, function() {
                closeBtn.click();
                dataStorage.studyReports[date] = {}
                dataStorage.studyReports[date][ts] = data;
                document.getElementById("Study Report Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Staff Profile
document.getElementById("staffProfileBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    titleText(holder, "Your Profile")
    let spName = textInput(holder, "Name");
    boldText(holder, "Profile Picture")
    let spInp = document.createElement("input");
    spInp.type = "file";
    spInp.accept = "image/*"
    spInp.style = "display: none;";
    let spInpBtn = document.createElement("button");
    spInpBtn.innerHTML = "Choose an Image";
    spInpBtn.style = "width: 90%;"
    spInpBtn.appendChild(spInp);
    holder.appendChild(spInpBtn);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    spInpBtn.onclick = function() {
        spInp.click();
    }
    let spSubject = textInput(holder, "Subject");
    let spClassTeacher = textInput(holder, "Class Teacher");
    let spClasses = textInput(holder, "Currently Teaching Classes");
    let spPhone = textInput(holder, "Phone Number");
    spPhone.type = "number";
    let spEmail = textInput(holder, "Email");
    spEmail.type = "email";
    let uploadBtn = button(holder, "Upload", function() {
        let tempData = {
            name: spName.value.trim(),
            subject: spSubject.value.trim(),
            classTeacher: spClassTeacher.value.trim(),
            classes: spClasses.value.trim(),
            phoneNumber: spPhone.value.trim(),
            email: spEmail.value.trim()
        };
        if (tempData.name != "" && tempData.date != "" && tempData.time != "" && tempData.purpose != "" && tempData.period != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading Profile Picture"
            let storageRef = stRef(storage, `staffProfile/${localStorage.userId}/${spInp.files[0].name}`)
            let task = uploadBytesResumable(storageRef, spInp.files[0]);
            task.on('state_changed', (snapshot) => {
                let progress = `${(snapshot.bytesTransferred / 1024 / 1024).toFixed(2)}mb / ${(snapshot.totalBytes / 1024 / 1024).toFixed(2)}mb`;
                uploadBtn.innerHTML = ("Uploading Profile Picture<br>"+progress)
            }, 
            (error) => {
                console.log("Failed to upload", error)
                    // Handle unsuccessful uploads
            }, () => {
                uploadBtn.innerHTML = ("Profile Picture Uploaded<br>Uploading Data")
                getDownloadURL(storageRef).then((Url) => {
                    tempData.profilePicture = Url;
                    let ts = Date.now();
                    writeData(`users/${localStorage.userId}`, tempData, function() {
                        closeBtn.click();
                        dataStorage.users[ts] = tempData;
                        document.getElementById("Staff Profile Btn").click();
                    });
                })
            });
        } else {
            alert("Please fill up all the information");
        };
    });
};

// Contacts
var contacts = [
    {
        "title": "Social Coordinator",
        "name": "Lop. Yeshey Loday",
        "contact": 17627882
    },
    {
        "title": "Spiritual Coordinator",
        "name": "Lop. Gem Gyelsthen",
        "contact": 17625858
    },
    {
        "title": "Vice Principal (Physical Coordinator)",
        "name": "Lop. Namgay Phuntsho",
        "contact": 17640554
    },
    {
        "title": "Emotional Coordinator",
        "name": "Lop. Tshering Yangden",
        "contact": 17577292
    },
    {
        "title": "Exam Coordinator",
        "name": "Lop. Rinchen Khandu",
        "contact": 17659251
    }
];

for (let x of contacts) {
    let div = document.createElement("div");
    div.style = "font-size: 4vw;"
    div.innerHTML = `<b>${x.title}</b><br><a>${x.name}</a>
    <button style='float: right;' onclick='window.location.href = "tel: ${x.contact}";'>Contact</button>`;
    document.getElementById("contactsDiv").appendChild(div);
    document.getElementById("contactsDiv").appendChild(document.createElement("br"));
};