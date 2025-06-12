//linksPage
window.addEventListener("load", function buttonsLoad() {

  var buttons = [];
buttons.push({url:"https://tamanotchi.world/", img:"tamanotchi.gif"});
buttons.push({url:"https://forum.melonland.net/", img:"melonland.gif"});
buttons.push({url:"https://discourse.32bit.cafe/", img:"32bitcafe.png"});
buttons.push({url:"https://districts.nekoweb.org/index.html", img:"districts.png"});
buttons.push({url:"https://snewdraws.net", img:"snewdraws.gif"});
buttons.push({url:"https://dog-house.neocities.org/", img:"dog-house.gif"});
buttons.push({url:"https://ribo.zone", img:"ribozone.png"});
buttons.push({url:"https://helveticablanc.com/index.html", img:"helveticablanc.gif"});
buttons.push({url:"https://lazybones.neocities.org/", img:"lazybones.png"});
buttons.push({url:"https://amalinalai.github.io/precipice/", img:"amalinalai.gif"});
buttons.push({url:"https://amfmradio.nekoweb.org/", img:"amfmradio.png"});
buttons.push({url:"https://sweetfish.site/", img:"sweetfish.png"});
buttons.push({url:"https://coils.neocities.org/", img:"coils.png"});
buttons.push({url:"https://plumes.neocities.org/", img:"plumes.gif"});
buttons.push({url:"https://humanfinny.neocities.org/", img:"humanfinny.jpg"});
buttons.push({url:"https://lostletters.neocities.org/", img:"lostletters.gif"});
buttons.push({url:"https://ghostingpen.neocities.org/", img:"ghostingpen.gif"});
buttons.push({url:"https://sixey.es/", img:"sixeyes.gif"});
buttons.push({url:"https://daisy.nekoweb.org/", img:"daisy.gif"});
buttons.push({url:"https://july.lol/", img:"july.gif"});
buttons.push({url:"http://sugarstarluxe.neocities.org/", img:"sugarstarluxe.gif"});
buttons.push({url:"http://pameluft.neocities.org/", img:"pameluft.gif"});
buttons.push({url:"http://jeith.com/", img:"jeith.gif"});
buttons.push({url:"https://rice.place/", img:"riceplace.png"});
buttons.push({url:"https://felixfever.nekoweb.org/", img:"felixfever.gif"});
buttons.push({url:"https://harlequi.nz/", img:"harlequinz.png"});
buttons.push({url:"https://freakphone.net/", img:"freakphone.gif"});
buttons.push({url:"https://faegardens333.neocities.org/", img:"faegardens.gif"});
buttons.push({url:"https://lovesick.cafe/", img:"lovesick.png"});
buttons.push({url:"https://wasongo.art/", img:"wasongo.gif"});
buttons.push({url:"http://fawn.nekoweb.org/", img:"fawn.png"});
buttons.push({url:"https://cheapycore.com/", img:"cheapycore.gif"});
buttons.push({url:"https://gspace48.neocities.org/", img:"gspace48.gif"});
buttons.push({url:"https://cinni.net/", img:"cinni.gif"});
buttons.push({url:"https://piranhebula.neocities.org/", img:"piranhebula.gif"});
buttons.push({url:"https://caitsith.neocities.org/", img:"caitsith.gif"});
buttons.push({url:"https://roboticoperatingbuddy.neocities.org/home", img:"roboticoperatingbuddy.png"});
buttons.push({url:"https://peachnuts.neocities.org/", img:"peachnuts.gif"});
buttons.push({url:"https://meyr0s3.neocities.org/", img:"dreams.gif"});
buttons.push({url:"https://nukochannel.neocities.org/", img:"nukochannel.gif"});
buttons.push({url:"https://unicodeangel.neocities.org/", img:"unicodeangel.gif"});
buttons.push({url:"https://nonkiru.art/", img:"nonkiru.gif"});
// buttons.push({url:"", img:""});
// buttons.push({url:"", img:""});

  for (var i = 0; i < buttons.length; i++) {
    document.getElementById('buttons').innerHTML += "<a href='" + buttons[i].url + "'><img src='imgs/buttons/" + buttons[i].img + "' alt='" + buttons[i].img + "'></a>";
  }
});
//artPage
var art = [];
var artNum = 24;

