document.getElementsByTagName('img').ondragstart = function () { return false; };
var style = window.getComputedStyle(document.body)

var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

var windows = [];

windows.push({ name: "w0", pos: false, text: "about", openId: "ow0" });
windows.push({ name: "w1", pos: false, text: "dressup", openId: "ow1" });
windows.push({ name: "w2", pos: false, text: "art", openId: "ow2" });
windows.push({ name: "w3", pos: false, text: "social", openId: "ow3" });
windows.push({ name: "w4", pos: false, text: "guestbook", openId: "ow4" });
// windows.push({ name: "w5", pos: false, text: "collections", openId: "ow5" });


dragElement(document.getElementById("w0"));
dragElement(document.getElementById("w1"));
dragElement(document.getElementById("w2"));
dragElement(document.getElementById("w3"));
dragElement(document.getElementById("w4"));
// dragElement(document.getElementById("w5"));


//ordering
var windowsZ = ["w0", "w1", "w2", "w3", "w4"];
var itemToFind = "";
let divElement = document.getElementsByClassName("window");
var found = windows.findIndex(el => el == itemToFind)

function orderDiv(x) {
  itemToFind = x.id;
  var foundIdx = windowsZ.findIndex(el => el == itemToFind);
  windowsZ.splice(foundIdx, 1);
  windowsZ.unshift(itemToFind);
}
document.addEventListener('mousedown', function (b) {
  for (var i = 0; i < windowsZ.length; i++) {
    document.getElementById(windowsZ[i]).style.zIndex = 10 - i;
  }
  var activeW = windows[windowsZ[0].slice(1)].openId;
  for (var p = 0; p < windows.length; p++) {
    if (document.getElementById(windows[p].openId) != null) {
      document.getElementById(windows[p].openId).classList.remove("active");
    }
    var checkW = windows[p];
    if (windows[p].name == windowsZ[0]) {
      if (windows[p].pos == true) {
        document.getElementById(activeW).classList.add("active");
      }
    }
  }
  if (windows[3].pos == true) {
    document.getElementById("webrings").style.display = "block";
  } else {
    document.getElementById("webrings").style.display = "none";
  }
});
document.addEventListener('click', function (b) {
  for (var i = 0; i < windowsZ.length; i++) {
    document.getElementById(windowsZ[i]).style.zIndex = 10 - i;
  }
  var activeW = windows[windowsZ[0].slice(1)].openId;
  for (var p = 0; p < windows.length; p++) {
    if (document.getElementById(windows[p].openId) != null) {
      document.getElementById(windows[p].openId).classList.remove("active");
    }
    var checkW = windows[p];
    if (windows[p].name == windowsZ[0]) {
      if (windows[p].pos == true) {
        document.getElementById(activeW).classList.add("active");
      }
    }
  }
  if (windows[3].pos == true) {
    document.getElementById("webrings").style.display = "block";

  } else {
    document.getElementById("webrings").style.display = "none";
  }
});


