var tops = [];
var bottoms = [];
var shoes = [];



var topsBrands = ['hyein seo', 'welldone', 'empath', 'simone rocha', 'vivienne westwood'];
var bottomsBrands = ['aelfric eden', 'diesel', 'sandy liang', 'misbhv'];
var shoesBrands = ['buffalo', 'mschf', 'suicoke'];


var aboutPos = "false";
var gamePos = "false";
var resumePos = "false";



const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const d = new Date();
let cMonth = month[d.getMonth()];
let cDay = day[d.getDay()];
let cDate = d.getDate();
let cTime = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });


document.getElementById("date").innerHTML = cDay + " " + cMonth + " " + cDate;
document.getElementById("time").innerHTML = cTime;

var windows = [];
var itemToFind = "";

let divElement = document.getElementsByClassName("window");

var found = windows.findIndex(el => el == itemToFind)

var windows = ["about", "game", "resume"];


var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Make the DIV element draggable:
dragElement(document.getElementById("game"));
dragElement(document.getElementById("about"));
dragElement(document.getElementById("resume"));


function orderDiv(x) {
  itemToFind = x.id;
  var foundIdx = windows.findIndex(el => el == itemToFind);
  windows.splice(foundIdx, 1);
  windows.unshift(itemToFind);
}


document.addEventListener('mousedown', function (b) {
  for (var i = 0; i < windows.length; i++) {
    document.getElementById(windows[i]).style.zIndex = 10 - i;
  }
});


document.addEventListener('click', function (b) {
  for (var i = 0; i < windows.length; i++) {
    document.getElementById(windows[i]).style.zIndex = 10 - i;
  }
});


function about() {

  var bottomLimit = 2 + window.innerHeight - document.getElementById("about").offsetHeight - document.getElementById("macnav").offsetHeight;
  var rightLimit = 1 + window.innerWidth - document.getElementById("about").offsetWidth;

  if (aboutPos == "false") {
    document.getElementById("about").style.left = getRandom(0, rightLimit) + 'px'; // 👈🏼 Horizontally
    document.getElementById("about").style.top = getRandom(0, bottomLimit) + 'px'; // 👈🏼 Vertically
  }

  aboutPos = "true";
  document.getElementById("about").style.transform = "scale(1)";
  itemToFind = "about";
  var foundIdx = windows.findIndex(el => el == itemToFind);
  windows.splice(foundIdx, 1);
  windows.unshift(itemToFind);
}

function resume() {

  var bottomLimit = 2 + window.innerHeight - document.getElementById("resume").offsetHeight - document.getElementById("macnav").offsetHeight;
  var rightLimit = 1 + window.innerWidth - document.getElementById("resume").offsetWidth;

  if (resumePos == "false") {
    document.getElementById("resume").style.left = getRandom(0, rightLimit) + 'px'; // 👈🏼 Horizontally
    document.getElementById("resume").style.top = getRandom(0, bottomLimit) + 'px'; // 👈🏼 Vertically
  }

  resumePos = "true";
  document.getElementById("resume").style.transform = "scale(1)";
  itemToFind = "resume";
  var foundIdx = windows.findIndex(el => el == itemToFind);
  windows.splice(foundIdx, 1);
  windows.unshift(itemToFind);
}

function game() {

  var bottomLimit = 2 + window.innerHeight - document.getElementById("game").offsetHeight - document.getElementById("macnav").offsetHeight;
  var rightLimit = 1 + window.innerWidth - document.getElementById("game").offsetWidth;

  if (gamePos == "false") {
    document.getElementById("game").style.left = getRandom(0, rightLimit) + 'px'; // 👈🏼 Horizontally
    document.getElementById("game").style.top = getRandom(0, bottomLimit) + 'px'; // 👈🏼 Vertically
  }

  gamePos = "true";
  document.getElementById("game").style.transform = "scale(1)";
  itemToFind = "game";
  var foundIdx = windows.findIndex(el => el == itemToFind);
  windows.splice(foundIdx, 1);
  windows.unshift(itemToFind);
}




for (var i = 1; i < topsBrands.length + 1; i++) {
  var b = i - 1;
  tops.push("imgs/items/t" + i + ".png");
  document.getElementById('tops').innerHTML += "<div class='item' onclick='topsUpdate(" + b + ");'><h4 class='number'>0" + i + "</h4><h5 class='brand' id='" + b + "-topsbrand'>" + topsBrands[i - 1] + "</h5>";
}

