var currentPage = 1;
var totalPages = 1;
const perPage = 15;
var form = document.getElementById("guestbooks___guestbook-form");
var messagesContainer = document.getElementById(
  "guestbooks___guestbook-messages-container"
);

var guestbookPowReady = false;

function updateGuestbookSubmit() {
  var nameVal = document.getElementById("nameinput").value.trim();
  var msgVal = document.getElementById("messageinput").value.trim();
  var submitBtn = form.querySelector("input[type='submit']");
  submitBtn.disabled = !(nameVal && msgVal && guestbookPowReady);
}

document.getElementById("nameinput").addEventListener("input", updateGuestbookSubmit);
document.getElementById("messageinput").addEventListener("input", updateGuestbookSubmit);

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

var isLoadingMessages = false;
var allMessagesLoaded = false;

function guestbooks___loadMessages(page, append) {
  if (isLoadingMessages) return;
  if (page) {
    currentPage = page;
  }
  if (!append) {
    allMessagesLoaded = false;
  }
  isLoadingMessages = true;

  var apiUrl =
    "https://guestbooks.meadow.cafe/api/v2/get-guestbook-messages/508?page=" + currentPage + "&limit=" + perPage;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var messages = data.messages || [];
      var pagination = data.pagination || {};

      totalPages = pagination.totalPages || 1;

      if (messages.length === 0 && !append) {
        messagesContainer.innerHTML = "<p>There are no messages on this guestbook.</p>";
      } else {
        if (!append) {
          messagesContainer.innerHTML = "";
        }

        messages.forEach(function (message, index) {
          var messageContainer = document.createElement("div");
          messageContainer.style.opacity = "0";
          messageContainer.style.animation = "noteIn 0.4s ease forwards";
          messageContainer.style.animationDelay = (index * 0.06) + "s";

          var messageHeader = document.createElement("div");
          messageHeader.style.display = "flex";
          messageHeader.style.justifyContent = "space-between";
          messageHeader.style.alignItems = "baseline";

          var nameElement = document.createElement("h3");
          if (message.Website) {
            var link = document.createElement("a");
            link.href = message.Website ? message.Website : "#";
            link.textContent = message.Name;
            link.target = "_blank";
            nameElement.appendChild(link);
          } else {
            nameElement.textContent = message.Name;
          }
          messageHeader.appendChild(nameElement);

          var createdAt = new Date(message.CreatedAt);
          var mm = String(createdAt.getMonth() + 1).padStart(2, "0");
          var dd = String(createdAt.getDate()).padStart(2, "0");
          var yy = String(createdAt.getFullYear()).slice(-2);

          var dateElement = document.createElement("small");
          dateElement.textContent = mm + "." + dd + "." + yy;
          messageHeader.appendChild(dateElement);
          messageContainer.appendChild(messageHeader);

          var messageBody = document.createElement("blockquote");
          messageBody.style.paddingTop = "8px";
          messageBody.textContent = message.Text;

          messageContainer.appendChild(messageBody);

          messagesContainer.appendChild(messageContainer);
        });
      }

      if (currentPage >= totalPages) {
        allMessagesLoaded = true;
      }
      isLoadingMessages = false;
    })
    .catch(function (error) {
      console.error("Error fetching messages:", error);
      isLoadingMessages = false;
    });
}

document.getElementById("guestbook").addEventListener("scroll", function () {
  var el = this;
  if (!isLoadingMessages && !allMessagesLoaded &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 150) {
    currentPage++;
    guestbooks___loadMessages(currentPage, true);
  }
});

guestbooks___populateQuestionChallenge();
guestbooks___loadMessages();


