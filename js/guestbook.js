var currentPage = 1;
var totalPages = 1;
const perPage = 8;
var form = document.getElementById("guestbooks___guestbook-form");
var messagesContainer = document.getElementById(
  "guestbooks___guestbook-messages-container"
);

var guestbookPowReady = false;
var gbSmoothNext = false;

function updateGuestbookSubmit() {
  var nameVal = document.getElementById("nameinput").value.trim();
  var msgVal = document.getElementById("messageinput").value.trim();
  var submitBtn = form.querySelector("input[type='submit']");
  submitBtn.disabled = !(nameVal && msgVal && guestbookPowReady);
}

document.getElementById("nameinput").addEventListener("input", updateGuestbookSubmit);
document.getElementById("messageinput").addEventListener("input", function() {
  updateGuestbookSubmit();
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

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
    var msgInput = document.getElementById("messageinput");
    msgInput.style.transition = "height 0.2s ease";
    msgInput.style.height = "";
    setTimeout(function() { msgInput.style.transition = ""; }, 250);
    var loadedCount = messagesContainer.querySelectorAll("[data-month]").length + 1;
    isLoadingMessages = false;
    allMessagesLoaded = false;
    currentPage = 1;
    gbSmoothNext = true;
    guestbooks___loadMessages(1, false, Math.max(loadedCount, perPage));
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
var gbLoadId = 0;

function guestbooks___loadMessages(page, append, limitOverride) {
  if (isLoadingMessages) return;
  if (page) {
    currentPage = page;
  }
  if (!append) {
    allMessagesLoaded = false;
  }
  isLoadingMessages = true;
  gbLoadId++;
  var thisLoadId = gbLoadId;

  var useLimit = limitOverride || perPage;
  var apiUrl =
    "https://guestbooks.meadow.cafe/api/v2/get-guestbook-messages/508?page=" + currentPage + "&limit=" + useLimit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (thisLoadId !== gbLoadId) return;
      var messages = data.messages || [];
      var pagination = data.pagination || {};

      totalPages = pagination.totalPages || 1;

      var scrollEl = document.getElementById("guestbook-messages-scroll");

      if (messages.length === 0 && !append) {
        messagesContainer.innerHTML = "<p>There are no messages on this guestbook.</p>";
      } else {
        if (!append) {
          messagesContainer.innerHTML = "";
        }

        var monthNames = ["january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"];

        messages.reverse();
        var fragment = document.createDocumentFragment();
        var lastMonthKey = "";

        messages.forEach(function (message, index) {
          var createdAt = new Date(message.CreatedAt);
          var monthKey = createdAt.getFullYear() + "-" + createdAt.getMonth();

          if (monthKey !== lastMonthKey) {
            var divider = document.createElement("div");
            divider.className = "gb-month-divider";
            divider.textContent = monthNames[createdAt.getMonth()] + " " + createdAt.getFullYear();
            fragment.appendChild(divider);
            lastMonthKey = monthKey;
          }

          var messageContainer = document.createElement("div");
          messageContainer.setAttribute("data-month", monthKey);

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
          messageContainer.appendChild(nameElement);

          var messageBody = document.createElement("blockquote");
          messageBody.textContent = message.Text;
          messageContainer.appendChild(messageBody);

          var mm = String(createdAt.getMonth() + 1).padStart(2, "0");
          var dd = String(createdAt.getDate()).padStart(2, "0");
          var yy = String(createdAt.getFullYear()).slice(-2);

          var dateElement = document.createElement("small");
          dateElement.textContent = mm + "." + dd + "." + yy;
          messageContainer.appendChild(dateElement);

          fragment.appendChild(messageContainer);
        });

        if (append) {
          var existingFirst = messagesContainer.querySelector(".gb-month-divider");
          if (existingFirst) {
            var newLastMonth = lastMonthKey;
            var existingFirstMonth = existingFirst.nextElementSibling
              ? existingFirst.nextElementSibling.getAttribute("data-month") : "";
            if (newLastMonth === existingFirstMonth) {
              existingFirst.remove();
            }
          }
          messagesContainer.insertBefore(fragment, messagesContainer.firstChild);
        } else {
          messagesContainer.appendChild(fragment);
        }
      }

      if (currentPage >= totalPages) {
        allMessagesLoaded = true;
      }

      if (!append) {
        var el = document.getElementById("guestbook-messages-scroll");
        if (el) {
          if (gbSmoothNext) {
            gbSmoothNext = false;
            setTimeout(function() {
              var target = el.scrollHeight;
              el.scrollTo({ top: target, behavior: "smooth" });
              setTimeout(function() {
                if (el.scrollTop < el.scrollHeight - el.clientHeight - 5) {
                  el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
                }
              }, 600);
            }, 200);
          } else {
            el.style.setProperty("scroll-behavior", "auto", "important");
            el.scrollTop = el.scrollHeight;
            requestAnimationFrame(function() {
              el.scrollTop = el.scrollHeight;
              el.style.removeProperty("scroll-behavior");
            });
          }
        }
      }

      isLoadingMessages = false;
    })
    .catch(function (error) {
      console.error("Error fetching messages:", error);
      isLoadingMessages = false;
    });
}

function gbUpdateScrollBtn() {
  var el = document.getElementById("guestbook-messages-scroll");
  var btn = document.getElementById("gb-scroll-bottom");
  var input = document.getElementById("guestbooks___guestbook-form-container");
  if (!el || !btn || !input) return;
  var distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  if (distFromBottom > 400) {
    btn.classList.add("visible");
    btn.style.bottom = (input.offsetHeight + 8) + "px";
  } else {
    btn.classList.remove("visible");
  }
}

function gbCheckLoad() {
  var el = document.getElementById("guestbook-messages-scroll");
  if (!el) return;
  gbUpdateScrollBtn();
  if (!isLoadingMessages && !allMessagesLoaded && el.scrollTop <= 400) {
    currentPage++;
    guestbooks___loadMessages(currentPage, true);
  }
}
var gbScroll = document.getElementById("guestbook-messages-scroll");
if (gbScroll) {
  gbScroll.addEventListener("scroll", gbCheckLoad);
  gbScroll.addEventListener("wheel", function() {
    setTimeout(gbCheckLoad, 50);
    setTimeout(gbCheckLoad, 150);
  });
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
    var powContainer = document.getElementById("guestbooks___challenge-answer-container");
    if (!powContainer) {
      powContainer = document.createElement("div");
      form.appendChild(powContainer);
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
        var batchSize = 50000;
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
              powLabelText.textContent = "Verified";
              powLabelText.className = "guestbooks___pow-label-text--verified";
              powCheckbox.classList.add("pow-verified");
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
        powCheckbox.classList.remove("pow-verified");
        guestbookPowReady = false;
        updateGuestbookSubmit();
      }, 500);
    });
  })();