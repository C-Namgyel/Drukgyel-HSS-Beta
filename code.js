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
            console.log("No data available");
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
            console.log("No data available");
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

// Global Variables
var data = undefined;

// Splash Screen
var splash = false;
document.getElementById("splashLogo").onanimationend = function () {
    setTimeout(function () {
        splash = true;
        if (data != undefined) {
            document.getElementById("splashDiv").remove();
        };
    }, 500);
};
getAllDatas(function (res) {
    // Splash
    data = res;
    if (splash == true) {
        document.getElementById("splashDiv").remove();
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
    announcementsLoad();
});

// Setup the navigation drawer;
var navList = [
    { label: "School Profile", logo: "../assets/home.svg" },
    { label: "About School", logo: "../assets/home.svg" },
    { label: "Class Attendance", logo: "../assets/record.svg" },
    { label: "Announcements", logo: "../assets/announcement.svg" },
    { label: "Study Report", logo: "../assets/report.svg" },
    { label: "Staff Photo", logo: "../assets/book.svg" },
    { label: "Contacts", logo: "../assets/contacts.svg" },
    { label: "About", logo: "../assets/about.svg" },
];
for (let d = 0; d < navList.length; d++) {
    let a = document.createElement("a");
    a.style = "text-decoration: none; display: flex; align-items: center;";
    a.value = navList[d].label;
    a.id = navList[d]["label"];
    let img = document.createElement("img");
    img.style = "height: 25px";
    img.src = navList[d].logo;
    a.appendChild(img);
    a.innerHTML += "&nbsp;&nbsp;&nbsp;";
    let b = document.createElement("b");
    b.style = "color: black; font-size: 20px;";
    b.innerHTML = navList[d].label;
    a.appendChild(b);
    document.getElementById("navSubHolder").appendChild(a);
    document.getElementById("navSubHolder").appendChild(document.createElement("br"));
    a.onclick = function () {
        setScreen(a.value);
        if (announcements != undefined && a.value == "Announcements") {
            announcementsLoad();
        };
        document.getElementById("header").innerHTML = a.value;
        if (document.getElementById("navBarrier").hidden == false) {
            navClose();
        };
        window.history.pushState({}, null, window.location.origin + "?page=" + a.value);
    };
};

// Setup startup screen
var urlParams = new URLSearchParams(window.location.search);
var initialValue = urlParams.get('page');
var par = initialValue || undefined; // Use a default value if the parameter is not presents
var availScreens = ["School Profile", "About School", "Class Attendance", "Announcements", "Study Report", "Staff Photo", "Contacts", "About"];
if (par != undefined && availScreens.includes(par)) {
    document.getElementById(par).click();
} else {
    window.history.pushState({}, null, window.location.origin + "?page=" + "School Profile");
};

// Class Attendance
var classes = ["12 A", "12 B", "12 C", "12 D", "12 E", "11 A", "11 B", "11 C", "11 D", "11 E", "10 A", "10 B", "10 C", "10 D", "10 E", "9 A", "9 B", "9 C", "9 D", "9 E", "8 A", "8 B", "8 C", "7 A", "7 B", "7 C"];
document.getElementById("classListHolder").innerHTML = "";
for (let a = 0; a < classes.length; a++) {
    // let a = document.createElement("a")
    let btn = document.createElement("button");
    btn.style = "margin: 2%; width: 45%; border-radius: 15px; background-color: black; color: white; font-weight: bolder; font-size: 7.5vw;";
    btn.id = "attendanceBtn" + a;
    btn.innerHTML = classes[a];
    document.getElementById("classListHolder").appendChild(btn);
}

// Announcements
var announcements = undefined;
var height = 0;
height += window.screen.width * 0.15;
height += window.screen.height * 0.05;
document.getElementById("at").style.height = height;
var at = document.getElementById("at");
function announcementsLoad() {
    announcements = data.announcements;
    if (announcements != undefined) {
        document.getElementById("announcementDiv").innerHTML = "";
        document.getElementById("announcementDiv").appendChild(at)
        for (let x of Object.keys(announcements)) {
            let div = document.createElement("div");
            div.style = "width: 80%; background-color: white; border: 2px solid #ddd; border-radius: 3vw; padding: 5%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";
            let time = new Date(parseInt(x));
            let hours = String(time.getHours()).padStart(2, '0');
            let minutes = String(time.getMinutes()).padStart(2, '0');
            let date = String(time.getDate()).padStart(2, '0');
            let month = String(time.getMonth() + 1).padStart(2, '0');
            let year = String(String(time.getFullYear()).slice(-2)).padStart(2, '0');
            div.innerHTML = `<b style="font-size: 5vw; display: block;">${announcements[x].name}</b>
    <b style="font-size: 4vw;">To: ${announcements[x].to}</b>
    <a style="float: right; font-size: 4vw; color: #555;">${hours}:${minutes} ${date}/${month}/${year}</a>
    <hr style="width: 100%;">
    <b style="display: block; font-size: 5vw; margin-top: 10px;">${announcements[x].heading}</b>`;
            document.getElementById("announcementDiv").insertBefore(div, document.getElementById("announcementDiv").firstChild);
            div.onclick = function() {
                let elem = createPrompt();
                elem[0].innerHTML = `From ${announcements[x].name} at ${hours}:${minutes} ${date}/${month}/${year}<br><br>To ${announcements[x].to}<br><br>Heading:  ${announcements[x].heading}<br><br>${announcements[x].message}`;
                elem[0].style.backgroundColor = "white"
                elem[0].style.textAlign = "left"
            };
        };
    } else {

    };
};
document.getElementById("announcementBtn").onclick = function () {
    let elem = createPrompt()
    let holder = elem[0]
    let closeBtn = elem[1]
    let titleTxt = document.createElement("b");
    titleTxt.innerHTML = "Make<br>Announcement";
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
    annTo.innerHTML = `<option selected disabled hidden>Announcement for</option><option>Everyone</option><option>Students</option><option>Teachers</option>`;
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
        if (data.name != "" && data.to != "Announcement for" && data.heading != "" && data.message != "") {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = "Uploading..."
            let ts = Date.now();
            writeData("announcements/"+ts, data, function() {
                closeBtn.click();
                announcements[ts] = data;
                announcementsLoad();
            });
        } else {
            alert("Please fill up all the information");
        };
    };
};