// ---- Proof of Work Bot Deterrent ----
  
  (function() {
    var powChallenge = "";
    var powNonce = "";
    var powReady = false;
    var powWorker = null;

    var submitBtn = form.querySelector("input[type='submit'], button[type='submit']");
    submitBtn.disabled = true;

    // Build the verification UI: checkbox with inline label
    var powContainer = document.getElementById("guestbooks___pow-status");
    if (!powContainer) {
      powContainer = document.createElement("div");
      submitBtn.parentNode.insertBefore(powContainer, submitBtn);
    }
    powContainer.id = "guestbooks___pow-container";
    powContainer.className = "guestbooks___pow-container";
    powContainer.innerHTML = "";

    var powLabel = document.createElement("label");
    powLabel.className = "guestbooks___pow-checkbox-label";

    var powCheckbox = document.createElement("input");
    powCheckbox.type = "checkbox";
    powCheckbox.id = "guestbooks___pow-checkbox";

    var powLabelText = document.createElement("span");
    powLabelText.id = "guestbooks___pow-status";
    powLabelText.textContent = "I\u2019m not a robot";

    powLabel.appendChild(powCheckbox);
    powLabel.appendChild(powLabelText);
    powContainer.appendChild(powLabel);

    // Add hidden fields to carry the PoW data
    var hiddenChallenge = document.createElement("input");
    hiddenChallenge.type = "hidden";
    hiddenChallenge.name = "powChallenge";
    form.appendChild(hiddenChallenge);

    var hiddenNonce = document.createElement("input");
    hiddenNonce.type = "hidden";
    hiddenNonce.name = "powNonce";
    form.appendChild(hiddenNonce);

    // Web Worker code for SHA-256 mining using SubtleCrypto
    var workerCode = `
      self.onmessage = async function(e) {
        var challenge = e.data.challenge;
        var difficulty = e.data.difficulty;
        var batchSize = 5000;
        var nonce = 0;

        while (true) {
          for (var i = 0; i < batchSize; i++) {
            var nonceHex = nonce.toString(16);
            var input = challenge + nonceHex;
            var encoded = new TextEncoder().encode(input);
            var hashBuf = await crypto.subtle.digest("SHA-256", encoded);
            var hashArr = new Uint8Array(hashBuf);

            if (hasLeadingZeroBits(hashArr, difficulty)) {
              self.postMessage({ found: true, nonce: nonceHex, hashes: nonce + 1 });
              return;
            }
            nonce++;
          }
          self.postMessage({ found: false, hashes: nonce });
        }
      };

      function hasLeadingZeroBits(data, n) {
        var fullBytes = Math.floor(n / 8);
        var remainBits = n % 8;
        for (var i = 0; i < fullBytes; i++) {
          if (data[i] !== 0) return false;
        }
        if (remainBits > 0) {
          var mask = 0xFF << (8 - remainBits);
          if ((data[fullBytes] & mask) !== 0) return false;
        }
        return true;
      }
    `;

    function guestbooks___fetchAndSolve() {
      powReady = false;
      powChallenge = "";
      powNonce = "";
      submitBtn.disabled = true;
      powCheckbox.disabled = true;
      powLabelText.textContent = "Verifying\u2026";
      powLabelText.className = "guestbooks___pow-label-text--loading";

      var apiUrl = "https://guestbooks.meadow.cafe/api/pow-challenge/508";
      fetch(apiUrl)
        .then(function(resp) { return resp.json(); })
        .then(function(data) {
          powChallenge = data.challenge;
          var difficulty = data.difficulty;

          if (powWorker) { powWorker.terminate(); }

          var blob = new Blob([workerCode], { type: "application/javascript" });
          powWorker = new Worker(URL.createObjectURL(blob));

          powWorker.onmessage = function(e) {
            if (e.data.found) {
              powNonce = e.data.nonce;
              powReady = true;
              hiddenChallenge.value = powChallenge;
              hiddenNonce.value = powNonce;
              guestbookPowReady = true;
              updateGuestbookSubmit();
              powCheckbox.disabled = true;
              powLabelText.textContent = "Verified \u2713";
              powLabelText.className = "guestbooks___pow-label-text--verified";
            }
          };

          powWorker.postMessage({ challenge: powChallenge, difficulty: difficulty });
        })
        .catch(function(err) {
          console.error("PoW challenge fetch error:", err);
          powCheckbox.checked = false;
          powCheckbox.disabled = false;
          powLabelText.textContent = "Verification failed \u2014 try again";
          powLabelText.className = "guestbooks___pow-label-text--error";
        });
    }

    // Only start PoW when the checkbox is clicked
    powCheckbox.addEventListener("change", function() {
      if (powCheckbox.checked) {
        guestbooks___fetchAndSolve();
      }
    });

    // After form submission, reset the checkbox for the next message
    form.addEventListener("submit", function() {
      setTimeout(function() {
        powCheckbox.checked = false;
        powCheckbox.disabled = false;
        powLabelText.textContent = "I\u2019m not a robot";
        powLabelText.className = "";
        guestbookPowReady = false;
        updateGuestbookSubmit();
      }, 500);
    });
  })();