// // ===== BUTTON WALL =====
// // To add a button: add { url, img } below. Images go in imgs/buttons/
// var buttons = [
//   { url: "https://tamanotchi.world/", img: "tamanotchi.gif" },
//   { url: "https://forum.melonland.net/", img: "melonland.gif" },
//   { url: "https://discourse.32bit.cafe/", img: "32bitcafe.png" },
//   { url: "https://districts.nekoweb.org/index.html", img: "districts.png" },
//   { url: "https://snewdraws.net", img: "snewdraws.gif" },
//   { url: "https://dog-house.neocities.org/", img: "dog-house.gif" },
//   { url: "https://ribo.zone", img: "ribozone.png" },
//   { url: "https://helveticablanc.com/index.html", img: "helveticablanc.gif" },
//   { url: "https://lazybones.neocities.org/", img: "lazybones.png" },
//   { url: "https://amalinalai.github.io/precipice/", img: "amalinalai.gif" },
//   { url: "https://amfmradio.nekoweb.org/", img: "amfmradio.png" },
//   { url: "https://sweetfish.site/", img: "sweetfish.png" },
//   { url: "https://coils.neocities.org/", img: "coils.png" },
//   { url: "https://plumes.neocities.org/", img: "plumes.gif" },
//   { url: "https://humanfinny.neocities.org/", img: "humanfinny.jpg" },
//   { url: "https://lostletters.neocities.org/", img: "lostletters.gif" },
//   { url: "https://ghostingpen.neocities.org/", img: "ghostingpen.gif" },
//   { url: "https://sixey.es/", img: "sixeyes.gif" },
//   { url: "https://daisy.nekoweb.org/", img: "daisy.gif" },
//   { url: "https://july.lol/", img: "july.gif" },
//   { url: "http://sugarstarluxe.neocities.org/", img: "sugarstarluxe.gif" },
//   { url: "http://pameluft.neocities.org/", img: "pameluft.gif" },
//   { url: "http://jeith.com/", img: "jeith.gif" },
//   { url: "https://rice.place/", img: "riceplace.png" },
//   { url: "https://felixfever.nekoweb.org/", img: "felixfever.gif" },
//   { url: "https://harlequi.nz/", img: "harlequinz.png" },
//   { url: "https://freakphone.net/", img: "freakphone.gif" },
//   { url: "https://faegardens333.neocities.org/", img: "faegardens.gif" },
//   { url: "https://lovesick.cafe/", img: "lovesick.png" },
//   { url: "https://wasongo.art/", img: "wasongo.gif" },
//   { url: "http://fawn.nekoweb.org/", img: "fawn.png" },
//   { url: "https://cheapycore.com/", img: "cheapycore.gif" },
//   { url: "https://gspace48.neocities.org/", img: "gspace48.gif" },
//   { url: "https://cinni.net/", img: "cinni.gif" },
//   { url: "https://piranhebula.neocities.org/", img: "piranhebula.gif" },
//   { url: "https://caitsith.neocities.org/", img: "caitsith.gif" },
//   { url: "https://roboticoperatingbuddy.neocities.org/home", img: "roboticoperatingbuddy.png" },
//   { url: "https://peachnuts.neocities.org/", img: "peachnuts.gif" },
//   { url: "https://meyr0s3.neocities.org/", img: "dreams.gif" },
//   { url: "https://nukochannel.neocities.org/", img: "nukochannel.gif" },
//   { url: "https://unicodeangel.neocities.org/", img: "unicodeangel.gif" },
//   { url: "https://nonkiru.art/", img: "nonkiru.gif" },
// ];

// window.addEventListener("load", function () {
//   var html = "";
//   for (var i = 0; i < buttons.length; i++) {
//     html += "<a href='" + buttons[i].url + "'><img src='imgs/buttons/" + buttons[i].img + "' alt='" + buttons[i].img + "'></a>";
//   }
//   document.getElementById('buttons').innerHTML = html;
// });

// ===== ART GALLERY =====
// To add art: increment artNum and add the image as imgs/art/{number}.png
var artNum = 25;
var art = [];
var active = artNum;

window.addEventListener("load", function () {
  var html = "";
  for (var i = 0; i < artNum; i++) {
    art.push("imgs/art/" + i + ".png");
    html = "<img onclick='artUpdate(" + i + ");' class='art' id='art-" + i + "' src='" + art[i] + "'>" + html;
  }
  document.getElementById('gallery').innerHTML = html + "<div class='clear'></div>";
  artUpdate(artNum-1);

  

  setTimeout(function() { openWindow(w0); }, 200);
    setTimeout(function() { updateZOrder(w0); }, 200);

});

function artUpdate(x) {
  document.getElementById("preview-img").src = art[x];
  document.getElementById("preview-bg").src = art[x];
  for (var i = 0; i < artNum; i++) {
    var el = document.getElementById("art-" + i);
    el.style.border = (i === x) ? "solid 1px var(--primary)" : "dotted 1px var(--primary)";
    el.style.opacity = (i === x) ? "1" : "0.3";
  }
  active = x;
}


function artForward(){
  if(active == 0){
    artUpdate(artNum-1);
  } else{
  artUpdate(active-1);
  }
}

function artPrevious(){
  if(active == artNum-1){
    artUpdate(0);
  } else{
  artUpdate(active+1);
  }
}