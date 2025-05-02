function openAbout() {
  document.getElementById("about").style.display = "block";
  document.getElementById("members").style.display = "none";
  document.getElementById("join").style.display = "none";
}

function populateMembers() {
  for(var i = 0; i < members.length; i++){
    document.getElementById("members-table").innerHTML+= "<div class='member'><img src='"+members[i].img+"'><p>"+members[i].name+"</p><a href='"+members[i].url+"' target='_blank'><p>"+members[i].url+"</p></a></div>";
;
  }
  console.log(members.name);
  console.log(webring.sites);
}
