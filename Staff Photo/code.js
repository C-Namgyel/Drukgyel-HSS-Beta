//Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getDatabase, ref as dbRef, get, child, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
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
const storage = getStorage(app);
get(child(dbRef(database), `users/`)).then((snapshot) => {
    document.getElementById("holder").innerHTML = ""
    let val = snapshot.val();
    let recs = []
    console.log(val != null)
    if (val != null) {
        recs = (Object.values(val))
    }
    console.log(recs)
    for (let r = 0; r < recs.length; r++) {
        let div = document.createElement("div");
        div.style.textAlign = "center";
        div.style.borderStyle = "solid"
        let button = document.createElement("button")
        let img = document.createElement("img");
        img.style.width = "50%"
        img.id = "img" + r
        img.hidden = true;
        img.onclick = function() {
            window.open(this.src, "_blank")
        }
        let label = document.createElement("label");
        label.innerHTML = recs[r].name;
        button.innerHTML = "Load<br>Image"
        button.value = JSON.stringify({
            id: r,
            url: recs[r].pic
        })
        button.onclick = function() {
            let btnThis = this;
            document.getElementById("img"+JSON.parse(this.value).id).src = JSON.parse(this.value).url;
            this.disabled = true;
            this.innerHTML = "Loading<br>Image"
            document.getElementById("img"+JSON.parse(this.value).id).onload = function() {
                this.hidden = false;
                btnThis.hidden = true;
            }
        }
        div.appendChild(button)
        div.appendChild(img)
        div.appendChild(document.createElement("br"))
        div.appendChild(label)
        document.getElementById("holder").appendChild(div)
    }
    document.getElementById("uploadBtn").hidden = false
    document.getElementById("homeScrn").scrollTop = document.getElementById("homeScrn").scrollHeight;
})
document.getElementById("uploadBtn").onclick = function() {
    let profilePic;
  let div = document.createElement("div");
  div.style.position = "fixed"
  div.style.zIndex = 2
  div.style.width = "100%"
  div.style.height = "100%"
  div.style.left = "0%"
  div.style.top = "0%"
  div.style.backgroundColor = "rgba(0,0,0,0.5)"
  document.body.appendChild(div)
  let holder = document.createElement("div")
  holder.style.padding = "5%"
  holder.style.position = "absolute"
  holder.style.zIndex = 2
  holder.style.width = "75%"
  holder.style.height = "75%"
  holder.style.left = "50%"
  holder.style.top = "50%"
  holder.style.transform = "translateX(-50%) translateY(-50%)"
  holder.style.borderRadius = "25px"
  holder.style.backgroundColor = "#0989EC"
  holder.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)";
  holder.style.textAlign = "center"
  div.appendChild(holder)
  let close = document.createElement("button")
  close.style.backgroundColor = "red"
  close.innerHTML = "X"
  close.style.float = "right"
  holder.appendChild(close)
  close.onclick = function() {
    div.remove()
  }
  let img = document.createElement("div")
  img.style.width = "100px"
  img.style.height = "100px"
  img.style.backgroundSize = "cover"
  img.style.backgroundPosition = "center"
  img.style.backgroundRepeat = "no-repeat"
  img.style.overflow = "hidden"
  img.style.borderRadius = "100%"
  img.style.backgroundImage = "url('../assets/logo.png')"
  img.style.position = "relative"
  img.style.left = "50%";
  img.style.transform = "translateX(-50%)"
  holder.appendChild(img)
  holder.appendChild(document.createElement("br"))
  let btn = document.createElement("button")
  btn.innerHTML = "Upload Profile Picture"
  let inp = document.createElement("input")
  inp.type = "file"
  inp.style.display = "none"
  inp.accept = "image/*"
  inp.oninput = function() {
      if (((inp.files[0].size/1024)/1024) > 1) {
        let compressor = (100/((inp.files[0].size/1024)/1024))/100
        compressImage(inp.files[0], compressor, function(e) {
            profilePic = e;
            img.style.backgroundImage = "url('"+URL.createObjectURL(profilePic)+"')"
        })
      } else {
        profilePic = this.files[0]
        img.style.backgroundImage = "url('"+URL.createObjectURL(profilePic)+"')"
      }
  }
  btn.onclick = function() {inp.click()}
  btn.appendChild(inp)
  holder.appendChild(btn)
  holder.appendChild(document.createElement("br"))
  holder.appendChild(document.createElement("br"))
  let name = document.createElement("input")
  name.placeholder = "Enter your name"
  holder.appendChild(name)
  holder.appendChild(document.createElement("br"))
  holder.appendChild(document.createElement("br"))
  let uploadBtn = document.createElement("button")
  uploadBtn.innerHTML = "Upload"
  holder.appendChild(uploadBtn)
  uploadBtn.onclick = function() {
    if (name.value.trim() != "") {
      if (inp.files[0] != undefined) {
        //Uploading
        let storageRef = ref(storage, name.value.trim() + "/" + profilePic.name);
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = ("Profile picture upload started")
        close.disabled = true
        let task = uploadBytesResumable(storageRef, profilePic);
        task.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / 1024 / 1024).toFixed(2) + "mb / " + (snapshot.totalBytes / 1024 / 1024).toFixed(2) + "mb";
            uploadBtn.innerHTML = ("Profile picture uploading<br>"+progress)
        }, 
        (error) => {
                // Handle unsuccessful uploads
        }, () => {
            uploadBtn.innerHTML = ("Profile Picture Uploaded<br>Adding Profile")
            getDownloadURL(storageRef).then((Url) => {
                uploadBtn.innerHTML = ("Adding Profile")
                set(dbRef(database, "users/" + name.value.trim()), {
                    name: name.value.trim(),
                    pic : Url
                }).then(() => {
                    window.location.reload()
                });
            })
        });
      } else {
        alert("Please upload your picture")
      }
    } else {
      alert("Please enter your name")
    }
}
}