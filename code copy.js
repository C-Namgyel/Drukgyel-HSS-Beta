// TODO
/*
Create functions for creating new elements such as input and all.
Add the staff photo feature.
Make the GUI a little better with stylings.
*/


// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

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

// Setup startup screen
function startup() {
    var urlParams = new URLSearchParams(window.location.search);
    var initialValue = urlParams.get('page');
    var par = initialValue || undefined; // Use a default value if the parameter is not presents
    var availScreens = navList.map(item => item.label);
    if (par != undefined && availScreens.includes(par)) {
        document.getElementById(par + " Btn").click();
    } else {
        if (window.location.search.lastIndexOf('?') == -1) {
            window.history.pushState({}, null, window.location.search + "?page=School Profile");
        };
    };
}

// Global Variables
var data = undefined;

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

    // Announcements
    announcements = data.announcements

    // Casual Leave
    casualLeaves = data.casualLeaves

    // In Campus Leave
    campusLeave = data.inCampusLeaves

    // Study Report
    studyReport = data.studyReports

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
    { label: "Staff Photo", logo: "./assets/book.svg" },
    { label: "Staff Attendance", logo: "./assets/attendance.svg" },
    { label: "Contacts", logo: "./assets/contacts.svg" },
    { label: "About", logo: "./assets/about.svg" },
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
            console.log(val)
            console.log(studyReport)
            // Load Datas and display in screen
            if (val == "Announcements" && announcements != undefined) {
                listLoad(announcements, "announcementDiv", function(div, x) {
                    div.innerHTML = `<b style="font-size: 5vw; display: block;">${announcements[x].name}</b>
                    <b style="font-size: 4vw;">To: ${announcements[x].to}</b>
                    <a style="float: right; font-size: 4vw; color: #555;">${getTime(x)}</a>
                    <hr style="width: 100%;">
                    <b style="display: block; font-size: 5vw; margin-top: 10px;">${announcements[x].heading}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open full announcement</a>`
                    
                }, function(y, x) {
                    y.innerHTML = `From ${announcements[x].name} at ${getTime(x)}<br><br>To ${announcements[x].to}<br><br>Heading:  ${announcements[x].heading}<br><br>${announcements[x].message}`
                });
            } else if (val == "Casual Leave" && casualLeaves != undefined) {
                listLoad(casualLeaves, "casualLeaveDiv", function(div, x) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
                    <b style="font-size: 5vw; display: block;">${casualLeaves[x].name}</b>
                    <b style="font-size: 4vw;">Reason: ${casualLeaves[x].reason}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${casualLeaves[x].type}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                    
                }, function(y, x) {
                    y.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    Name: ${casualLeaves[x].name}<hr>
                    Type of Leave: ${casualLeaves.type}<hr>
                    Duration: ${casualLeaves[x].duration}<hr>
                    Start Date:  ${casualLeaves[x].startDate}<hr>
                    End Date: ${casualLeaves[x].endDate}<hr>
                    Reason: ${casualLeaves[x].reason}`
                });
            } else if (val == "In Campus Leave" && campusLeave != undefined) {
                listLoad(campusLeave, "campusLeaveDiv", function(div, x) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${campusLeave[x].date} ${campusLeave[x].time}</a>
                    <b style="font-size: 5vw; display: block;">${campusLeave[x].name}</b>
                    <b style="font-size: 4vw;">Purpose: ${campusLeave[x].purpose}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px; color: #3A3B3C;">${campusLeave[x].period}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                }, function(y, x) {
                    y.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    Name: ${campusLeave[x].name}<hr>
                    Date and Time: ${campusLeave[x].date} ${campusLeave[x].time}<hr>
                    Purpose: ${campusLeave[x].purpose}<hr>
                    Period [From - To]:  ${campusLeave[x].period}`
                });
            } else if (val == "Study Report" && studyReport != undefined) {
                listLoad(studyReport, "studyReportDiv", function(div, x) {
                    div.innerHTML = `<a style="font-size: 4vw; color: #555; display: block;">${getTime(x)}</a>
                    <b style="font-size: 5vw; display: block;">${studyReport[x].teacher}</b>
                    <b style="font-size: 4vw; color: #3A3B3C;">${studyReport[x].study}</b>
                    <b style="display: block; font-size: 4vw; margin-top: 10px;">${studyReport[x].absentee.replaceAll("\n", "<br>")}</b><br>
                    <a style="font-size: 4vw; color: blue;">Click to open more details</a>`
                }, function(y, x) {
                    y.innerHTML = `<b style='font-size: 25px;'>Details</b><br><br>
                    ToD: ${studyReport[x].teacher}<hr>
                    Study: ${studyReport[x].study}<hr>
                    Date: ${studyReport[x].date}<hr>
                    Absentee:<br>${studyReport[x].absentee.replaceAll("\n", "<br>")}`
                });
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
    let date = String(time.getDate()).padStart(2, '0');
    let month = String(time.getMonth() + 1).padStart(2, '0');
    let year = String(String(time.getFullYear()).slice(-2)).padStart(2, '0');
    return(`${hours}:${minutes} ${date}/${month}/${year}`)
}