for (var i = 1; i < bottomsBrands.length + 1; i++) {
  var b = i - 1;
  bottoms.push("imgs/items/b" + i + ".png");
  document.getElementById('bottoms').innerHTML += "<div class='item' onclick='bottomsUpdate(" + b + ");'><h4 class='number'>0" + i + "<h5 class='brand' id='" + b + "-bottomsbrand'>" + bottomsBrands[i - 1] + "</h5>";
}

for (var i = 1; i < shoesBrands.length + 1; i++) {
  var b = i - 1;
  shoes.push("imgs/items/s" + i + ".png");
  document.getElementById('shoes').innerHTML += "<div class='item' onclick='shoesUpdate(" + b + ");'><h4 class='number'>0" + i + "</h4><h5 class='brand' id='" + b + "-shoesbrand'>" + shoesBrands[i - 1] + "</h5>";
}

document.getElementsByTagName('img').ondragstart = function () { return false; };


function topsUpdate(x) {
  document.getElementById("tops-img").src = tops[x];
  for (var i = 0; i < topsBrands.length + 1; i++) {
    if (i !== x) {
      document.getElementById(String(i + "-topsbrand")).style.textTransform = "lowercase";
      document.getElementById(String(i + "-topsbrand")).style.fontStyle = "normal";

    } else {
      document.getElementById(String(i + "-topsbrand")).style.textTransform = "uppercase";
      document.getElementById(String(i + "-topsbrand")).style.fontStyle = "italic";

    }
  }
}

function bottomsUpdate(x) {
  document.getElementById("bottoms-img").src = bottoms[x];
  for (var i = 0; i < bottomsBrands.length + 1; i++) {
    if (i !== x) {
      document.getElementById(String(i + "-bottomsbrand")).style.textTransform = "lowercase";
      document.getElementById(String(i + "-bottomsbrand")).style.fontStyle = "normal";


    } else {
      document.getElementById(String(i + "-bottomsbrand")).style.textTransform = "uppercase";
      document.getElementById(String(i + "-bottomsbrand")).style.fontStyle = "italic";

    }
  }

}

function shoesUpdate(x) {
  document.getElementById("shoes-img").src = shoes[x];
  for (var i = 0; i < shoesBrands.length + 1; i++) {
    if (i !== x) {
      document.getElementById(String(i + "-shoesbrand")).style.textTransform = "lowercase";
      document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "normal";


    } else {
      document.getElementById(String(i + "-shoesbrand")).style.textTransform = "uppercase";
      document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "italic";

    }
  }
}


function delay(URL) {
  setTimeout(function () { window.location = URL }, 500);
}




function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "nav")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "nav").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    bottomLimit = window.innerHeight - elmnt.offsetHeight - document.getElementById("macnav").offsetHeight + 2;
    rightLimit = 1 + window.innerWidth - elmnt.offsetWidth;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    if (elmnt.offsetTop - pos2 <= -1) {
      elmnt.style.top = -1 + "px";
    }

    if (elmnt.offsetLeft - pos2 <= -1) {
      elmnt.style.left = -1 + "px";
    }

    if (elmnt.offsetTop - pos2 >= bottomLimit) {
      elmnt.style.top = bottomLimit + "px";
    }


    if (elmnt.offsetLeft - pos2 >= rightLimit) {
      elmnt.style.left = rightLimit + "px";
    }
  }
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}

function gameClose() {
  document.getElementById("game").style.transform = "scale(0)";
}

function aboutClose() {
  document.getElementById("about").style.transform = "scale(0)";
}

function resumeClose() {
  document.getElementById("resume").style.transform = "scale(0)";
}


document.getElementById(String(0 + "-topsbrand")).style.textTransform = "uppercase";
document.getElementById(String(0 + "-topsbrand")).style.fontStyle = "italic";

document.getElementById(String(0 + "-bottomsbrand")).style.textTransform = "uppercase";
document.getElementById(String(0 + "-bottomsbrand")).style.fontStyle = "italic";

document.getElementById(String(0 + "-shoesbrand")).style.textTransform = "uppercase";
document.getElementById(String(0 + "-shoesbrand")).style.fontStyle = "italic";
