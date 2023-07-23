//Start
if ("Drukgyel-HSS" in sessionStorage == false) {
    let div = document.createElement("div")
    div.style = "position: fixed; width: 100%; height: 100%; left: 0%; top: 0%; background-color: #0989EC; z-index: 100;"
    document.body.appendChild(div)
    let img = document.createElement("div")
    div.appendChild(img)
    img.style = "width: 75%; height: 75%; position: absolute; left: 12.5%; top: 12.5%; background-image: url(\'../assets/logo.png\'); background-position: center; background-repeat: no-repeat; background-size: contain; animation-name: splash; animation-duration: 0.75s; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(0, 0.75, 1);"
    img.onanimationend = function() {
        setTimeout(function() {
            div.remove()
        }, 1000)
    }
    sessionStorage["Drukgyel-HSS"] = true
}
//Setup
var navList = [
    {label: "School Profile", logo: "../assets/home.svg"},
    {label: "About School", logo: "../assets/home.svg"},
    {label: "Class Attendance", logo: "../assets/record.svg"},
    {label: "Staff Photo", logo: "../assets/book.svg"},
    {label: "About", logo: "../assets/about.svg"},
]
for (let d = 0; d < navList.length; d++) {
    let a = document.createElement("a")
    a.target = "_self"
    a.style="text-decoration: none; display: flex; align-items: center;"
    if (location.href.split("/")[location.href.split("/").length - 2] != navList[d].label.replaceAll(" ", "+") && location.href.split("/")[location.href.split("/").length - 2] != navList[d].label.replaceAll(" ", "%20")) {
        a.href = "../"+navList[d].label
    } else {
        a.href = "#"
        a.onclick = function() {
            navClose()
        }
    }
    let img = document.createElement("img")
    img.style = "height: 25px"
    img.src = navList[d].logo
    a.appendChild(img)
    a.innerHTML += "&nbsp;&nbsp;&nbsp;"
    let b = document.createElement("b")
    b.style = "color: black; font-size: 20px;"
    b.innerHTML = navList[d].label
    a.appendChild(b)
    document.getElementById("navSubHolder").appendChild(a)
    document.getElementById("navSubHolder").appendChild(document.createElement("br"))
}