window.addEventListener("load", function artLoad() {
  for (var i = 0; i < artNum; i++) {
    art.push("imgs/art/" + i + ".png");
    document.getElementById('gallery').innerHTML = "<div class='artimg' onclick='artUpdate(" + i + ");'><img class='artimg-img' id='artimg-" + i + "' src='" + art[i] + "'></div>" + document.getElementById('gallery').innerHTML;
  }
  document.getElementById('gallery').innerHTML += "<div class='clear'></div>";
});

function artUpdate(x) {
  var selected = "artimg-" + x;
  document.getElementById("preview-img").src = art[x];
  for (var i = 0; i < artNum; i++) {
    var notselected = "artimg-" + i;
    document.getElementById(notselected).style.border = "dotted 1px var(--primary)";
    document.getElementById(notselected).style.opacity = "0.4";
  }
  document.getElementById(selected).style.border = "solid 1px var(--primary)";
  document.getElementById(selected).style.opacity = "1";
}

//dressupPage
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


// window.addEventListener("load", function dressup() {

//   for (var i = 1; i < topsBrands.length + 1; i++) {
//     var b = i - 1;
//     tops.push("imgs/items/t" + i + ".png");
//     document.getElementById('tops').innerHTML += "<div class='item' onclick='topsUpdate(" + b + ");'><h2 class='number'>0" + i + "</h2><p class='brand' id='" + b + "-topsbrand'>" + topsBrands[i - 1] + "</p>";
//   }

//   for (var i = 1; i < bottomsBrands.length + 1; i++) {
//     var b = i - 1;
//     bottoms.push("imgs/items/b" + i + ".png");
//     document.getElementById('bottoms').innerHTML += "<div class='item' onclick='bottomsUpdate(" + b + ");'><h2 class='number'>0" + i + "</h2><p class='brand' id='" + b + "-bottomsbrand'>" + bottomsBrands[i - 1] + "</p>";
//   }

//   for (var i = 1; i < shoesBrands.length + 1; i++) {
//     var b = i - 1;
//     shoes.push("imgs/items/s" + i + ".png");
//     document.getElementById('shoes').innerHTML += "<div class='item' onclick='shoesUpdate(" + b + ");'><h2 class='number'>0" + i + "</h2><p class='brand' id='" + b + "-shoesbrand'>" + shoesBrands[i - 1] + "</p>";
//   }

//   document.getElementById(String(0 + "-topsbrand")).style.textTransform = "uppercase";
//   document.getElementById(String(0 + "-topsbrand")).style.fontStyle = "italic";

//   document.getElementById(String(0 + "-bottomsbrand")).style.textTransform = "uppercase";
//   document.getElementById(String(0 + "-bottomsbrand")).style.fontStyle = "italic";

//   document.getElementById(String(0 + "-shoesbrand")).style.textTransform = "uppercase";
//   document.getElementById(String(0 + "-shoesbrand")).style.fontStyle = "italic";
// });




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


//status.cafe
const feedURL = 'https://status.cafe/users/maddy.atom'

      fetch(feedURL)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
          const entries = data.querySelectorAll("entry");
          let html = ``;

          for (i = 0; i < 1; i++) {
            let title = entries[i].querySelector("title").innerHTML.slice(0, 5).trim();
            let content = entries[i].querySelector("content").textContent.trim();
            let dateString = entries[i].querySelector("published").innerHTML.slice(5,10);
            html += `
            <div class='status-entry'>
              <div class='status-content'>${content}</div>
              <h2 style='padding-left: 16px;'>${dateString}</h2>
              </div>
            `;
          }
          document.getElementById("feed-reader").innerHTML = html;
        })
