const VOICE_ENABLED = true
const VOICE_FOLDER = "voice"
const VOICE_EXT = ".ogg"



$(function () {
  // Read JSON URL from query string
  const params = new URLSearchParams(window.location.search);
  const dataFile = params.get("data");
  const dataUrl = "data/"+dataFile;


  if (!dataUrl) {
    alert("No data file specified.");
    window.location.href = "index.html";
    return;
  }

  let setData = null;
  let currentIndex = 0;
  let phraseCompleted = false;
  var stats = new DoubleStats();	

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
  
  sounds.ok.volume = 0.1;      
  sounds.error.volume = 1.0;
  sounds.space.volume = 0.1;
  sounds.backspace.volume = 0.1;
  sounds.success.volume = 1.0;  

  let lastValue = "";

  
  
  new bootstrap.Tooltip($('#statPlace1')[0], { title: 'Good clicks',  placement: 'left' });
  new bootstrap.Tooltip($('#statPlace2')[0], { title: 'Bad clicks',   placement: 'left'  });
  new bootstrap.Tooltip($('#statPlace3')[0], { title: 'Accuracy',  	placement: 'left'  });
	

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
	  return input.replace(/[^\p{L}^\d]+/gu, ' ').replace(/\s+/g, ' ').trim();
	}

  async function init() {
	  
	DB_open();  
	  
    $("#totalCount").text(setData.data.length);
    renderPhrase();
  }

  function renderPhrase() {
	  
    const phrase = cleanString( setData.data[currentIndex].text );

	save_stat();
	
	phraseCompleted = false;
	
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

	sayPharase();
    
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

	$inputBox.on('keydown', function (e) {

		if (e.key === 'Enter' && phraseCompleted) {
			e.preventDefault();
			gotoNextPhrase();
			}
		if (e.key === 'F1' ) {
			e.preventDefault();
			makeHint();
			}
		if (e.key === 'F2' ) {
			e.preventDefault();
			sayPharase();
			}
			
		});


  // Typing handler
  $inputBox.on("input", function (e) {
    const phrase = cleanString( setData.data[currentIndex].text );
    var value = $(this).val();
	
	// remove punctuation and multiple spaces
	value = value.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'[\]\\|<>]/g, " ").replace(/\s+/g, ' ');

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
		stats.event_ok();
      } else {
        playSound(sounds.error);
		stats.event_error();
      }
	  
	  $("#statPlace1").html(stats.total.ok.toString());
	  $("#statPlace2").html(stats.total.count_mistakes().toString());
	  $("#statPlace3").html(stats.total.persent_accuracy().toString()+"%");
	  
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

	let fixedvalue = value;
	
    // Success check
    if (
      value.length === phrase.length &&
      fixedvalue.toLowerCase() === phrase.toLowerCase()
    ) {
      playSound(sounds.success);
	  phraseCompleted = true;
	  save_stat();
    }

    lastValue = value;
  });


  function save_stat(){
	  
	  
	if (stats.curr.ok!=0)
	{
		const phrase = cleanString( setData.data[currentIndex].text );
		DB_append(dataFile,currentIndex,phrase.length,stats.curr);
	}
	  

  }



  function makeHint() {
    const phrase = cleanString( setData.data[currentIndex].text) ;
    const value = $inputBox.val();

	$('#inputBox').focus();

	stats.event_hint();

    $placeholders.children().each(function (i) {
      if (phrase[i] === " ") return;
      if (!value[i] || value[i].toLowerCase() !== phrase[i].toLowerCase()) {
        $(this).text(phrase[i]).addClass("hint");
        return false;
      }
    });  
	

  }


  function gotoNextPhrase()
  {
    if (currentIndex < setData.data.length - 1) {
  	  currentIndex++;
    } else	{
      currentIndex=0;
	}
    renderPhrase();	
	
	$('#inputBox').focus();
	
  }

  function gotoPervPhrase()
  {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
	    currentIndex=setData.data.length - 1;
	}
    renderPhrase();	
	$('#inputBox').focus();
  }


  function sayPharase()
  {
	  let text = setData.data[currentIndex].text;
	  
	  if (VOICE_ENABLED)
	  {
		  let url = VOICE_FOLDER+"/"+ dataFile.replace(/\.[^/.]+$/, "")+"_"+currentIndex.toString().padStart(4, '0')+VOICE_EXT;
		  console.log("Play:",url, text);
		  let voice  =  new Audio(url);
		  playSound(voice);
	  } else
	  {
		  console.log("Say:", text);
	      speakPhrase(text);
	  }
	  
	  $('#inputBox').focus();
  }

  
  $("#nextBtn").on("click", gotoNextPhrase );
  $("#prevBtn").on("click", gotoPervPhrase );
  $("#hintBtn").on("click", makeHint );
  $("#repeatBtn").on("click", sayPharase );
  
  
});