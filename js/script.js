document.getElementsByTagName('img').ondragstart = function () { return false; };
var style = window.getComputedStyle(document.body);
var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// ===== WINDOW CONFIGURATION =====
// To add a window: add an entry here, add HTML with matching id, add a desktop icon
var WINDOW_LIST = [
  { id: "w0", name: "about" },
  { id: "w1", name: "dressup" },
  { id: "w2", name: "art" },
  { id: "w3", name: "social" },
  { id: "w4", name: "guestbook" },
];

// To add a tab: add an entry to the slugs array, add a CSS variable --{prefix}{index},
// and add HTML tab header + content div with id {prefix}{index}Content
var TAB_GROUPS = {
  about: {
    prefix: "a",
    activeClass: "a-active-tab",
    browserId: "aboutBrowser",
    urlId: "aUrl",
    slugs: ["about-me", "site-info"],
    invertFirstTab: true,
  },
  social: {
    prefix: "s",
    activeClass: "s-active-tab",
    browserId: "socialBrowser",
    urlId: "sUrl",
    slugs: ["links", "resources", "rhythm-ring"],
    invertFirstTab: false,
  },
};

// ===== INTERNAL STATE =====
var windowOpen = {};
var windowOpenIds = {};
WINDOW_LIST.forEach(function (w) {
  windowOpen[w.id] = false;
  windowOpenIds[w.id] = "o" + w.id;
});
var windowsZ = WINDOW_LIST.map(function (w) { return w.id; });

WINDOW_LIST.forEach(function (w) {
  dragElement(document.getElementById(w.id));
});

// ===== Z-ORDER =====
function orderDiv(x) {
  var idx = windowsZ.indexOf(x.id);
  if (idx > -1) {
    windowsZ.splice(idx, 1);
    windowsZ.unshift(x.id);
  }
}

function updateZOrder() {
  for (var i = 0; i < windowsZ.length; i++) {
    document.getElementById(windowsZ[i]).style.zIndex = 10 - i;
  }
  WINDOW_LIST.forEach(function (w) {
    var el = document.getElementById(windowOpenIds[w.id]);
    if (el) el.classList.remove("active");
  });
  var topId = windowsZ[0];
  if (windowOpen[topId]) {
    var el = document.getElementById(windowOpenIds[topId]);
    if (el) el.classList.add("active");
  }
  var webrings = document.getElementById("webrings");
  if (webrings) {
    webrings.style.display = windowOpen["w3"] ? "block" : "none";
  }
}

document.addEventListener('mousedown', updateZOrder);
document.addEventListener('click', updateZOrder);

// ===== TAB SWITCHING =====
function openTab(groupName, tabElement) {
  var group = TAB_GROUPS[groupName];
  if (!group) return;

  if (sitemapOpen) {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    sitemapOpen = false;
  }

  for (var i = 0; i < group.slugs.length; i++) {
    var tabId = group.prefix + i;
    var tab = document.getElementById(tabId);
    tab.classList.remove(group.activeClass);
    tab.style.background = style.getPropertyValue('--bg');
    tab.style.color = style.getPropertyValue('--primary');
    tab.style.borderBottomColor = style.getPropertyValue('--primary');
    document.getElementById(tabId + "Content").style.display = "none";
  }

  var activeId = tabElement.id;
  var tabIndex = parseInt(activeId.slice(1));
  var colorVar = '--' + activeId;

  tabElement.classList.add(group.activeClass);
  tabElement.style.background = style.getPropertyValue(colorVar);
  tabElement.style.borderBottomColor = style.getPropertyValue(colorVar);
  tabElement.style.color = (group.invertFirstTab && tabIndex === 0)
    ? style.getPropertyValue('--bg')
    : style.getPropertyValue('--primary');

  document.getElementById(group.browserId).style.background = style.getPropertyValue(colorVar);
  document.getElementById(activeId + "Content").style.display = "block";
  document.getElementById(group.urlId).innerHTML = "https://maddycha.com/" + group.slugs[tabIndex];
}

function openAboutTab(x) { openTab("about", x); }
function openSocialTab(x) { openTab("social", x); }

// ===== MOBILE NAVIGATION =====
function openMobileWindow(x) {
  var isAbout = x.id === "w0";
  document.getElementById("w0").style.display = isAbout ? "block" : "none";
  document.getElementById("w3").style.display = isAbout ? "none" : "block";
  windowOpen["w3"] = !isAbout;
  document.getElementById("about-mobile").className = isAbout ? "mobile-active" : "mobile-inactive";
  document.getElementById("social-mobile").className = isAbout ? "mobile-inactive" : "mobile-active";
}