//tab functionality
function openAboutTab(x) {
  var aboutTabs = ["about-me", "site-info"];
  if (sitemapOpen == true) {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    sitemapOpen = false;
  }
  for (var at = 0; at < aboutTabs.length; at++) {
    document.getElementById("a" + at).classList.remove("a-active-tab");
    document.getElementById("a" + at).style.background = style.getPropertyValue('--bg');
    document.getElementById("a" + at).style.color = style.getPropertyValue('--primary');
    document.getElementById("a" + at).style.borderBottomColor = style.getPropertyValue('--primary');
    document.getElementById("a" + at + "Content").style.display = "none";
  }
  var openT = x.id;
  var openTcontent = x.id + "Content";
  document.getElementById(x.id).classList.add("a-active-tab");
  aActive = document.getElementsByClassName("a-active-tab");
  for (var i = 0; i < aActive.length; i++) {
    if(aActive[i].id == "a0"){
      aActive[i].style.color = style.getPropertyValue('--bg');
    } else{
      aActive[i].style.color = style.getPropertyValue('--primary');
    }
    aActive[i].style.background = style.getPropertyValue('--' + x.id + '');
    aActive[i].style.borderBottomColor = style.getPropertyValue('--' + x.id + '');
    document.getElementById("aboutBrowser").style.background = style.getPropertyValue('--' + x.id + '');
    document.getElementById(aActive[i].id + "Content").style.display = "block";
    document.getElementById("aUrl").innerHTML = "https://maddycha.com/"+aboutTabs[aActive[i].id.slice(1)];
  }
}
function openSocialTab(x) {
  var socialTabs = ["links", "resources", "rhythm-ring", "sites"];
  if (sitemapOpen == true) {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    sitemapOpen = false;
  }
  for (var at = 0; at < socialTabs.length; at++) {
    document.getElementById("s" + at).classList.remove("s-active-tab");
    document.getElementById("s" + at).style.background = style.getPropertyValue('--bg');
    document.getElementById("s" + at).style.color = style.getPropertyValue('--primary');
    document.getElementById("s" + at).style.borderBottomColor = style.getPropertyValue('--primary');
    document.getElementById("s" + at + "Content").style.display = "none";
  }
  var openT = x.id;
  var openTcontent = x.id + "Content";
  document.getElementById(x.id).classList.add("s-active-tab");
  sActive = document.getElementsByClassName("s-active-tab");
  for (var i = 0; i < sActive.length; i++) {
    // if(sActive[i].id == "s"){
    //   sActive[i].style.color = style.getPropertyValue('--bg');
    // } else{
      sActive[i].style.color = style.getPropertyValue('--primary');
    // }
    sActive[i].style.background = style.getPropertyValue('--' + x.id + '');
    sActive[i].style.borderBottomColor = style.getPropertyValue('--' + x.id + '');
    document.getElementById("socialBrowser").style.background = style.getPropertyValue('--' + x.id + '');
    document.getElementById(sActive[i].id + "Content").style.display = "block";
    document.getElementById("sUrl").innerHTML = "https://maddycha.com/"+socialTabs[sActive[i].id.slice(1)];
  }
}

//window functionality

function openMobileWindow(x){
  var openW = x.id;
  if(openW == "w0"){
    document.getElementById("w0").style.display = "block";
    document.getElementById("w3").style.display = "none";
    windows[3].pos = false;

    document.getElementById("social-mobile").classList.remove("mobile-active");
    document.getElementById("social-mobile").classList.add("mobile-inactive");
    document.getElementById("about-mobile").classList.remove("mobile-inactive");
    document.getElementById("about-mobile").classList.add("mobile-active");

    // document.getElementById("about-mobile").style.textDecoration = "underline";
    document.getElementById("social-mobile").style.textDecoration = "none";
  }
  if(openW == "w3"){
    document.getElementById("w0").style.display = "none";
    document.getElementById("w3").style.display = "block";

    document.getElementById("about-mobile").classList.remove("mobile-active");
    document.getElementById("about-mobile").classList.add("mobile-inactive");
    document.getElementById("social-mobile").classList.remove("mobile-inactive");
    document.getElementById("social-mobile").classList.add("mobile-active");

    windows[3].pos = true;
    document.getElementById("about-mobile").style.textDecoration = "none";
    // document.getElementById("social-mobile").style.textDecoration = "underline";

  }
}

