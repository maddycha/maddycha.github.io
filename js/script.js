document.getElementsByTagName('img').ondragstart = function () { return false; };
const root = document.documentElement;
var style = window.getComputedStyle(document.body);
var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


// #region ===== WINDOW CONFIGURATION =====
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
// #endregion

// #region ===== INTERNAL STATE =====
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
// #endregion

// #region ===== Z-ORDER =====
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
// #endregion

// #region ===== TAB SWITCHING =====
function openTab(groupName, tabElement) {
  var group = TAB_GROUPS[groupName];
  if (!group) return;
  
  
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
// #endregion

// #region ===== WINDOW OPEN/CLOSE =====
function openWindow(x) {
  
  var id = x.id;
  var num = parseInt(id.slice(1));
  var win = WINDOW_LIST[num];
  
  if (!windowOpen[id]) {
    var el = document.getElementById(id);
    var bottomLimit = 2 + window.innerHeight - el.offsetHeight - document.getElementById("macnav").offsetHeight;
    var rightLimit = window.innerWidth - el.offsetWidth;
    
    if(id == "w0"){
      el.style.left = getRandom(60, 200) + 'px';
      el.style.top = getRandom(120, bottomLimit-200) + 'px';
    }else{
      el.style.left = getRandom(60, rightLimit-100) + 'px';
      el.style.top = getRandom(20, bottomLimit-50) + 'px';
    }
    
    document.getElementById('openwindows').innerHTML +=
    "<li class='open' id='" + windowOpenIds[id] + "' onclick='openWindow(" + id + ")'>" +
    "<img src='imgs/icons/" + win.name + ".png'><h3>" + win.name + "</h3></li>";
    windowOpen[id] = true;
  }
  
  var el = document.getElementById(id);
  el.style.transform = "scale(1)";
  el.style.opacity = "1";
  el.style.pointerEvents = "auto";
  el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
  orderDiv(x);
}

function closeWindow(x) {
  var id = x.id;
  var el = document.getElementById(id);
  el.style.transform = "scale(0.92)";
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), pointer-events 0s 0.2s";
  windowOpen[id] = false;
  var openEl = document.getElementById(windowOpenIds[id]);
  if (openEl) openEl.remove();
  setTimeout(function() {
    var idx = windowsZ.indexOf(id);
    if (idx > -1) {
      windowsZ.splice(idx, 1);
      windowsZ.push(id);
    }
    updateZOrder();
  }, 200);
}
// #endregion

// #region ===== DRAG =====
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
// #endregion

// #region ===== SITEMAP =====
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
    setTimeout(sitemapBottomDelay, 50);
  }
  sitemapOpen = !sitemapOpen;
}

const sitemapConst = document.querySelector('#sitemap');
const smContainerConst = document.querySelector('#sitemapContainer');

