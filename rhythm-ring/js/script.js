function openPage(x) {
  document.getElementById("aboutpage").style.display = "none";
  document.getElementById("joinpage").style.display = "none";
  document.getElementById("widgetpage").style.display = "none";
  document.getElementById("memberspage").style.display = "none";
  document.getElementById(x.id).style.display = "block";
  if(x.id == "aboutpage"){
    console.log("about");
  }
  // else if(x.id == "joinpage"){
  //   console.log("members");
  // } else if(x.id == "widgetpage"){
  //   console.log("members");
  // } else if(x.id == "memberspage"){
  //   console.log("members");
  // }
}

function populateMembers() {
  for(var i = 0; i < members.length; i++){
    // document.getElementById("members-table").innerHTML+= "<div class='member'><img src='"+members[i].img+"'><p>"+members[i].name+"</p><a href='"+members[i].url+"' target='_blank'><p>"+members[i].url+"</p></a></div>";
;
  }
  console.log(members.name);
  console.log(webring.sites);
}
