var currentPage = 1;
var totalPages = 1;
const perPage = 15;
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
  if (page) {
    currentPage = page;
  }

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

      if (messages.length === 0) {
        messagesContainer.innerHTML = "<p>There are no messages on this guestbook.</p>";
        guestbooks___hidePaginationControls();
      } else {
        // Scroll to top when changing pages
        if (page && page !== 1) {
          document.getElementById("guestbook").scrollTo(0, 0);
        }

        // Messages are already sorted by created_at DESC from the API
        messagesContainer.innerHTML = "";
        messages.forEach(function (message) {
          var messageContainer = document.createElement("div");
          var messageHeader = document.createElement("p");
          var boldElement = document.createElement("b");

          // add name with website (if present)
          if (message.Website) {
            var link = document.createElement("a");
            link.href = message.Website ? message.Website : "#";
            link.textContent = message.Name;
            link.target = "_blank";
            boldElement.appendChild(link);
          } else {
            var textNode = document.createTextNode(message.Name);
            boldElement.appendChild(textNode);
          }
          messageHeader.appendChild(boldElement);

          // add date
          var createdAt = new Date(message.CreatedAt);
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
          messageBody.textContent = message.Text;

          messageContainer.appendChild(messageHeader);
          messageContainer.appendChild(messageBody);

          messagesContainer.appendChild(messageContainer);
        });

        guestbooks___createPaginationControls(pagination);
      }
    })
    .catch(function (error) {
      console.error("Error fetching messages:", error);
    });
}

function guestbooks___createPaginationControls(pagination) {
  var pagesContainer = document.getElementById("guestbook-pages");
  if (!pagesContainer) return;

  // Clear existing pagination
  pagesContainer.innerHTML = "";

  // Only show pagination if there's more than one page
  if (pagination.totalPages <= 1) {
    return;
  }

  // Generate page links
  for (var i = 1; i <= pagination.totalPages; i++) {
    var pageLink = document.createElement("p");
    pageLink.id = i.toString();
    pageLink.textContent = i.toString();
    pageLink.className = i === pagination.page ? "gb-active-page" : "";

    // Add click handler using closure to capture the page number
    (function(pageNum) {
      pageLink.onclick = function() {
        guestbooks___loadMessages(pageNum);
      };
    })(i);

    pagesContainer.appendChild(pageLink);
  }
}

function guestbooks___hidePaginationControls() {
  var pagesContainer = document.getElementById("guestbook-pages");
  if (pagesContainer) {
    pagesContainer.innerHTML = "";
  }
}
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
              submitBtn.disabled = false;
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
        submitBtn.disabled = true;
      }, 500);
    });
  })();