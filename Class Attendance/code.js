//Firebase;
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getDatabase, ref as ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

//Function
function filterObjectBy(obj, predicate) {
    const filteredObject = {};
    Object.keys(obj).forEach((key) => {
      if (predicate(obj[key])) {
        filteredObject[key] = obj[key];
      };
  });
    return filteredObject;
  };
  
//App;
var classes = ["12 A", "12 B", "12 C", "12 D", "12 E", "11 A", "11 B", "11 C", "11 D", "11 E", "10 A", "10 B", "10 C", "10 D", "10 E", "9 A", "9 B", "9 C", "9 D", "9 E", "8 A", "8 B", "8 C", "7 A", "7 B", "7 C"];
var students;
//Get student lists;
document.getElementById("classListHolder").innerHTML = "";
for (let a = 0; a < classes.length; a++) {
  let btn = document.createElement("button");
  btn.style = "margin: 2%; width: 45%; border-radius: 15px; background-color: black; color: white; font-weight: bolder; font-size: 30px;";
  btn.id = "attendanceBtn" + a;
  btn.innerHTML = classes[a];
  document.getElementById("classListHolder").appendChild(btn);
  btn.onclick = function(btnClick) {
    let autoClose = false;
    let classOfForm = btnClick.target.innerHTML
    let barrier = document.createElement("div")
    barrier.style = "position: fixed; width: 100%; height: 100%; left: 0%; top: 0%;";
    barrier.id = "barrier"
    barrier.style.opacity = 0.5
    barrier.style.backgroundColor = "black"
    barrier.style.zIndex = 1;
    document.body.appendChild(barrier)
      let div = document.createElement("div");
      div.id = "attendanceForm";
      div.style = "position: fixed; width: 80%; height: 85%; left: 5%; top: 5%; border-radius: 15px; overflow: auto; overflow-wrap: break-word; scroll-behavior: smooth; background-color: #0989EC; border-width: 2px; border-color: black; border-style: solid; z-index: 1; padding-left: 5%; padding-right: 5%; padding-top: 5%;";
      document.body.appendChild(div);
      let closeBtn = document.createElement("button")
      closeBtn.innerHTML = "X"
      closeBtn.onclick = function() {
        if (autoClose == false) {
          if (confirm('The form is not submitted yet. Are you sure you want to close it? This cannot be undone') == true) {document.getElementById('attendanceForm').remove(); document.getElementById('barrier').remove();}
        } else {
          document.getElementById('attendanceForm').remove(); document.getElementById('barrier').remove();
        }
      }
      closeBtn.style = "position: absolute; top: 5%; right: 5%; background-color: red;"
      div.innerHTML = "Loading...";
      div.appendChild(closeBtn)
      get(child(ref(database), "formData/")).then((fd) => {
        let formData = fd.val()
        let periods = formData.periods.split(",")
        let subjects = formData.subjects.split(",").sort()
        get(child(ref(database), "students/" + this.innerHTML.replace(" ", ""))).then((snapshot) => {
            div.innerHTML = "";
            let vals = Object.values(snapshot.val());
            let females = filterObjectBy(vals, (obj) => obj["g"] == "F");
            females = Object.values(females).map((obj) => obj.n);
            females.sort();
            let males = filterObjectBy(vals, (obj) => obj["g"] == "M");
            males = Object.values(males).map((obj) => obj.n);
            males.sort();
            let data = [ ...females, ...males ];
            students = data;

            //Create the form;
            div.innerHTML = `<h1 style="text-align: center;">${btnClick.target.innerHTML.replace(" ", "")}</h1><br>Period<br><select id="period"></select><br><br>Subject<br><select id="subject"></select><br><br>Lesson Detail<br><input type="text" id="lesson"><br><br>Subject Teacher (Initial)<input type="text" id="initial"><br><br><div id="divElem" style="width: 100%; overflow: auto; overflow-wrap: break-word; scroll-behavior: smooth; background-color: white; border-radius: 4px;"><table id="formTable" border style="border-collapse: collapse; border-color: black; white-space: nowrap;"><tr><th>Name</th><th>Present</th><th>Leave</th><th>Absent</th><th>On Duty</th></tr></table></div><br><br><button id="submit">Submit</button><br><br><br>`;
            div.appendChild(closeBtn)
            document.getElementById("period").innerHTML = '<option disabled selected value="">Period</option>'
            for (let p of periods) {
              let opt = document.createElement("option");
              opt.innerHTML = p;
              document.getElementById("period").appendChild(opt);
            };
            document.getElementById("subject").innerHTML = '<option disabled selected value="">Subject</option>'
            for (let p of subjects) {
              let opt = document.createElement("option");
              opt.innerHTML = p;
              document.getElementById("subject").appendChild(opt);
            };
            ////Student lists;
            for (let s in students) {
              let r = document.createElement("tr");
              let name = document.createElement("td");
              name.innerHTML = students[s];
              r.appendChild(name)
              let opts = ["Present", "Leave", "Absent", "On Duty"];
              for (let o of opts) {
                let op = document.createElement("td")
                let rad = document.createElement("input");
                rad.type = "radio";
                rad.name = students[s];
                rad.value = o;
                if (o == "Present") {
                  rad.checked = true;
                };
                op.appendChild(rad)
                r.appendChild(op)
              };
              document.getElementById("formTable").appendChild(r)
            };
            document.getElementById("divElem").scrollLeft = document.getElementById("divElem").scrollWidth
            document.getElementById("submit").onclick = function() {
              let elements = ["period", "subject", "lesson", "initial"]
              let req = false;
              let obj = {};
              for (let c = 0; c < elements.length; c++) {
                console.log(document.getElementById(elements[c]).value)
                if (document.getElementById(elements[c]).value == "") {
                  req == true
                  c = elements.length
                  alert("Please fill up everything")
                } else {
                  obj[elements[c]] = document.getElementById(elements[c]).value
                }
              }
              if (req == false) {
                document.getElementById("submit").disabled = true;
                document.getElementById("submit").innerHTML = "Submitting..."
                for (let st of students) {
                  obj[st] = Array.from(document.getElementsByName(st)).find(radio => radio.checked).value
                }
                let timestamp = new Date().getTime();
                set(ref(database, "attendance/" + classOfForm + "/" + timestamp), obj).then(() => {
                  autoClose = true;
                  closeBtn.click()
                  alert("Successfully Submitted")
                });
              }
            }
          });
      });
    };
};