document.getElementsByTagName('img').ondragstart = function () { return false; };
const root = document.documentElement;
var style = window.getComputedStyle(document.body);
var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
var mobileQuery = window.matchMedia("(max-width: 768px)");
var tabletQuery = window.matchMedia("(pointer: coarse) and (max-width: 1000px)");
var isMobile = mobileQuery.matches || tabletQuery.matches;
mobileQuery.addEventListener("change", function() { location.reload(); });
tabletQuery.addEventListener("change", function() { location.reload(); });


// #region ===== WINDOW CONFIGURATION =====
// To add a window: add an entry here, add HTML with matching id, add a desktop icon
var WINDOW_LIST = [
  { id: "about", name: "about" },
  { id: "dressup", name: "dress up" },
  { id: "art", name: "art" },
  { id: "social", name: "social" },
  { id: "guestbook", name: "guestbook" },
  { id: "work", name: "work" },
  { id: "games", name: "game log" },
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
  if (!wasOpen && id === "games") {
    var gScreen = document.querySelector("#games .games-screen");
    if (gScreen) {
      gScreen.setAttribute("data-view", "home");
      gScreen.classList.remove("show-detail");
    }
    var gamesParts = [
      document.querySelector("#games .games-topbar"),
      document.querySelector("#games .games-stage")
    ];
    for (var gp = 0; gp < gamesParts.length; gp++) {
      if (!gamesParts[gp]) continue;
      gamesParts[gp].style.transition = "none";
      gamesParts[gp].style.opacity = "";
      gamesParts[gp].style.transform = "";
    }
    requestAnimationFrame(function() {
      for (var gp = 0; gp < gamesParts.length; gp++) {
        (function(idx) {
          if (!gamesParts[idx]) return;
          setTimeout(function() {
            gamesParts[idx].style.transition = "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
            gamesParts[idx].style.opacity = "1";
            gamesParts[idx].style.transform = "none";
          }, idx * 60);
        })(gp);
      }
    });
  }
  if (wasOpen) {
    // expand quickly, hold the expanded state a beat, then settle — same ~400ms total as before
    el.style.transition = "transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.transform = "scale(1.01)";
    setTimeout(function() {
      el.style.transition = "transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.transform = "scale(1)";
    }, 280);
  } else {
    el.style.transform = "scale(1.01)";
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
    // opacity ramps in fast so the window isn't blank for long; the scale/position settles a touch slower
    el.style.transition = "transform 0.26s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.12s cubic-bezier(0.4, 0, 0.2, 1)";
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
  handle.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {


    e = e || window.event;
    // don't start a drag from inside an interactive screen area (e.g. the Switch LCD)
    if (e.target && e.target.closest && e.target.closest(".window-nodrag")) return;
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
      var afterStyle = window.getComputedStyle(link, "::after");
      var afterWidth = link.querySelector(".copy-toast") ? 0 : afterStyle.width;
      link.appendChild(toast);
      var emailWidth = parseFloat(window.getComputedStyle(link, "::after").width) || 0;
      toast.style.right = (emailWidth + 6) + "px";
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
    var closeSelectors = ".x, .jc-close, .gd-close, .lb-close";
    var interactSelectors = ".switch, .theme-circle, .art, .controls i, .item, .work-item, .game-tile, .games-nav-btn, #games-profile-img, .games-home-btn, .gp-row, .gd-nav, .lb-nav, .gallery-shot, .gd-shot, .lb-img, .gb-scroll-bottom, .guestbookcontent input, .guestbookcontent textarea, input[type=submit]:not(:disabled), #guestbooks___pow-checkbox, #guestbooks___pow-status, #guestbooks___challenge-answer-container, #copy-open, #openwindows li, #sitemap li";

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

    // Switch console: dragging from the bezel/joy-cons (but not the screen)
    var gamesDragZones = document.querySelectorAll(".joycon, .games-bezel");
    for (var gi = 0; gi < gamesDragZones.length; gi++) {
      gamesDragZones[gi].addEventListener("mousedown", function(e) {
        if (e.target.closest(".window-nodrag, .jc-close")) return;
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

  // #region ===== GAMES =====
  // Source of truth: the Notion game-log database (kept in this order on the site).
  // To add a game: add an entry below and drop its thumbnail in imgs/games/thumbnail/ (named <slug>.jpg).
  // status: completed | ongoing | unfinished  (shown on the detail page)
  // hours = play time
  // screenshots = auto-detected. Drop files named 1.jpg, 2.jpg, 3.jpg ... into that game's folder,
  //               imgs/games/<thumbnail-name-without-ext>/ (e.g. balatro.jpg -> imgs/games/balatro/).
  //               They appear automatically on the detail page + gallery; no code edits needed.
  var GAMES = [
    { name: "Animal Crossing: New Horizons",          img: "animal-crossing.jpg",             status: "ongoing",     hours: 1500 },
    { name: "Balatro",                                img: "balatro.jpg",                     status: "completed",   hours: 470 },
    { name: "Tomodachi Life: Living the Dream",       img: "tomodachi-life.jpg",              status: "ongoing",     hours: 80 },
    { name: "Pokemon Pokopia",                        img: "pokopia.jpg",                     status: "ongoing",     hours: 250 },
    { name: "Pokemon UNITE",                          img: "pokemon-unite.jpg",               status: "ongoing",     hours: 1800 },
    { name: "The Great Ace Attorney Chronicles",      img: "great-ace-attorney.jpg",          status: "completed",   hours: 50 },
    { name: "Apollo Justice: Ace Attorney Trilogy",   img: "apollo-justice.jpg",              status: "unfinished",  hours: 10 },
    { name: "Ace Attorney Investigations Chronicles", img: "ace-attorney-investigations.jpg", status: "completed",   hours: 30 },
    { name: "Phoenix Wright: Ace Attorney Trilogy",   img: "phoenix-wright.jpg",              status: "completed",   hours: 100 },
    { name: "We Love Katamari REROLL+ Royal Reverie", img: "we-love-katamari.jpg",            status: "completed",   hours: 15 },
    { name: "Katamari Damacy REROLL",                 img: "katamari-damacy.jpg",             status: "completed",   hours: 10 },
    { name: "Slay the Spire",                         img: "slay-the-spire.jpg",              status: "unfinished",  hours: 10 },
    { name: "Portal 2",                               img: "portal-2.jpg",                    status: "completed",   hours: 10 },
    { name: "Portal",                                 img: "portal.jpg",                      status: "completed",   hours: 4 },
    { name: "Dispatch",                               img: "dispatch.jpg",                    status: "completed",   hours: 7 },
    { name: "Deltarune",                              img: "deltarune.jpg",                   status: "ongoing",     hours: 12 },
    { name: "Undertale",                              img: "undertale.jpg",                   status: "completed",   hours: 30 },
    { name: "Stardew Valley",                         img: "stardew-valley.jpg",              status: "completed",   hours: 70 },
    { name: "Fire Emblem: Three Houses",              img: "fire-emblem-three-houses.jpg",    status: "completed",   hours: 80 },
    { name: "Pokemon Legends: Z-A",                   img: "pokemon-legends-za.jpg",          status: "completed",   hours: 1035 },
    { name: "Pokemon Scarlet",                        img: "pokemon-scarlet.jpg",             status: "completed",   hours: 225 },
    { name: "Pokemon Sword",                          img: "pokemon-sword.jpg",               status: "completed",   hours: 200 },
    { name: "Taiko no Tatsujin: Drum 'n' Fun!",       img: "taiko-drum-n-fun.jpg",            status: "completed",   hours: 35 },
    { name: "Super Mario Odyssey",                    img: "super-mario-odyssey.jpg",         status: "completed",   hours: 10 },
    { name: "Night in the Woods",                     img: "night-in-the-woods.jpg",          status: "completed",   hours: 10 },
    { name: "New Pokemon Snap",                       img: "new-pokemon-snap.jpg",            status: "unfinished",  hours: 8 },
    { name: "Pokemon Legends: Arceus",                img: "pokemon-legends-arceus.jpg",      status: "completed",   hours: 20 },
    { name: "Pikmin 4",                               img: "pikmin-4.jpg",                    status: "unfinished",  hours: 4 },
    { name: "Paper Mario: The Thousand-Year Door",    img: "paper-mario-ttyd.jpg",            status: "completed",   hours: 25 },
    { name: "Overcooked! 2",                          img: "overcooked-2.jpg",                status: "completed",   hours: 20 },
    { name: "Disco Elysium - The Final Cut",          img: "disco-elysium.jpg",               status: "unfinished",  hours: 4 },
    { name: "Catherine: Full Body",                   img: "catherine-full-body.jpg",         status: "unfinished",  hours: 6 },
    { name: "The Stanley Parable: Ultra Deluxe",      img: "stanley-parable.jpg",             status: "completed",   hours: 5 },
    { name: "Inscryption",                            img: "inscryption.jpg",                 status: "completed",   hours: 20 },
    { name: "The World Ends With You -Final Remix-",  img: "twewy.jpg",                       status: "completed",   hours: 10 },
    { name: "SUPERHOT",                               img: "superhot.jpg",                    status: "completed",   hours: 3 },
    { name: "Superliminal",                           img: "superliminal.jpg",                status: "completed",   hours: 3 },
    { name: "Little Nightmares II",                   img: "little-nightmares-2.jpg",         status: "unfinished",  hours: 7 },
    { name: "The Exit 8",                             img: "the-exit-8.jpg",                  status: "completed",   hours: 2 },
    { name: "Platform 8",                             img: "platform-8.jpg",                  status: "completed",   hours: 1 },
    { name: "Mario Kart 8 Deluxe",                    img: "mario-kart-8-deluxe.jpg",         status: "completed",   hours: 55 },
    { name: "OneShot: World Machine Edition",         img: "oneshot.jpg",                     status: "completed",   hours: 4 },
    { name: "A Short Hike",                           img: "a-short-hike.jpg",                status: "completed",   hours: 1 },
    { name: "Outer Wilds",                            img: "outer-wilds.jpg",                 status: "completed",   hours: 20 },
    { name: "Persona 5 Royal",                        img: "persona-5-royal.jpg",             status: "unfinished",  hours: 45 },
    { name: "Cult of the Lamb",                       img: "cult-of-the-lamb.jpg",            status: "completed",   hours: 45 },
    { name: "DAVE THE DIVER",                         img: "dave-the-diver.jpg",              status: "unfinished",  hours: 4 },
    { name: "1000xRESIST",                            img: "1000xresist.jpg", thumb: "https://images.nintendolife.com/a71426410915e/1000xresist-cover.cover_large.jpg", status: "completed",   hours: 7 },
    { name: "Spiritfarer",                            img: "spiritfarer.jpg",                 status: "completed",   hours: 20 },
    { name: "Pikuniku",                               img: "pikuniku.jpg",                    status: "completed",   hours: 2 },
    { name: "Untitled Goose Game",                    img: "untitled-goose-game.jpg",         status: "completed",   hours: 4 },
    { name: "Wandersong",                             img: "wandersong.jpg",                  status: "completed",   hours: 8 },
    { name: "Oxenfree",                               img: "oxenfree.jpg",                    status: "completed",   hours: 8 },
    { name: "Card Shark",                             img: "card-shark.jpg",                  status: "unfinished",  hours: 3 },
    { name: "Baba is You",                            img: "baba-is-you.jpg",                 status: "unfinished",  hours: 3 },
    { name: "OMORI",                                  img: "omori.jpg",                       status: "completed",   hours: 15 },
  ];

  // image path helpers — thumbnails live in imgs/games/thumbnail/, screenshots in imgs/games/<slug>/
  function gameThumb(g) { return g.thumb || ("imgs/games/thumbnail/" + g.img); }
  function gameSlug(g) { return g.img.replace(/\.[^.]+$/, ""); }
  // escape for safe use in HTML attributes/text (game titles can contain ' " & < >)
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // ----- screenshot auto-discovery -----
  // A static site can't list a folder, so screenshots use a numbered convention:
  // drop files named 1.jpg, 2.jpg, 3.jpg ... into imgs/games/<slug>/ and they appear
  // automatically. We probe sequential numbers and stop at the first gap.
  // (Optional override: put explicit filenames in a game's `shots` array and those win.)
  var SHOT_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
  var SHOT_MAX = 60; // safety cap on numbers probed per game

  // Try each extension for one number, then call cb(url) or cb(null) if none load.
  function probeShot(base, n, extIdx, cb) {
    if (extIdx >= SHOT_EXTS.length) { cb(null); return; }
    var url = base + "/" + n + "." + SHOT_EXTS[extIdx];
    var im = new Image();
    im.onload = function() { cb(url); };
    im.onerror = function() { probeShot(base, n, extIdx + 1, cb); };
    im.src = url;
  }

  // Discover a game's screenshots (cached on the game object). Calls done(arrayOfUrls).
  function discoverShots(g, done) {
    if (g._shots) { done(g._shots); return; }
    var base = "imgs/games/" + gameSlug(g);
    if (g.shots && g.shots.length) { // manual override: explicit filenames in the folder
      g._shots = g.shots.map(function(f) { return base + "/" + f; });
      done(g._shots);
      return;
    }
    var urls = [];
    (function next(n) {
      if (n > SHOT_MAX) { g._shots = urls; done(urls); return; }
      probeShot(base, n, 0, function(url) {
        if (!url) { g._shots = urls; done(urls); return; } // gap -> stop
        urls.push(url);
        next(n + 1);
      });
    })(1);
  }

  // bottom-bar navigation
  var GAME_NAV = [
    { view: "home",    icon: "fa-house",     label: "home" },
    { view: "gallery", icon: "fa-images",    label: "gallery" }
    // news removed for now
    // { view: "news",    icon: "fa-newspaper", label: "news" }
  ];

  // news / blog posts (placeholder — edit freely)
  var NEWS = [
    { date: "Jun 2026", title: "Currently obsessed with Blue Prince", body: "Started this one on a whim and can't stop thinking about it between sessions." },
    { date: "May 2026", title: "Cleared the Ace Attorney trilogy", body: "Finally got through every case. The Great Ace Attorney is up next." },
    { date: "Apr 2026", title: "Backlog spring cleaning", body: "Added a pile of games I keep meaning to start. No promises on when." }
  ];

  function gamesShowView(name) {
    var s = document.querySelector("#games .games-screen");
    if (!s) return;
    s.setAttribute("data-view", name);
    var btns = s.querySelectorAll(".games-nav-btn");
    for (var b = 0; b < btns.length; b++) {
      btns[b].classList.toggle("is-active", btns[b].getAttribute("data-view") === name);
    }
  }
  function gamesOpenProfile() {
    gamesShowView("profile");
  }
  function gamesGoHome() { gamesShowView("home"); }

  // ----- game detail overlay -----
  var gamesDetailIndex = -1;
  var gdShots = [];      // screenshot urls for the game currently shown in the detail view (for the lightbox)
  var gdGameName = "";   // name of that game (used as the lightbox caption)
  function gamesPopulateDetail(idx) {
    var g = GAMES[idx];
    if (!g) return;
    gamesDetailIndex = idx;
    gdGameName = g.name;
    document.getElementById("gd-thumb").src = gameThumb(g);
    document.getElementById("gd-name").textContent = g.name;
    var st = document.getElementById("gd-status");
    st.textContent = g.status || "";
    st.className = "games-status" + (g.status ? " status-" + g.status : "");
    var hoursEl = document.getElementById("gd-hours");
    if (hoursEl) hoursEl.textContent = (g.hours || 0) + (g.hours === 1 ? " hour played" : " hours played");
    var shotsEl = document.getElementById("gd-shots");
    var shotsSection = document.getElementById("gd-shots-section");
    // hide the Screenshots section until/unless we actually find screenshots in this game's folder
    gdShots = [];
    shotsEl.innerHTML = "";
    if (shotsSection) shotsSection.style.display = "none";
    discoverShots(g, function(urls) {
      if (gamesDetailIndex !== idx) return; // user flipped to another game while probing
      if (!urls.length) return;             // no screenshots -> leave section hidden
      gdShots = urls.slice().reverse();     // detail page shows newest-first (reverse of the folder order)
      // stacked full-width: round only the top of the first shot and the bottom of the last
      var n = gdShots.length, R = "12px", html = "";
      for (var s = 0; s < n; s++) {
        var top = (s === 0) ? R : "0";
        var bot = (s === n - 1) ? R : "0";
        html += "<div class='gd-shot'><img src='" + gdShots[s] + "' alt='" + esc(g.name) +
          " screenshot' style='border-radius:" + top + " " + top + " " + bot + " " + bot + "'></div>";
      }
      shotsEl.innerHTML = html;
      if (shotsSection) shotsSection.style.display = "";
    });
    // little content refresh as you flip between games
    var body = document.getElementById("gd-body");
    body.style.transition = "none";
    body.style.opacity = "0";
    body.style.transform = "translateY(8px)";
    requestAnimationFrame(function() {
      body.style.transition = "opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)";
      body.style.opacity = "1";
      body.style.transform = "none";
    });
  }
  function gamesOpenDetail(idx) {
    gamesPopulateDetail(idx);
    var s = document.querySelector("#games .games-screen");
    if (s) s.classList.add("show-detail");
  }
  function gamesCloseDetail() {
    var s = document.querySelector("#games .games-screen");
    if (s) s.classList.remove("show-detail");
  }
  function gamesDetailBackdrop(e) {
    // close only when the dark area itself is clicked, not the window or arrows
    if (e.target && e.target.id === "games-detail-overlay") gamesCloseDetail();
  }
  function gamesDetailStep(dir) {
    var tiles = document.querySelectorAll("#games-row .game-tile");
    var vis = [];
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i].style.display !== "none") vis.push(parseInt(tiles[i].getAttribute("data-idx"), 10));
    }
    if (!vis.length) return;
    var pos = vis.indexOf(gamesDetailIndex);
    pos = (pos === -1) ? 0 : (pos + dir + vis.length) % vis.length;
    gamesPopulateDetail(vis[pos]);
  }

  // ----- screenshot lightbox (full-screen viewer with prev/next) -----
  // items: array of { url, name } — the name shows as a caption under the single screenshot
  var lbItems = [], lbIndex = 0;
  function lightboxRender() {
    var it = lbItems[lbIndex];
    if (!it) return;
    var img = document.getElementById("lb-img");
    if (img) img.src = it.url;
    var cap = document.getElementById("lb-caption");
    if (cap) cap.textContent = it.name || "";
  }
  function lightboxOpen(items, idx) {
    if (!items || !items.length) return;
    lbItems = items;
    lbIndex = idx || 0;
    lightboxRender();
    var lb = document.getElementById("gd-lightbox");
    if (lb) lb.classList.add("show");
    var s = document.querySelector("#games .games-screen");
    if (s) s.classList.add("show-lightbox");
  }
  function lightboxClose() {
    var lb = document.getElementById("gd-lightbox");
    if (lb) lb.classList.remove("show");
    var s = document.querySelector("#games .games-screen");
    if (s) s.classList.remove("show-lightbox");
  }
  function lightboxStep(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    lightboxRender();
  }
  function lightboxBackdrop(e) {
    // close when the dark area (not the image or arrows) is clicked
    if (e.target && e.target.id === "gd-lightbox") lightboxClose();
  }
  document.addEventListener("keydown", function(e) {
    var lb = document.getElementById("gd-lightbox");
    if (!lb || !lb.classList.contains("show")) return;
    if (e.key === "Escape") lightboxClose();
    else if (e.key === "ArrowLeft") lightboxStep(-1);
    else if (e.key === "ArrowRight") lightboxStep(1);
  });

  window.addEventListener("load", function() {
    var row = document.getElementById("games-row");
    if (!row) return;

    // build game tiles
    for (var i = 0; i < GAMES.length; i++) {
      (function(idx) {
        var g = GAMES[idx];
        var tile = document.createElement("div");
        tile.className = "game-tile";
        tile.setAttribute("data-tags", g.status);
        tile.setAttribute("data-idx", idx);
        tile.innerHTML =
          "<img src='" + gameThumb(g) + "' alt='" + esc(g.name) + "'>" +
          "<span class='game-label'><span class='game-label-text'>" + esc(g.name) + "</span></span>";
        tile.addEventListener("click", function() { gamesOpenDetail(idx); });
        row.appendChild(tile);
      })(i);
    }

    // build the bottom nav (home / gallery / news / shop)
    var navbar = document.getElementById("games-nav");
    for (var f = 0; f < GAME_NAV.length; f++) {
      (function(item) {
        var btn = document.createElement("button");
        btn.className = "games-nav-btn" + (item.view === "home" ? " is-active" : "");
        btn.setAttribute("data-view", item.view);
        btn.innerHTML = "<i class='fa-solid " + item.icon + "'></i>" +
          "<span class='games-nav-label'>" + item.label + "</span>";
        btn.addEventListener("click", function() { gamesShowView(item.view); });
        navbar.appendChild(btn);
      })(GAME_NAV[f]);
    }

    // gallery: every screenshot across all games (discovered from each game's folder)
    var galleryGrid = document.getElementById("gallery-grid");
    var galleryItems = []; // flat list of { url, name }, in display order, for the lightbox
    if (galleryGrid) {
      var found = [];          // found[order] = { name, urls } — keeps game order stable
      var pending = GAMES.length;
      var renderGallery = function() {
        galleryItems = [];
        for (var i = 0; i < found.length; i++) {
          var c = found[i];
          if (!c) continue;
          for (var s = 0; s < c.urls.length; s++) galleryItems.push({ url: c.urls[s], name: c.name });
        }
        if (!galleryItems.length) {
          galleryGrid.innerHTML = "<p class='gallery-empty'>No screenshots yet, check back later for updates.</p>";
          return;
        }
        // round each tile's corner only where it has no neighbor across either edge forming it (3-col grid)
        var N = galleryItems.length, R = "8px";
        var shotHtml = "";
        for (var k = 0; k < N; k++) {
          var col = k % 3;
          var hasLeft = col > 0, hasRight = col < 2 && k + 1 < N, hasAbove = k - 3 >= 0, hasBelow = k + 3 < N;
          var tl = (!hasAbove && !hasLeft) ? R : "0";
          var tr = (!hasAbove && !hasRight) ? R : "0";
          var br = (!hasBelow && !hasRight) ? R : "0";
          var bl = (!hasBelow && !hasLeft) ? R : "0";
          shotHtml += "<div class='gallery-shot' data-i='" + k + "'>" +
              "<img src='" + galleryItems[k].url + "' alt='" + esc(galleryItems[k].name) +
              "' style='border-radius:" + tl + " " + tr + " " + br + " " + bl + "'>" +
            "</div>";
        }
        galleryGrid.innerHTML = shotHtml;
      };
      for (var gi = 0; gi < GAMES.length; gi++) {
        (function(order) {
          discoverShots(GAMES[order], function(urls) {
            found[order] = { name: GAMES[order].name, urls: urls };
            if (--pending === 0) renderGallery();
          });
        })(gi);
      }
      // click a gallery screenshot -> open the lightbox at that image (name shown as caption)
      galleryGrid.addEventListener("click", function(e) {
        var cell = e.target.closest && e.target.closest(".gallery-shot");
        if (cell && cell.hasAttribute("data-i")) lightboxOpen(galleryItems, parseInt(cell.getAttribute("data-i"), 10));
      });
    }


    // news / blog
    var newsList = document.getElementById("news-list");
    if (newsList) {
      var newsHtml = "";
      for (var n = 0; n < NEWS.length; n++) {
        newsHtml +=
          "<div class='news-item'>" +
            "<p class='news-date'>" + NEWS[n].date + "</p>" +
            "<p class='news-title'>" + NEWS[n].title + "</p>" +
            "<p class='news-text'>" + NEWS[n].body + "</p>" +
          "</div>";
      }
      newsList.innerHTML = newsHtml;
    }


    var gpSub = document.getElementById("gp-sub");
    if (gpSub) gpSub.textContent = "updated 06.10.26";

    // build the profile play list — every game, sorted by hours
    var gpList = document.getElementById("gp-list");
    if (gpList) {
      var act = GAMES.slice().sort(function(a, b) { return (b.hours || 0) - (a.hours || 0); }).slice(0, 10);
      var maxH = (act[0] && act[0].hours) || 1;
      var html = "";
      for (var a = 0; a < act.length; a++) {
        var g = act[a];
        var w = Math.max(3, Math.round((g.hours / maxH) * 100));
        html +=
          "<div class='gp-row'>" +
            "<img src='" + gameThumb(g) + "' alt='" + esc(g.name) + "'>" +
            "<div class='gp-row-main'>" +
              "<div class='gp-row-top'><span class='gp-row-name'>" + esc(g.name) + "</span>" +
              "<span class='gp-row-hrs'>" + g.hours + "</span></div>" +
              "<div class='gp-bar'><span style='width:" + w + "%'></span></div>" +
            "</div>" +
          "</div>";
      }
      gpList.innerHTML = html;
    }

    // JS-managed hover: tracks the tile under the cursor, snaps to the closest tile
    // while within the thumbnails' vertical band, and stays correct while scrolling.
    var ROW_VPAD = 28; // matches .games-row vertical padding
    var hoverX = null, hoverY = null;
    function gamesSetHover() {
      var all = row.querySelectorAll(".game-tile");
      var target = null;
      if (hoverX !== null) {
        var rr = row.getBoundingClientRect();
        if (hoverY >= rr.top + ROW_VPAD && hoverY <= rr.bottom - ROW_VPAD) {
          var bestDist = Infinity;
          for (var i = 0; i < all.length; i++) {
            if (all[i].style.display === "none") continue;
            var r = all[i].getBoundingClientRect();
            var dx = hoverX < r.left ? r.left - hoverX : (hoverX > r.right ? hoverX - r.right : 0);
            if (dx < bestDist) { bestDist = dx; target = all[i]; }
          }
        }
      }
      for (var j = 0; j < all.length; j++) all[j].classList.toggle("is-hover", all[j] === target);
      row.classList.toggle("has-hover", !!target);
      if (target && !target._mqChecked) gamesCheckMarquee(target);
    }

    // marquee-scroll the title only when it's wider than the thumbnail
    function gamesCheckMarquee(tile) {
      var label = tile.querySelector(".game-label");
      var text = tile.querySelector(".game-label-text");
      if (!label || !text) return;
      var single = text.scrollWidth;
      if (single - label.clientWidth > 2) {
        var gap = 30; // must match the gap in .game-label.is-marquee .game-label-text
        var name = text.textContent;
        // duplicate the title so it can loop seamlessly in one direction
        text.innerHTML = "<span class='gl-seg'>" + name + "</span><span class='gl-seg'>" + name + "</span>";
        label.classList.add("is-marquee");
        label.style.setProperty("--marquee-shift", -(single + gap) + "px");
        label.style.setProperty("--marquee-dur", Math.max(3, (single + gap) / 24).toFixed(1) + "s");
      } else {
        label.classList.remove("is-marquee");
      }
      tile._mqChecked = true;
    }
    row.addEventListener("mousemove", function(e) { if (panning) return; hoverX = e.clientX; hoverY = e.clientY; gamesSetHover(); });
    row.addEventListener("mouseleave", function() { hoverX = hoverY = null; gamesSetHover(); });
    row.addEventListener("scroll", function() { if (!panning) gamesSetHover(); });

    // vertical wheel scrolls the row horizontally (hover re-evaluates via the scroll handler)
    row.addEventListener("wheel", function(e) {
      if (e.deltaY === 0) return;
      e.preventDefault();
      hoverX = e.clientX; hoverY = e.clientY;
      row.scrollLeft += e.deltaY * 0.6; // dial down the wheel sensitivity a bit
    }, { passive: false });

    // click-drag to pan the row horizontally — works anywhere on the screen (not just the tiles),
    // with velocity-based momentum on release so it glides to a stop instead of snapping.
    var screenEl = document.querySelector("#games .games-screen");
    var panEl = screenEl || row;
    var dragActive = false, dragStartX = 0, dragStartScroll = 0, dragMoved = false, panning = false;
    var lastX = 0, lastT = 0, velocity = 0, momentumId = null;
    function stopMomentum() {
      if (momentumId) { cancelAnimationFrame(momentumId); momentumId = null; }
    }
    panEl.addEventListener("mousedown", function(e) {
      if (e.button !== 0) return;
      // only pan while the game-log (home) view is showing and no detail/lightbox modal is open
      if (screenEl && screenEl.getAttribute("data-view") !== "home") return;
      if (screenEl && (screenEl.classList.contains("show-detail") || screenEl.classList.contains("show-lightbox"))) return;
      stopMomentum();
      dragActive = true; dragMoved = false; panning = true;
      dragStartX = lastX = e.clientX;
      dragStartScroll = row.scrollLeft;
      lastT = performance.now(); velocity = 0;
      hoverX = hoverY = null; gamesSetHover(); // drop the hover lift so the pan stays smooth
    });
    document.addEventListener("mousemove", function(e) {
      if (!dragActive) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 3) dragMoved = true;
      if (!dragMoved) return;
      row.scrollLeft = dragStartScroll - dx;
      var now = performance.now(), dt = now - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt; // px per ms
      lastX = e.clientX; lastT = now;
      e.preventDefault(); // suppress text/image selection while panning
    });
    document.addEventListener("mouseup", function() {
      if (!dragActive) return;
      dragActive = false;
      if (dragMoved && Math.abs(velocity) > 0.03) {
        var v = velocity * 16; // px per ~16ms frame
        var step = function() {
          v *= 0.94; // friction
          row.scrollLeft -= v;
          if (Math.abs(v) > 0.4) { momentumId = requestAnimationFrame(step); }
          else { momentumId = null; panning = false; gamesSetHover(); }
        };
        momentumId = requestAnimationFrame(step);
      } else {
        panning = false;
      }
    });
    // swallow the click that ends a real drag so it doesn't open a game / trigger a control
    panEl.addEventListener("click", function(e) {
      if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; }
    }, true);

    // live clock
    function gamesUpdateClock() {
      var el = document.getElementById("games-clock");
      if (!el) return;
      el.textContent = new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    gamesUpdateClock();
    setInterval(gamesUpdateClock, 15000);
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