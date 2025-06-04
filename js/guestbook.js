var msgLoad = false;
var form = document.getElementById("guestbooks___guestbook-form");
var messagesContainer = document.getElementById(
  "guestbooks___guestbook-messages-container"
);

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  var formData = new FormData(form);
  const response = await fetch(form.action, {
    method: "POST",
    body: formData,
  });

  let errorContainer = document.querySelector("#guestbooks___error-message");
  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.id = "guestbooks___error-message";
    const submitButton = document.querySelector("#guestbooks___guestbook-form input[type='submit']");
    submitButton.insertAdjacentElement('afterend', errorContainer);
  }

  if (response.ok) {
    form.reset();
    guestbooks___loadMessages(1);
    errorContainer.innerHTML = "";
  } else {
    const err = await response.text();
    console.error("Error:", err);
    if (response.status === 401) {
      errorContainer.innerHTML = "";
    } else {
      errorContainer.innerHTML = err;
    }
  }
});

function guestbooks___populateQuestionChallenge() {
  const challengeQuestion = "";
  const challengeHint = "";

  if (challengeQuestion.trim().length === 0) {
    return;
  }

  let challengeContainer = document.querySelector("#guestbooks___challenge-answer-container") || document.querySelector("#guestbooks___challenge—answer—container")

  // Add challenge question to the form if
  if (!challengeContainer) {
    challengeContainer = document.createElement("div");
    challengeContainer.id = "guestbooks___challenge-answer-container";
    const websiteInput = document.querySelector("#guestbooks___guestbook-form #website").parentElement;
    websiteInput.insertAdjacentElement('afterend', challengeContainer);
  }

  challengeContainer.innerHTML = `
    <br>
    <div class="guestbooks___input-container">
        <label for="challengeQuestionAnswer">${challengeQuestion}</label> <br>
        <input placeholder="${challengeHint}" type="text" id="challengeQuestionAnswer" name="challengeQuestionAnswer" required>
    </div>
    `;
}

function guestbooks___loadMessages(page) {
  var perPage = 15;
    var apiUrl =
    "https://guestbooks.meadow.cafe/api/v1/get-guestbook-messages/508";
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (messages) {

if(msgLoad == false){
      for (var p = 1; p < Math.ceil(messages.length / perPage) + 1; p++) {
        document.getElementById("guestbook-pages").innerHTML += "<p class='' onclick='guestbooks___loadMessages(" + p + ")' id='" + p + "'>" + p + "</p>";
      }
      document.getElementById('1').classList.add('gb-active-page');
      msgLoad = true;
    }

      if (messages.length === 0) {
        messagesContainer.innerHTML = "<p>There are no messages on this guestbook.</p>";
      } else {
        messages.sort(function (a, b) {
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        });
        if(page == null){
          rangeStart = 0;
          rangeEnd = perPage;
        } else{
          document.getElementById("guestbook").scrollTo(0, 0);

          rangeStart = (page-1)*perPage;
          rangeEnd = (page-1)*perPage+perPage-1;
          console.log("test");
          for(var a = 1; a < Math.ceil(messages.length / perPage)+1; a++){
            document.getElementById(a).classList.remove('gb-active-page');
          }
          document.getElementById(page).classList.add('gb-active-page');
        }

        if(rangeEnd > messages.length){
          rangeEnd = messages.length;
        }
        messagesContainer.innerHTML = "";
        for (var i = rangeStart; i < rangeEnd; i++) {
          var messageContainer = document.createElement("div");
          var messageHeader = document.createElement("p");
          var boldElement = document.createElement("b");

          // add name with website (if present)
          if (messages[i].Website) {
            var link = document.createElement("a");
            link.href = messages[i].Website ? messages[i].Website : "#";
            link.textContent = messages[i].Name;
            link.target = "_blank";
            boldElement.appendChild(link);
          } else {
            var textNode = document.createTextNode(messages[i].Name);
            boldElement.appendChild(textNode);
          }
          messageHeader.appendChild(boldElement);

          // add date
          var createdAt = new Date(messages[i].CreatedAt);
          var formattedDate = createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          var dateElement = document.createElement("small");
          dateElement.textContent = " - " + formattedDate;
          messageHeader.appendChild(dateElement);

          // add actual quote
          var messageBody = document.createElement("blockquote");
          messageBody.textContent = messages[i].Text;

          messageContainer.appendChild(messageHeader);
          messageContainer.appendChild(messageBody);

          messagesContainer.appendChild(messageContainer);
        }

        // document.getElementById("guestbook-pages").innerHTML = "";
        // for (var p = 1; p < Math.ceil(messages.length / perPage) + 1; p++) {
        //   document.getElementById("guestbook-pages").innerHTML += "<p class='' onclick='guestbooks___loadMessages(" + p + ")' id='" + p + "'>" + p + "</p>";
        // }
      }
    })
    .catch(function (error) {
      console.error("Error fetching messages:", error);
    });
}
guestbooks___populateQuestionChallenge();
guestbooks___loadMessages();