function listLoad(data, divElem, code, oncl) {
    document.getElementById(divElem).innerHTML = "";
    document.getElementById(divElem).appendChild(at)
    for (let x of Object.keys(data)) {
        let div = document.createElement("div");
        div.style = "width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
        document.getElementById(divElem).insertBefore(div, document.getElementById(divElem).firstChild);
        document.getElementById(divElem).insertBefore(document.createElement("br"), document.getElementById(divElem).firstChild);
        code(div, x)
        div.onclick = function() {
            let elem = createPrompt()
            elem[0].style.backgroundColor = "white";
            elem[0].style.textAlign = "left";
            oncl(elem[0], x)
        };
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
var announcements = undefined;
document.getElementById("announcementBtn").onclick = function () {
    let annElem = createPrompt();
    let holder = annElem[0];
    let closeBtn = annElem[1];
    let titleTxt = document.createElement("b");
    titleTxt.innerHTML = "Make an<br>Announcement";
    titleTxt.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(titleTxt);
    holder.appendChild(document.createElement("br"));
    let annName = document.createElement("input");
    annName.placeholder = "Name";
    annName.style = "width: 90%";
    holder.appendChild(annName);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let annTo = document.createElement("select");
    annTo.innerHTML = `<option value="" selected disabled hidden>Announcement for</option>`;
    let opts = ["Captains", "Everyone", "Students", "Teachers", "Others"]
    for (let o of opts) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        annTo.appendChild(elem);
    }
    annTo.style = "width: 90%";
    holder.appendChild(annTo);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let annHeading = document.createElement("input");
    annHeading.placeholder = "Heading";
    annHeading.style = "width: 90%";
    holder.appendChild(annHeading);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let annMessage = document.createElement("textarea");
    annMessage.placeholder = "Announcement";
    annMessage.style = "width: 90%; height: 150px; resize: none;";
    holder.appendChild(annMessage);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let uploadBtn = document.createElement("button");
    uploadBtn.innerHTML = "Upload";
    holder.appendChild(uploadBtn);
    uploadBtn.onclick = function() {
        let data = {
            name: annName.value.trim(),
            to: annTo.value.trim(),
            heading: annHeading.value.trim(),
            message: annMessage.value.trim()
        };
        if (data.name != "" && data.to != "" && data.heading != "" && data.message != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let ts = Date.now();
            writeData("announcements/"+ts, data, function() {
                closeBtn.click();
                announcements[ts] = data;
                document.getElementById("Announcements Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    };
};

// Casual Leave
var casualLeaves = undefined;
document.getElementById("casualLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    let titleTxt = document.createElement("b");
    titleTxt.innerHTML = "Casual Leave";
    titleTxt.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(titleTxt);
    holder.appendChild(document.createElement("br"));
    let clName = document.createElement("input");
    clName.placeholder = "Name";
    clName.style = "width: 90%";
    holder.appendChild(clName);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clType = document.createElement("select");
    clType.innerHTML = `<option value="" selected disabled hidden>Leave Type</option>`;
    let opts = ["Casual Leave", "Medical Leave", "Maternity Leave", "Paternity Leave", "Earned Leave", "Extra Ordinary Leave", "Medical Escort Leave", "Bereavement Leave"]
    for (let o of opts) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        clType.appendChild(elem)
    }
    clType.style = "width: 90%";
    holder.appendChild(clType);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clDuration = document.createElement("select");
    clDuration.innerHTML = `<option value="" selected disabled hidden>Duration</option>`;
    let opts2 = ["Half Day", "One Day", "Two Days", "Three Days", "Four Days", "Five Days", "Six Days", "Seven Days", "Eight Days", "Nine Days", "Ten Days"]
    for (let o of opts2) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        clDuration.appendChild(elem)
    }
    clDuration.style = "width: 90%";
    holder.appendChild(clDuration);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let b1 = document.createElement("b");
    b1.style = "width: 90%; text-align: left; display: inline-block;";
    b1.innerHTML = "Start Date"
    holder.appendChild(b1)
    holder.appendChild(document.createElement("br"));
    let clStart = document.createElement("input")
    clStart.type = "date"
    clStart.style = "width: 90%"
    holder.appendChild(clStart);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let b2 = document.createElement("b");
    b2.style = "width: 90%; text-align: left; display: inline-block;";
    b2.innerHTML = "End Date"
    holder.appendChild(b2)
    holder.appendChild(document.createElement("br"));
    let clEnd = document.createElement("input");
    clEnd.type = "date";
    clEnd.style = "width: 90%";
    holder.appendChild(clEnd);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clReason = document.createElement("input");
    clReason.placeholder = "Reason";
    clReason.style = "width: 90%";
    holder.appendChild(clReason);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let uploadBtn = document.createElement("button");
    uploadBtn.innerHTML = "Upload";
    holder.appendChild(uploadBtn);
    uploadBtn.onclick = function() {
        let data = {
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
            let ts = Date.now();
            writeData("casualLeaves/"+ts, data, function() {
                closeBtn.click();
                announcements[ts] = data;
                document.getElementById("Casual Leave Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    };
};

// In Campus Leave
var campusLeave = undefined;
document.getElementById("campusLeaveBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    let titleTxt = document.createElement("b");
    titleTxt.innerHTML = "In Campus Leave";
    titleTxt.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(titleTxt);
    holder.appendChild(document.createElement("br"));
    let clName = document.createElement("input");
    clName.placeholder = "Name";
    clName.style = "width: 90%";
    holder.appendChild(clName);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let b1 = document.createElement("b");
    b1.style = "width: 90%; text-align: left; display: inline-block;";
    b1.innerHTML = "Date and Time"
    holder.appendChild(b1)
    holder.appendChild(document.createElement("br"));
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
    let clPurpose = document.createElement("input");
    clPurpose.style = "width: 90%";
    clPurpose.placeholder = "Purpose"
    holder.appendChild(clPurpose);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let clPeriod = document.createElement("input");
    clPeriod.placeholder = "Period [From - To]";
    clPeriod.style = "width: 90%";
    holder.appendChild(clPeriod);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let uploadBtn = document.createElement("button");
    uploadBtn.innerHTML = "Upload";
    holder.appendChild(uploadBtn);
    uploadBtn.onclick = function() {
        let data = {
            name: clName.value.trim(),
            date: clDate.value,
            time: clTime.value,
            purpose: clPurpose.value.trim(),
            period: clPeriod.value.trim()
        };
        if (data.name != "" && data.date != "" && data.time != "" && data.purpose != "" && data.period != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let ts = Date.now();
            writeData("inCampusLeaves/"+ts, data, function() {
                closeBtn.click();
                announcements[ts] = data;
                document.getElementById("In Campus Leave Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    };
};

// Study Report
var studyReport = undefined;
document.getElementById("studyReportBtn").onclick = function () {
    let csElem = createPrompt();
    let holder = csElem[0];
    let closeBtn = csElem[1];
    let titleTxt = document.createElement("b");
    titleTxt.innerHTML = "Study Report";
    titleTxt.style = "text-align: center; display: block; font-size: 7vw";
    holder.appendChild(titleTxt);
    holder.appendChild(document.createElement("br"));
    let srTeacher = document.createElement("input");
    srTeacher.placeholder = "Teacher (ToD)";
    srTeacher.style = "width: 90%";
    holder.appendChild(srTeacher);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let b1 = document.createElement("b");
    b1.style = "width: 90%; text-align: left; display: inline-block;";
    b1.innerHTML = "Date"
    holder.appendChild(b1)
    holder.appendChild(document.createElement("br"));
    let srDate = document.createElement("input");
    srDate.type = "date";
    srDate.style = "width: 90%;";
    holder.appendChild(srDate);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let srStudy = document.createElement("select");
    srStudy.innerHTML = `<option value="" selected disabled hidden>Study</option>`;
    let opts = ["Morning Study", "Evening Study", "Night Study"]
    for (let o of opts) {
        let elem = document.createElement("option");
        elem.innerHTML = o;
        srStudy.appendChild(elem);
    }
    srStudy.style = "width: 90%";
    holder.appendChild(srStudy);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let srAbsentees = document.createElement("textarea");
    srAbsentees.style = "width: 90%";
    srAbsentees.placeholder = "Absentees [Name,Class,Sec,Bdr/DS,Reason]"
    holder.appendChild(srAbsentees);
    holder.appendChild(document.createElement("br"));
    holder.appendChild(document.createElement("br"));
    let uploadBtn = document.createElement("button");
    uploadBtn.innerHTML = "Upload";
    holder.appendChild(uploadBtn);
    uploadBtn.onclick = function() {
        let data = {
            teacher: srTeacher.value.trim(),
            date: srDate.value,
            study: srStudy.value,
            absentee: srAbsentees.value.trim()
        };
        if (data.teacher != "" && data.date != "" && data.study != "" && data.absentee != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading...";
            let ts = Date.now();
            writeData("studyReports/"+ts, data, function() {
                closeBtn.click();
                announcements[ts] = data;
                document.getElementById("Study Report Btn").click();
            });
        } else {
            alert("Please fill up all the information");
        };
    };
};

// Contacts
var contacts = [
    {
        "title": "Social Coordinator",
        "name": "Lop. Yeshey Loday",
        "contact": "1"
    },
    {
        "title": "Spiritual Coordinator",
        "name": "Lop. Gem Gyelsthen",
        "contact": "2"
    },
    {
        "title": "Vice Principal (Physical Coordinator)",
        "name": "Lop. Namgay Phuntsho",
        "contact": "3"
    },
    {
        "title": "Emotional Coordinator",
        "name": "Lop. Tshering Yangden",
        "contact": "4"
    },
    {
        "title": "Exam Coordinator",
        "name": "Lop. Rinchen Khandu",
        "contact": "5"
    }
];

for (let x of contacts) {
    let div = document.createElement("div");
    div.style = "font-size: 4vw;"
    div.innerHTML = `<b>${x.title}</b><br><a>${x.name}</a>
    <button style='float: right;' onclick='alert("Contacting ${x.contact}")'>Contact</button>`;
    document.getElementById("contactsDiv").appendChild(div);
    document.getElementById("contactsDiv").appendChild(document.createElement("br"));
};