window.addEventListener('click', (event) => {
  if (sitemapConst.contains(event.target)||smContainerConst.contains(event.target)) {
  } else {
    if (sitemapOpen) {
      content.style.maxHeight = null;
      setTimeout(sitemapBottomDelay, 200);
      sitemapOpen = false;
    }  }
  });
  // #endregion
  
  // #region ==== SETTINGS ====

  // ---- EDIT THEMES HERE ----
  var THEMES = [
    { circle: "#000000", primary: "#000000", secondary: "#242424", bg: "#ffffff", s3: "#eeeeee" },
    { circle: "#3E2518", primary: "#3E2518", secondary: "#5C3D2E", bg: "#ffffff", s3: "#eeeeee" },
    { circle: "#152D4F", primary: "#152D4F", secondary: "#2A4268", bg: "#ffffff", s3: "#eeeeee" },
    { circle: "#2A4422", primary: "#2A4422", secondary: "#3E5C34", bg: "#ffffff", s3: "#eeeeee" },
    { circle: "#6B1A3E", primary: "#6B1A3E", secondary: "#883058", bg: "#ffffff", s3: "#eeeeee" },
    { circle: "#3A2460", primary: "#3A2460", secondary: "#523A7A", bg: "#ffffff", s3: "#eeeeee" },
  ];

  var currentTheme = 0;

  (function() {
    var container = document.getElementById("theme-colors");
    for (var i = 0; i < THEMES.length; i++) {
      var circle = document.createElement("div");
      circle.className = "theme-circle" + (i === 0 ? " selected" : "");
      circle.style.background = THEMES[i].circle;
      circle.setAttribute("data-theme", i);
      circle.setAttribute("onclick", "setTheme(" + i + ")");
      container.appendChild(circle);
    }
  })();

  function hexToRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255
    ];
  }

  function updateThemeFilter(primary, bg) {
    var p = hexToRgb(primary);
    var b = hexToRgb(bg);
    document.getElementById("theme-matrix").setAttribute("values",
      (b[0]-p[0])+" 0 0 0 "+p[0]+" "+
      "0 "+(b[1]-p[1])+" 0 0 "+p[1]+" "+
      "0 0 "+(b[2]-p[2])+" 0 "+p[2]+" "+
      "0 0 0 1 0"
    );
  }

  function setTheme(index) {
    var theme = THEMES[index];
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--s3", theme.s3);

    var circles = document.querySelectorAll(".theme-circle");
    for (var i = 0; i < circles.length; i++) {
      circles[i].classList.remove("selected");
      if (circles[i].getAttribute("data-theme") == index) {
        circles[i].classList.add("selected");
      }
    }
    updateThemeFilter(theme.primary, theme.bg);
    currentTheme = index;
  }

  function crtSetting(checkbox){
    document.getElementById("crt").style.display = checkbox.checked ? "block" : "none";
  }
  // #endregion
  
  
  // #region ===== CLICK EFFECT =====
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
  // #endregion
  
  // #region ===== DATE & TIME =====
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  var d = new Date();
  document.getElementById("date").innerHTML = days[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate();
  document.getElementById("time").innerHTML = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  // #endregion
  
  // #region ==== DRESS UP ====
  
  var tops = [];
  var bottoms = [];
  var shoes = [];
  
  var topsBrands = ['hyein seo', 'welldone', 'empath', 'simone rocha', 'vivienne westwood'];
  var bottomsBrands = ['aelfric eden', 'diesel', 'sandy liang', 'misbhv'];
  var shoesBrands = ['buffalo', 'mschf', 'suicoke'];
  
  function bounceDressup() {
    var el = document.querySelector(".dressup-imgs");
    el.classList.remove("item-bounce");
    el.getBoundingClientRect();
    el.classList.add("item-bounce");
  }

  function topsUpdate(x) {
    document.getElementById("tops-img").src = tops[x];
    bounceDressup();
    for (var i = 0; i < topsBrands.length + 1; i++) {
      if (i !== x) {
        if (document.getElementById(String(i + "-topsbrand")) !== null) {
          document.getElementById(String(i + "-topsbrand")).style.textTransform = "lowercase";
          document.getElementById(String(i + "-topsbrand")).style.fontStyle = "normal";
          document.getElementById(String(i + "-topsbrand")).parentElement.style.opacity = "";
        }
      } else {
        document.getElementById(String(i + "-topsbrand")).style.textTransform = "uppercase";
        document.getElementById(String(i + "-topsbrand")).style.fontStyle = "italic";
        document.getElementById(String(i + "-topsbrand")).parentElement.style.opacity = "1";
      }
    }
  }
  function bottomsUpdate(x) {
    document.getElementById("bottoms-img").src = bottoms[x];
    bounceDressup();
    for (var i = 0; i < bottomsBrands.length + 1; i++) {
      if (i !== x) {
        if (document.getElementById(String(i + "-bottomsbrand")) !== null) {
          document.getElementById(String(i + "-bottomsbrand")).style.textTransform = "lowercase";
          document.getElementById(String(i + "-bottomsbrand")).style.fontStyle = "normal";
          document.getElementById(String(i + "-bottomsbrand")).parentElement.style.opacity = "";
        }
      } else {
        document.getElementById(String(i + "-bottomsbrand")).style.textTransform = "uppercase";
        document.getElementById(String(i + "-bottomsbrand")).style.fontStyle = "italic";
        document.getElementById(String(i + "-bottomsbrand")).parentElement.style.opacity = "1";
      }
    }
  }
  function shoesUpdate(x) {
    document.getElementById("shoes-img").src = shoes[x];
    bounceDressup();
    for (var i = 0; i < shoesBrands.length + 1; i++) {
      if (i !== x) {
        if (document.getElementById(String(i + "-shoesbrand")) !== null) {
          document.getElementById(String(i + "-shoesbrand")).style.textTransform = "lowercase";
          document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "normal";
          document.getElementById(String(i + "-shoesbrand")).parentElement.style.opacity = "";
        }
      } else {
        document.getElementById(String(i + "-shoesbrand")).style.textTransform = "uppercase";
        document.getElementById(String(i + "-shoesbrand")).style.fontStyle = "italic";
        document.getElementById(String(i + "-shoesbrand")).parentElement.style.opacity = "1";
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
    
    requestAnimationFrame(function() {
      var brands = document.querySelectorAll(".brand");
      for (var b = 0; b < brands.length; b++) {
        brands[b].style.minWidth = "";
        brands[b].style.textTransform = "uppercase";
        brands[b].style.fontStyle = "italic";
      }
      requestAnimationFrame(function() {
        var brands = document.querySelectorAll(".brand");
        for (var b = 0; b < brands.length; b++) {
          brands[b].style.minWidth = brands[b].offsetWidth + "px";
          brands[b].style.textTransform = "";
          brands[b].style.fontStyle = "";
        }
        document.getElementById(String(0 + "-topsbrand")).style.textTransform = "uppercase";
        document.getElementById(String(0 + "-topsbrand")).style.fontStyle = "italic";
        document.getElementById(String(0 + "-topsbrand")).parentElement.style.opacity = "1";
        document.getElementById(String(0 + "-bottomsbrand")).style.textTransform = "uppercase";
        document.getElementById(String(0 + "-bottomsbrand")).style.fontStyle = "italic";
        document.getElementById(String(0 + "-bottomsbrand")).parentElement.style.opacity = "1";
        document.getElementById(String(0 + "-shoesbrand")).style.textTransform = "uppercase";
        document.getElementById(String(0 + "-shoesbrand")).style.fontStyle = "italic";
        document.getElementById(String(0 + "-shoesbrand")).parentElement.style.opacity = "1";
      });
    });
  });
  
  // #endregion
  
  // #region ===== CUSTOM CURSOR =====
  (function() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    var cursor = document.getElementById("custom-cursor");
    var cursorText = cursor.querySelector("span");
    var isDragging = false;

    document.addEventListener("mousemove", function(e) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    var openSelectors = "a, .icon, #guestbook-pages p";
    var closeSelectors = ".x";
    var interactSelectors = ".switch, .theme-circle, .art, .controls i, .item, .guestbookcontent input, .guestbookcontent textarea, input[type=submit]:not(:disabled), #guestbooks___pow-checkbox, #guestbooks___pow-status, #guestbooks___challenge-answer-container, #copy-open, #openwindows li, #sitemap li";

    document.addEventListener("mouseover", function(e) {
      if (isDragging) return;
      var target = e.target;
      if (target.closest(closeSelectors)) {
        cursor.className = "cursor-label";
        cursorText.textContent = "close";
      } else if (target.closest(interactSelectors)) {
        cursor.className = "cursor-interact";
        cursorText.textContent = "";
      } else if (target.closest(openSelectors)) {
        cursor.className = "cursor-label";
        cursorText.textContent = "open";
      } else {
        cursor.className = "";
        cursorText.textContent = "";
      }
    });

    document.addEventListener("mouseout", function(e) {
      if (isDragging) return;
      if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
        cursor.className = "";
        cursorText.textContent = "";
      }
    });

    var navs = document.querySelectorAll(".windownav");
    for (var i = 0; i < navs.length; i++) {
      navs[i].addEventListener("mousedown", function() {
        isDragging = true;
        cursor.className = "cursor-drag";
        cursorText.textContent = "";
      });
    }

    document.addEventListener("mouseup", function() {
      if (isDragging) {
        isDragging = false;
        cursor.className = "";
        cursorText.textContent = "";
      }
    });
  })();
  // #endregion

  // #region ===== MOBILE CIRCLE SCRIBBLE =====
  (function() {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    var mobile = document.getElementById("mobile");
    if (!mobile) return;
    var path = mobile.querySelector(".circle-scribble path");
    if (!path) return;

    path.style.animation = "none";

    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    var startTime = null;
    function tick(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime - 1000;
      if (elapsed < 0) {
        path.style.strokeDashoffset = "500";
        requestAnimationFrame(tick);
        return;
      }
      var t = (elapsed % 10000) / 10000;
      var offset;
      if (t < 0.12) {
        offset = 500 - 500 * ease(t / 0.12);
      } else if (t < 0.22) {
        offset = 0;
      } else if (t < 0.28) {
        offset = -500 * ease((t - 0.22) / 0.06);
      } else {
        offset = -500;
      }
      path.style.strokeDashoffset = String(offset);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  // #endregion

  // #region ===== DESKTOP CIRCLE SCRIBBLE =====
  (function() {
    var w0 = document.getElementById("w0");
    var path = w0.querySelector(".circle-scribble path");
    if (!path) return;

    w0.addEventListener("mouseenter", function() {
      if (!windowOpen["w0"]) return;
      path.style.transition = "none";
      path.style.strokeDashoffset = "500";
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
      path.style.strokeDashoffset = "0";
    });

    w0.addEventListener("mouseleave", function() {
      if (!windowOpen["w0"]) return;
      path.style.transition = "stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      path.style.strokeDashoffset = "-500";
    });

    var originalClose = window.closeWindow;
    window.closeWindow = function(x) {
      if (x.id === "w0") {
        path.style.transition = "none";
        path.style.strokeDashoffset = "500";
      }
      originalClose(x);
    };
  })();
  // #endregion

  // // #region ===== STATUS.CAFE FEED =====
  // fetch('https://status.cafe/users/maddy.atom')
  //   .then(function (response) { return response.text(); })
  //   .then(function (str) { return new DOMParser().parseFromString(str, "text/xml"); })
  //   .then(function (data) {
  //     var entries = data.querySelectorAll("entry");
  //     if (entries.length === 0) return;
  //     var entryContent = entries[0].querySelector("content").textContent.trim();
  //     var dateStr = entries[0].querySelector("published").innerHTML.slice(5, 10);
  //     document.getElementById("feed-reader").innerHTML =
  //       "<div class='status-entry'><div class='status-content'>" + entryContent +
  //       "</div><h2 style='padding-left: 16px;'>" + dateStr + "</h2></div>";
  //   });
  // // #endregion