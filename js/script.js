document.getElementsByTagName('img').ondragstart = function () { return false; };

var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

var windows = [];

windows.push({ name: "w0", pos: false, text: "about", openId: "ow0" });
windows.push({ name: "w1", pos: false, text: "dressup", openId: "ow1" });
windows.push({ name: "w2", pos: false, text: "art", openId: "ow2" });
windows.push({ name: "w3", pos: false, text: "links", openId: "ow3" });
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

//window functionality
function openWindow(x) {

  if (sitemapOpen == true){
    content.style.maxHeight = null;
    console.log("null");
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
        document.getElementById('openwindows').innerHTML += "<li class='open' id='" + windows[o].openId + "' onclick='openWindow(" + openW + ")';'><p>" + windows[o].text + "</p></li>"
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


//gallery
var art = [];
var artNum = 24;

window.addEventListener("load", function artLoad() {
  for (var i = 0; i < artNum; i++) {
    art.push("imgs/art/" + i + ".png");
    document.getElementById('gallery').innerHTML = "<div class='artimg' onclick='artUpdate(" + i + ");'><img class='artimg-img' id='artimg-" + i + "' src='" + art[i] + "'></div>" + document.getElementById('gallery').innerHTML;
  }
  document.getElementById('gallery').innerHTML += "<div class='clear'></div>";
  // document.getElementById('gallery').innerHTML = "<div class='art-text'><p>hello! here's a collection of some of my work.</p><p>more of my work can be found on social media as i continue working on this page.<div class='laptop-links'><p><a href='https://www.instagram.com/maddycha' target='_blank'>&#8618; <img class='icon'src='imgs/icons/instagram.png'> instagram</a></p><p><a href='https://twitter.com/maddycha' target='_blank'><p>&#8618; <img class='icon' src='imgs/icons/twitter.png'> twitter</a></p><p><a href='https://bsky.app/profile/maddycha.com' target='_blank'><p>&#8618; <img class='icon' src='imgs/icons/bluesky.png'> bluesky</a></p></div></p><p></div>" + document.getElementById('gallery').innerHTML;
});

function artUpdate(x) {
  var selected = "artimg-" + x;
  document.getElementById("preview-img").src = art[x];
  for (var i = 0; i < artNum; i++) {
    var notselected = "artimg-" + i;
    document.getElementById(notselected).style.border = "dotted 1px var(--black)";
    document.getElementById(notselected).style.opacity = "0.6";
  }
  document.getElementById(selected).style.border = "solid 1px var(--black)";
  document.getElementById(selected).style.opacity = "1";
}

//dress-up game
var tops = [];
var bottoms = [];
var shoes = [];

var topsBrands = ['hyein seo', 'welldone', 'empath', 'simone rocha', 'vivienne westwood'];
var bottomsBrands = ['aelfric eden', 'diesel', 'sandy liang', 'misbhv'];
var shoesBrands = ['buffalo', 'mschf', 'suicoke'];

function topsUpdate(x) {
  document.getElementById("tops-img").src = tops[x];
  for (var i = 0; i < topsBrands.length + 1; i++) {
    if (i !== x) {
      if (document.getElementById(String(i + "-topsbrand")) !== null) {
        document.getElementById(String(i + "-topsbrand")).style.textTransform = "lowercase";
        document.getElementById(String(i + "-topsbrand")).style.fontStyle = "normal";
      }
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
      if (document.getElementById(String(i + "-bottomsbrand")) !== null) {
        document.getElementById(String(i + "-bottomsbrand")).style.textTransform = "lowercase";
        document.getElementById(String(i + "-bottomsbrand")).style.fontStyle = "normal";
      }
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
      if (document.getElementById(String(i + "-shoesbrand")) !== null) {
        document.getElementById(String(i + "-shoesbrand")).style.textTransform = "lowercase";
        document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "normal";
      }
    } else {
      document.getElementById(String(i + "-shoesbrand")).style.textTransform = "uppercase";
      document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "italic";
    }
  }
}

window.addEventListener("load", function dressup() {

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

  document.getElementById(String(0 + "-topsbrand")).style.textTransform = "uppercase";
  document.getElementById(String(0 + "-topsbrand")).style.fontStyle = "italic";

  document.getElementById(String(0 + "-bottomsbrand")).style.textTransform = "uppercase";
  document.getElementById(String(0 + "-bottomsbrand")).style.fontStyle = "italic";

  document.getElementById(String(0 + "-shoesbrand")).style.textTransform = "uppercase";
  document.getElementById(String(0 + "-shoesbrand")).style.fontStyle = "italic";
});


//date & time
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const d = new Date();
let cMonth = month[d.getMonth()];
let cDay = day[d.getDay()];
let cDate = d.getDate();
let cTime = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
document.getElementById("date").innerHTML = cDay + " " + cMonth + " " + cDate;
document.getElementById("time").innerHTML = cTime;

var sitemapOpen = false;
var content = document.getElementById("sitemap");
//open sitemap from copy ul
function openSitemap() {
      if (sitemapOpen == false){
        content.style.maxHeight = content.scrollHeight + "px";
        console.log("open");
        sitemapOpen = true;
      } else {
        content.style.maxHeight = null;
        console.log("null");
        sitemapOpen = false;
      }
}

//status.cafe
const feedURL = 'https://status.cafe/users/maddy.atom'
fetch(feedURL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const entries = data.querySelectorAll("entry");
    let html = ``;

    for (s = 0; s < 1; s++) {
      let title = entries[s].querySelector("title").innerHTML.slice(0, 5).trim();
      let content = entries[s].querySelector("content").textContent.trim();
      let dateString = entries[s].querySelector("published").innerHTML.slice(5, 10);
      html += `
            <div class="text-section">
              <p><span class="bold">${title}</span> - ${dateString}</p>
              <p>${content}</p></div>
            `;
    }
  })
