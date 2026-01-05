$(function () {
  // Read JSON URL from query string
  const params = new URLSearchParams(window.location.search);
  const dataUrl = params.get("data");

  if (!dataUrl) {
    alert("No data file specified.");
    window.location.href = "index.html";
    return;
  }

  let setData = null;
  let currentIndex = 0;

  const $placeholders = $("#placeholders");
  const $inputBox = $("#inputBox");

  // Sound effects
  const sounds = {
    ok: new Audio("sounds/type_ok.wav"),
    error: new Audio("sounds/type_error.wav"),
    space: new Audio("sounds/type_spc.wav"),
    backspace: new Audio("sounds/type_bs.wav"),
    success: new Audio("sounds/type_success.wav")
  };

  let lastValue = "";

  // Load JSON
  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load JSON");
      return res.json();
    })
    .then(json => {
      setData = json;
      init();
    })
    .catch(err => {
      alert("Error loading data file.");
      console.error(err);
      window.location.href = "index.html";
    });

	
	function cleanString(input) {
	  return input.replace(/[^a-zA-Z]/g, ' ').replace(/\s+/g, ' ').trim();
	}

  function init() {
    $("#totalCount").text(setData.data.length);
    renderPhrase();
  }

  function renderPhrase() {
    const phrase = cleanString( setData.data[currentIndex].text );

    $("#setTitle").text(setData.title);
    $("#setNotes").text(setData.notes);
    $("#currentIndex").text(currentIndex + 1);
	$("#setPhraseNotes").text(setData.data[currentIndex].notes || "");

	// Render tags
	const $tags = $("#setTags");
	$tags.empty();
	(setData.tags || []).forEach(tag => {
	  $tags.append(`<span class="badge bg-secondary me-1">${tag}</span>`);
	});


    $placeholders.empty();
    $inputBox.val("");
    lastValue = "";

    phrase.split("").forEach(char => {
      const $span = $("<span>").addClass("char");
      if (char === " ") $span.addClass("space").text(" ");
      $placeholders.append($span);
    });

    speakPhrase(setData.data[currentIndex].text);
  }

  function speakPhrase(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = setData.language || "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  // Typing handler
  $inputBox.on("input", function () {
    const phrase = cleanString( setData.data[currentIndex].text );
    const value = $(this).val();

    // Detect backspace
    if (value.length < lastValue.length) {
      playSound(sounds.backspace);
    }

    // Detect added character
    if (value.length > lastValue.length) {
      const i = value.length - 1;
      const typedChar = value[i];
      const expectedChar = phrase[i];

      if (typedChar === " ") {
        playSound(sounds.space);
      } else if (typedChar.toLowerCase() === expectedChar?.toLowerCase()) {
        playSound(sounds.ok);
      } else {
        playSound(sounds.error);
      }
    }

    // Update placeholders
    $placeholders.children().each(function (i) {
      const $el = $(this);
      $el.removeClass("correct hint");
      $el.text(phrase[i] === " " ? " " : "");

      if (value[i] && value[i].toLowerCase() === phrase[i].toLowerCase()) {
        $el.text(phrase[i]).addClass("correct");
      }
    });

    // Success check
    if (
      value.length === phrase.length &&
      value.toLowerCase() === phrase.toLowerCase()
    ) {
      playSound(sounds.success);
    }

    lastValue = value;
  });

  // Hint
  $("#hintBtn").on("click", function () {
    const phrase = setData.data[currentIndex].text;
    const value = $inputBox.val();

    $placeholders.children().each(function (i) {
      if (phrase[i] === " ") return;
      if (!value[i] || value[i].toLowerCase() !== phrase[i].toLowerCase()) {
        $(this).text(phrase[i]).addClass("hint");
        return false;
      }
    });
  });

  // Repeat
  $("#repeatBtn").on("click", function () {
    speakPhrase(setData.data[currentIndex].text);
  });

  // Navigation
  $("#nextBtn").on("click", function () {
    if (currentIndex < setData.data.length - 1) {
      currentIndex++;
      renderPhrase();
    }
  });

  $("#prevBtn").on("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      renderPhrase();
    }
  });
});