function openWindow(x) {

  if (sitemapOpen == true) {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    sitemapOpen = false;
  }

  var openW = x.id;
  var bottomLimit = 2 + window.innerHeight - document.getElementById(openW).offsetHeight - document.getElementById("macnav").offsetHeight;
  var rightLimit = 0 + window.innerWidth - document.getElementById(openW).offsetWidth;
  var num = openW.slice(1);
  var openPos = windows[num].pos;

  for (var o = 0; o < windows.length; o++) {
    if (o != num) {
    } else {
      if (windows[o].pos == false) {
        document.getElementById(openW).style.left = getRandom(0, rightLimit) + 'px'; // 👈🏼 Horizontally
        document.getElementById(openW).style.top = getRandom(0, bottomLimit) + 'px'; // 👈🏼 Vertically
        document.getElementById('openwindows').innerHTML += "<li class='open' id='" + windows[o].openId + "' onclick='openWindow(" + openW + ")';'><img src='imgs/icons/" + windows[o].text + ".png'>" + windows[o].text + "</li>"
        windows[o].pos = true;
      }
    }
  }
  document.getElementById(openW).style.transform = "scale(1)";
  itemToFind = openW;
  var foundIdx = windowsZ.findIndex(el => el == itemToFind);
  windowsZ.splice(foundIdx, 1);
  windowsZ.unshift(itemToFind);
}
function closeWindow(x) {
  var closeW = x.id;
  var num = closeW.slice(1);
  document.getElementById(closeW).style.transform = "scale(0)";
  windows[num].pos = false;
  var cwId = windows[num].openId;
  document.getElementById(cwId).remove();

  for (var i = 0; i < windowsZ.length; i++) {
    document.getElementById(windowsZ[i]).style.zIndex = 10 - i;
  }
  var activeW = windows[windowsZ[0].slice(1)].openId;
  for (var p = 0; p < windows.length; p++) {
    if (document.getElementById(windows[p].openId) != null) {
      document.getElementById(windows[p].openId).classList.remove("active");
    }
    var checkW = windows[p];
    if (windows[p].name == windowsZ[0]) {
      if (windows[p].pos == true) {
        document.getElementById(activeW).classList.add("active");
      }
    }
  }
  itemToFind = closeW;
  var foundIdx = windowsZ.findIndex(el => el == itemToFind);
  windowsZ.splice(foundIdx, 1);
  windowsZ.push(itemToFind);
}

//drag functions
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


var sitemapOpen = false;
var content = document.getElementById("sitemap");
//open sitemap from copy ul

function sitemapBottomDelay() {
  content.style.bottom = "39px";
}
function openSitemap() {
  if (sitemapOpen == false) {
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.bottom = "40px";
    sitemapOpen = true;
  } else {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    // content.style.bottom = "39px";
    sitemapOpen = false;
  }
}


// click effect

// include this line when the page loads
document.querySelector("body").addEventListener("click", explodeOnClick);

/**
 * Creates a container at the point of the page where the user clicked.  Populates that container with little "+" signs, sets an interval timer which regularly calculates the point on a curve give the time passed (x), updates the position of each '+' sign to be at the calculated position (given the time that's passed).
 * e {Event} - object representing the 'click' of the page
 **/
function explodeOnClick(e) {
  let toPopulate = document.createElement("div");
  toPopulate.classList.add("explode");

  toPopulate.style.top = e.clientY + "px";
  toPopulate.style.left = e.clientX + "px";

  document.querySelector("body").appendChild(toPopulate);

  setTimeout(() => toPopulate.remove(), 1200);

  // populate 1 star for testing
  for (let i = 0; i < 2; i++) {
    setTimeout(() => {
      let newStar = document.createElement("p");
      let j = 0;
      let xDirection = Math.random() < 0.5 ? -1 : 1; // left or right
      let xDistance = Math.random() * 100; // Random distance between 0 to 100px for where to fall
      newStar.textContent = "+";
      toPopulate.appendChild(newStar);

      let timerId = setInterval(() => {
        // Calculate new y position based on the parabolic equation
        let yTrans = -(-(1 / 40) * (j - 20) ** 2 + 10) + "px";
        let xTrans = xDirection * (xDistance * (j / 100)) + "px";
        newStar.style.transform = `translateX(${xTrans}) translateY(${yTrans})`;

        j += 1;
      }, 25);

      setTimeout(() => {
        clearInterval(timerId);
        newStar.remove();
      }, 5000);
    }, Math.floor(i / 3) * 50);
  }
}