// ===== WINDOW OPEN/CLOSE =====
function openWindow(x) {
  if (sitemapOpen) {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
    sitemapOpen = false;
  }

  var id = x.id;
  var num = parseInt(id.slice(1));
  var win = WINDOW_LIST[num];

  if (!windowOpen[id]) {
    var el = document.getElementById(id);
    var bottomLimit = 2 + window.innerHeight - el.offsetHeight - document.getElementById("macnav").offsetHeight;
    var rightLimit = window.innerWidth - el.offsetWidth;
    el.style.left = getRandom(0, rightLimit) + 'px';
    el.style.top = getRandom(0, bottomLimit) + 'px';
    document.getElementById('openwindows').innerHTML +=
      "<li class='open' id='" + windowOpenIds[id] + "' onclick='openWindow(" + id + ")'>" +
      "<img src='imgs/icons/" + win.name + ".png'>" + win.name + "</li>";
    windowOpen[id] = true;
  }

  document.getElementById(id).style.transform = "scale(1)";
  orderDiv(x);
}

function closeWindow(x) {
  var id = x.id;
  document.getElementById(id).style.transform = "scale(0)";
  windowOpen[id] = false;
  var openEl = document.getElementById(windowOpenIds[id]);
  if (openEl) openEl.remove();
  var idx = windowsZ.indexOf(id);
  if (idx > -1) {
    windowsZ.splice(idx, 1);
    windowsZ.push(id);
  }
  updateZOrder();
}

// ===== DRAG =====
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var handle = document.getElementById(elmnt.id + "nav") || elmnt;
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    var bottomLimit = window.innerHeight - elmnt.offsetHeight - document.getElementById("macnav").offsetHeight + 2;
    var rightLimit = 1 + window.innerWidth - elmnt.offsetWidth;
    elmnt.style.top = Math.max(-1, Math.min(elmnt.offsetTop - pos2, bottomLimit)) + "px";
    elmnt.style.left = Math.max(-1, Math.min(elmnt.offsetLeft - pos1, rightLimit)) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// ===== SITEMAP =====
var sitemapOpen = false;
var content = document.getElementById("sitemap");

function sitemapBottomDelay() {
  content.style.bottom = "39px";
}

function openSitemap() {
  if (!sitemapOpen) {
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.bottom = "40px";
  } else {
    content.style.maxHeight = null;
    setTimeout(sitemapBottomDelay, 200);
  }
  sitemapOpen = !sitemapOpen;
}

// ===== CLICK EFFECT =====
document.querySelector("body").addEventListener("click", function (e) {
  var container = document.createElement("div");
  container.classList.add("explode");
  container.style.top = e.clientY + "px";
  container.style.left = e.clientX + "px";
  document.body.appendChild(container);
  setTimeout(function () { container.remove(); }, 1200);

  for (var i = 0; i < 2; i++) {
    (function (idx) {
      setTimeout(function () {
        var star = document.createElement("p");
        var j = 0;
        var xDir = Math.random() < 0.5 ? -1 : 1;
        var xDist = Math.random() * 100;
        star.textContent = "+";
        container.appendChild(star);

        var timer = setInterval(function () {
          var yTrans = -(-(1 / 40) * (j - 20) ** 2 + 10) + "px";
          var xTrans = xDir * (xDist * (j / 100)) + "px";
          star.style.transform = "translateX(" + xTrans + ") translateY(" + yTrans + ")";
          j += 1;
        }, 25);

        setTimeout(function () {
          clearInterval(timer);
          star.remove();
        }, 5000);
      }, Math.floor(idx / 3) * 50);
    })(i);
  }
});

// ===== DATE & TIME =====
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var d = new Date();
document.getElementById("date").innerHTML = days[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate();
document.getElementById("time").innerHTML = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

// ===== STATUS.CAFE FEED =====
fetch('https://status.cafe/users/maddy.atom')
  .then(function (response) { return response.text(); })
  .then(function (str) { return new DOMParser().parseFromString(str, "text/xml"); })
  .then(function (data) {
    var entries = data.querySelectorAll("entry");
    if (entries.length === 0) return;
    var entryContent = entries[0].querySelector("content").textContent.trim();
    var dateStr = entries[0].querySelector("published").innerHTML.slice(5, 10);
    document.getElementById("feed-reader").innerHTML =
      "<div class='status-entry'><div class='status-content'>" + entryContent +
      "</div><h2 style='padding-left: 16px;'>" + dateStr + "</h2></div>";
  });
