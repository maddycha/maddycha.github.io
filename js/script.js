document.getElementsByTagName('img').ondragstart = function () { return false; };
const root = document.documentElement;
var style = window.getComputedStyle(document.body);
var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
var mobileQuery = window.matchMedia("(max-width: 768px)");
var isMobile = mobileQuery.matches || (window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(max-width: 1000px)").matches);
mobileQuery.addEventListener("change", function() { location.reload(); });


// #region ===== WINDOW CONFIGURATION =====
// To add a window: add an entry here, add HTML with matching id, add a desktop icon
var WINDOW_LIST = [
  { id: "about", name: "about" },
  { id: "dressup", name: "dress up" },
  { id: "art", name: "art" },
  { id: "social", name: "social" },
  { id: "guestbook", name: "guestbook" },
  { id: "work", name: "work" },
  { id: "resume", name: "resume" },
  { id: "settings", name: "settings" },
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
  var wasTop = windowsZ[0] === x.id;
  var idx = windowsZ.indexOf(x.id);
  if (idx > -1) {
    windowsZ.splice(idx, 1);
    windowsZ.unshift(x.id);
  }
  if (!wasTop && windowOpen[x.id]) {
    var el = document.getElementById(x.id);
    el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.transform = "scale(1.01)";
    setTimeout(function() {
      el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.transform = "scale(1)";
    }, 200);
  }
}

function updateZOrder() {
  for (var i = 0; i < windowsZ.length; i++) {
    var winEl = document.getElementById(windowsZ[i]);
    winEl.style.zIndex = 10 - i;
    winEl.classList.remove("window-active");
  }
  WINDOW_LIST.forEach(function (w) {
    var el = document.getElementById(windowOpenIds[w.id]);
    if (el) el.classList.remove("active");
  });
  var topId = windowsZ[0];
  if (windowOpen[topId]) {
    var el = document.getElementById(windowOpenIds[topId]);
    if (el) el.classList.add("active");
    document.getElementById(topId).classList.add("window-active");
  }
  var webrings = document.getElementById("webrings");
  if (webrings) {
    webrings.style.display = windowOpen["social"] ? "block" : "none";
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
  if (isMobile) return;
  var id = x.id;
  var win = WINDOW_LIST.find(function(w) { return w.id === id; });
  var wasOpen = windowOpen[id];

  if (!windowOpen[id]) {
    var el = document.getElementById(id);
    var bottomLimit = 2 + window.innerHeight - el.offsetHeight - document.getElementById("macnav").offsetHeight;
    var rightLimit = window.innerWidth - el.offsetWidth;
    
    if(id == "about"){
      el.style.left = getRandom(60, 200) + 'px';
      el.style.top = getRandom(120, bottomLimit-200) + 'px';
    }else{
      el.style.left = getRandom(60, rightLimit-100) + 'px';
      el.style.top = getRandom(20, bottomLimit-50) + 'px';
    }
    
    var li = document.createElement("li");
    li.className = "open";
    li.id = windowOpenIds[id];
    li.setAttribute("onclick", "openWindow(" + id + ")");
    li.innerHTML = "<img src='imgs/icons/" + win.id + ".png'><h3>" + win.name + "</h3>";
    li.style.opacity = "0";
    li.style.transform = "translateX(-8px)";
    li.style.transition = "none";
    document.getElementById('openwindows').appendChild(li);
    requestAnimationFrame(function() {
      li.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      li.style.opacity = "";
      li.style.transform = "";
    });
    windowOpen[id] = true;
  }
  
  var el = document.getElementById(id);

  function animateIn(selector, skipOpacity) {
    var items = document.querySelectorAll(selector);
    for (var ai = 0; ai < items.length; ai++) {
      items[ai].style.transition = "none";
      items[ai].style.opacity = skipOpacity ? "1" : "";
      items[ai].style.transform = "";
    }
    requestAnimationFrame(function() {
      for (var ai = 0; ai < items.length; ai++) {
        (function(idx) {
          setTimeout(function() {
            var transition = skipOpacity
              ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              : "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
            items[idx].style.transition = transition;
            items[idx].style.opacity = "1";
            items[idx].style.transform = "none";
          }, idx * 80);
        })(ai);
      }
    });
  }

  if (!wasOpen && id === "about") {
    animateIn("#about article", true);
  }
  if (!wasOpen && id === "dressup") {
    animateIn(".dressup-section");
    animateIn(".dressup-imgs");
  }
  if (!wasOpen && id === "art") {
    var previewer = document.getElementById("previewer");
    if (previewer) {
      previewer.style.transition = "none";
      previewer.style.opacity = "";
      setTimeout(function() {
        previewer.style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        previewer.style.opacity = "1";
      }, 50);
    }
    animateIn("#gallery");
  }
  if (!wasOpen && id === "settings") {
    animateIn(".settings-group");
  }
  if (!wasOpen && id === "resume") {
    animateIn(".resume-content h2, .resume-section");
  }
  if (!wasOpen && id === "guestbook") {
    var gbContainer = document.getElementById("guestbooks___guestbook-messages-container");
    var allItemsReset = document.querySelectorAll("#guestbooks___guestbook-messages-container > *");
    for (var ri = 0; ri < allItemsReset.length; ri++) {
      allItemsReset[ri].style.transition = "none";
      allItemsReset[ri].style.opacity = "";
      allItemsReset[ri].style.transform = "";
    }
    gbContainer.classList.remove("gb-loaded");
    var gbScroll = document.getElementById("guestbook-messages-scroll");
    if (gbScroll) gbScroll.scrollTop = gbScroll.scrollHeight;
    setTimeout(function() {
      var allItems = document.querySelectorAll("#guestbooks___guestbook-messages-container > *");
      var gbScroll2 = document.getElementById("guestbook-messages-scroll");
      if (gbScroll2) gbScroll2.scrollTop = gbScroll2.scrollHeight;
      for (var gi = 0; gi < allItems.length; gi++) {
        (function(idx) {
          var delay = (allItems.length - 1 - idx) * 30;
          setTimeout(function() {
            allItems[idx].style.transition = "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
            allItems[idx].style.opacity = "1";
            allItems[idx].style.transform = "none";
          }, delay);
        })(gi);
      }
      var totalDelay = allItems.length * 60 + 400;
      setTimeout(function() {
        gbContainer.classList.add("gb-loaded");
      }, totalDelay);
    }, 0);
  }
  if (!wasOpen && id === "work") {
    var title = document.querySelector(".work-title");
    if (title) {
      title.textContent = WORK_DEFAULT_TITLE;
      workTargetText = WORK_DEFAULT_TITLE;
      title.style.transition = "none";
      title.style.opacity = "";
      title.style.transform = "";
    }
    var workItems = document.querySelectorAll(".work-item");
    for (var wi = 0; wi < workItems.length; wi++) {
      workItems[wi].style.transition = "none";
      workItems[wi].style.opacity = "";
      workItems[wi].style.transform = "";
    }
    var typeDuration = 0;
    setTimeout(function() {
      if (title) {
        title.style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        title.style.opacity = "1";
        title.style.transform = "none";
      }
      for (var wi = 0; wi < workItems.length; wi++) {
        (function(idx) {
          setTimeout(function() {
            workItems[idx].style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
            workItems[idx].style.opacity = "1";
            workItems[idx].style.transform = "none";
          }, idx * 80);
        })(wi);
      }
    }, typeDuration);
  }
  if (wasOpen) {
    el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.transform = "scale(1.01)";
    setTimeout(function() {
      el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.transform = "scale(1)";
    }, 200);
  } else {
    el.style.transform = "scale(1.01)";
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
    el.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(function() {
      el.style.transform = "scale(1)";
    }, 200);
  }
  orderDiv(x);
}

function closeWindow(x) {
  var id = x.id;
  var el = document.getElementById(id);
  el.style.transform = "scale(0.92)";
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.transition = "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), pointer-events 0s 0.15s";
  windowOpen[id] = false;
  var openEl = document.getElementById(windowOpenIds[id]);
  if (openEl) {
    openEl.style.maxWidth = openEl.offsetWidth + "px";
    openEl.style.minWidth = "0";
    openEl.style.transition = "opacity 0.15s ease, transform 0.15s ease, max-width 0.15s ease, min-width 0.15s ease, padding 0.15s ease, gap 0.15s ease, border-width 0.15s ease";
    requestAnimationFrame(function() {
      openEl.style.opacity = "0";
      openEl.style.transform = "translateX(-8px)";
      openEl.style.maxWidth = "0";
      openEl.style.minWidth = "0";
      openEl.style.paddingLeft = "0";
      openEl.style.paddingRight = "0";
      openEl.style.borderWidth = "0";
      openEl.style.flex = "0 0 0";
    });
    setTimeout(function() { openEl.remove(); }, 150);
  }
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

  var THEME_LIGHT = { primary: "#000000", secondary: "#242424", bg: "#ffffff", s3: "#eeeeee" };
  var THEME_DARK = { primary: "#ffffff", secondary: "#eeeeee", bg: "#242424", s3: "#161616" };

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

  function applyTheme(theme, isDark) {
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--s3", theme.s3);
    if (isDark) {
      document.getElementById("theme-matrix").setAttribute("values",
        "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0");
      document.body.classList.add("theme-dark");
    } else {
      updateThemeFilter(theme.primary, theme.bg);
      document.body.classList.remove("theme-dark");
    }
  }

  function toggleDarkMode(checkbox) {
    var theme = checkbox.checked ? THEME_DARK : THEME_LIGHT;
    applyTheme(theme, checkbox.checked);
  }

  function crtSetting(checkbox){
    document.getElementById("crt").style.display = checkbox.checked ? "block" : "none";
  }
  function copyEmail(e) {
    e.preventDefault();
    navigator.clipboard.writeText("maddycha@gmail.com");
    if (isMobile) {
      var link = e.target.closest("a") || e.target;
      var existing = link.querySelector(".copy-toast");
      if (existing) {
        existing.remove();
      }
      var toast = document.createElement("span");
      toast.textContent = "copied";
      toast.className = "copy-toast";
      link.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 1500);
    } else {
      var cursor = document.getElementById("custom-cursor");
      var cursorText = cursor.querySelector("span");
      cursorText.textContent = "copied";
      cursor.classList.add("cursor-copied");
      setTimeout(function() {
        cursorText.textContent = "copy";
        cursor.classList.remove("cursor-copied");
      }, 1500);
    }
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
          }, 1200);
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
    
    function measureBrands() {
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
    }

    Promise.all([
      document.fonts.load("35px 'Instrument Serif'"),
      document.fonts.load("italic 35px 'Instrument Serif'")
    ]).then(function() {
      requestAnimationFrame(measureBrands);
    });
  });
  
  // #endregion
  
  // #region ===== CUSTOM CURSOR =====
  (function() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    var cursor = document.getElementById("custom-cursor");
    var cursorText = cursor.querySelector("span");
    var isDragging = false;
    cursor.style.display = "none";

    document.addEventListener("mousemove", function(e) {
      cursor.style.display = "";
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    var openSelectors = "a, .icon, #guestbook-pages p";
    var closeSelectors = ".x";
    var interactSelectors = ".switch, .theme-circle, .art, .controls i, .item, .work-item, .gb-scroll-bottom, .guestbookcontent input, .guestbookcontent textarea, input[type=submit]:not(:disabled), #guestbooks___pow-checkbox, #guestbooks___pow-status, #guestbooks___challenge-answer-container, #copy-open, #openwindows li, #sitemap li";

    document.addEventListener("mouseover", function(e) {
      if (isDragging) return;
      var target = e.target;
      if (target.closest(closeSelectors)) {
        cursor.className = "cursor-label";
        cursorText.textContent = "close";
      } else if (target.closest(interactSelectors)) {
        cursor.className = "cursor-interact";
        cursorText.textContent = "";
      } else if (target.closest(".copy-email")) {
        cursor.className = "cursor-label";
        cursorText.textContent = "copy";
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


  // #region ===== WORK PROJECTS =====
  var WORK_PROJECTS = [
    { name: "Draw in chat", img: "draw in chat.mp4", tag: "2025", blurb: "Draw, highlight, and annotate directly on messages" },
    { name: "Drag-and-drop", img: "drag-and-drop.mp4", tag: "2025", blurb: "Place stickers and emojis anywhere in chat" },
    { name: "Music sticker", img: "music sticker.mp4", tag: "2025", blurb: "Share music with an animated vinyl sticker" },
    { name: "Media gallery", img: "media gallery.mp4", tag: "2024", blurb: "Preview and edit media before sharing" },
  ];
  var WORK_DEFAULT_TITLE = "Selected work for Instagram";
  var workTypeTimer = null;
  var workFadeTimer = null;
  var workRevertTimer = null;
  var workTargetText = "";

  function workSetText(el, newText) {
    if (newText === workTargetText) return;
    workTargetText = newText;
    if (workTypeTimer) clearInterval(workTypeTimer);
    if (workFadeTimer) clearTimeout(workFadeTimer);
    el.style.opacity = "0";
    workFadeTimer = setTimeout(function() {
      el.textContent = "";
      el.style.opacity = "1";
      var i = 0;
      workTypeTimer = setInterval(function() {
        el.textContent = newText.slice(0, i + 1);
        i++;
        if (i >= newText.length) clearInterval(workTypeTimer);
      }, 10);
    }, 50);
  }

  window.addEventListener("load", function() {
    var workList = document.getElementById("work-list");
    if (!workList) return;

    for (var i = 0; i < WORK_PROJECTS.length; i++) {
      var num = (i + 1 < 10 ? "0" : "") + (i + 1);
      var item = document.createElement("div");
      item.className = "work-item";
      item.setAttribute("data-img", "imgs/work/" + WORK_PROJECTS[i].img);
      item.setAttribute("data-blurb", WORK_PROJECTS[i].blurb);
      item.innerHTML =
        "<p>" + WORK_PROJECTS[i].name + "</p>" +
        "<p class='work-item-tag'>" + WORK_PROJECTS[i].tag + "</p>";
      workList.appendChild(item);
    }

    var preview = document.getElementById("work-preview");
    var items = workList.querySelectorAll(".work-item");

    var workTitle = document.querySelector(".work-title");


    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("mouseenter", function() {
        if (workRevertTimer) { clearTimeout(workRevertTimer); workRevertTimer = null; }
        preview.src = this.getAttribute("data-img");
        preview.classList.add("visible");
        preview.play();
        workSetText(workTitle, this.getAttribute("data-blurb"));
      });
      items[i].addEventListener("mouseleave", function() {
        preview.classList.remove("visible");
        preview.pause();
        preview.currentTime = 0;
        workRevertTimer = setTimeout(function() {
          workSetText(workTitle, WORK_DEFAULT_TITLE);
          workRevertTimer = null;
        }, 100);
      });
    }

    var workListArea = document.querySelector(".work-list-area");
    var workEl = document.getElementById("work");
    workEl.addEventListener("mousemove", function(e) {
      if (!preview.classList.contains("visible")) return;
      var rect = workListArea.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var x = (e.clientX - centerX) / rect.width;
      var y = (e.clientY - centerY) / rect.height;
      preview.style.transform = "translate(" + (x * 20) + "px, " + (y * 20) + "px)";
    });
  });
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