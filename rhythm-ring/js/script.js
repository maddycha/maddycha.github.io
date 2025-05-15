function openPage(x) {
  document.getElementById("aboutpage").style.display = "none";
  document.getElementById("joinpage").style.display = "none";
  document.getElementById("widgetpage").style.display = "none";
  document.getElementById("memberspage").style.display = "none";
  document.getElementById(x.id).style.display = "block";
  if(x.id == "aboutpage"){
    document.getElementById("about-button").src = "imgs/misc/about-pressed.png";
    document.getElementById("join-button").src = "imgs/misc/join.png";
    document.getElementById("widget-button").src = "imgs/misc/widget.png";
    document.getElementById("members-button").src = "imgs/misc/members.png";
  }
  else if(x.id == "joinpage"){
    document.getElementById("about-button").src = "imgs/misc/about.png";
    document.getElementById("join-button").src = "imgs/misc/join-pressed.png";
    document.getElementById("widget-button").src = "imgs/misc/widget.png";
    document.getElementById("members-button").src = "imgs/misc/members.png";
  } else if(x.id == "widgetpage"){
    document.getElementById("about-button").src = "imgs/misc/about.png";
    document.getElementById("join-button").src = "imgs/misc/join.png";
    document.getElementById("widget-button").src = "imgs/misc/widget-pressed.png";
    document.getElementById("members-button").src = "imgs/misc/members.png";
  } else if(x.id == "memberspage"){
    document.getElementById("about-button").src = "imgs/misc/about.png";
    document.getElementById("join-button").src = "imgs/misc/join.png";
    document.getElementById("widget-button").src = "imgs/misc/widget.png";
    document.getElementById("members-button").src = "imgs/misc/members-pressed.png";
    }
}

  var audio = document.getElementById("title-song");
  audio.volume = 0.2;


function populateMembers() {
  for(var i = 0; i < members.length; i++){
    document.getElementById("members-table").innerHTML+= "<div class='member'><img src='imgs/icons/"+members[i].img+"'><p>"+members[i].name+"</p><a href='"+members[i].url+"' target='_blank'><p>[website]</p></a></div>";
;
  }
  console.log(members.name);
  console.log(webring.sites);
}
