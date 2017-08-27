(function($, window) {

const email_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

let $hardcore = $('#hardcore');

let danger_zone = false;
let danger_count = 0;
let words = 0;
let time_since_stroke = 0;
let composing = false;
let $input = $('#input');
let $progress = $('#progress');
let progress = 0;
let $wordcount = $('#wordcount');
let run = false;
let tock = null;
let start_time = 0;

let invalid_chars = [8, 9, 13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 91, 93];

let key_replace = {96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 222: "'"};
let shift_replace = {",": "<", ".": ">", "/": "?", ";": ":", "'": "\"", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+"};

let kill = 5;
let fade = 2;

/* *************************************************************** */
/* Registration form validation                                    */
/* *************************************************************** */

$("#email").on('keyup', function () {
  $(this).parents(".form-group").toggleClass("valid", email_regex.test($("#email").val()));
}).on('blur', function () {
  $(this).parents(".form-group").toggleClass("invalid", !email_regex.test($("#email").val()));
});

$("form").on('submit', function(evt) {
  evt.preventDefault();
  if (!email_regex.test($("#email").val())) {
    $("form").addClass('shake');
    setTimeout(function () { $("form").removeClass('shake')}, 1000);
  } else {
    // Register user
    $input.val(decodeURIComponent(escape(atob(localStorage.getItem('mdwa.draft')))));
    let email = $("#email").val();

    amplitude.getInstance().setUserId(email);
    let ident = new amplitude.Identify().setOnce('created_at', Math.floor(Date.now() / 1000));
    amplitude.identify(ident);
    amplitude.logEvent('sign_up', {'email': email});
    localStorage.setItem("mdwa.email", email);
    localStorage.setItem("mdwa.returning", "true");
    danger(0);
    win();
    $("#die").addClass("returning").hide();
  }
})

/* *************************************************************** */
/* Writing stuff                                                   */
/* *************************************************************** */


let update_progress = function () {
  $progress.width(`${progress * 100}%`);
}

let update_stats = function () {
  words = $input.val().split(/\s+/).length;
  $wordcount.text(words + (words == 1 ? " word" : " words"));
};

let die = function() {
  if (!run) return;
  let duration = now() - start_time;
  localStorage.setItem('mdwa.draft', btoa(unescape(encodeURIComponent($input.val()))));
  amplitude.logEvent('stop_writing', {'session_type': session_type, 'session_limit': session_limit, 'duration': duration, 'won': false, 'words': words, 'dangers': danger_count})
  $input.val("");
  clearInterval(tock);
  run = false;
  $('#tweet').attr("href", `https://twitter.com/intent/tweet?text=I+wrote+${words}+words+using+The+Most+Dangerous+Writing+App+-+until+it+deleted+everything+.+%23MDWA&url=http%3A%2F%2Fwww.themostdangerouswritingapp.com`);
  $('#tweet').text(`I wrote ${words} words using The Most Dangerous Writing App - until it deleted everything.`);
  $("#die").show();
  setTimeout(function() {
    $("#die").addClass("visible");
  }, 20);
};

let win = function() {
  clearInterval(tock);
  run = false;
  won = true;
  $progress.addClass("won");
  setTimeout(function() {$progress.addClass("hide");}, 3000)

  if (hardcore_mode) {
    $('#hardcore').hide();
    $input.removeClass("hardcore");
  }

  $("#win").show();
  $("#wordcount").hide();
};

let tick = function() {
  let duration = now() - start_time;
  progress = (session_type == "timed" ? duration : words) / session_limit;
  time_since_stroke += 0.1;

  update_progress();

  if (hardcore_mode) {
    hardcore.style.opacity = time_since_stroke > .1 ? 0 : 1;
  }

  if (!won && progress >= 1) {
    amplitude.logEvent('stop_writing', {'session_type': session_type, 'session_limit': session_limit, 'duration': duration, 'won': true, 'words': words, 'dangers': danger_count})
    return win();
  }
  else if (time_since_stroke > kill) { return die(); }
  else if (time_since_stroke > fade) {
    danger_zone = true;
    danger((time_since_stroke - fade) / (kill - fade));
  }
};

let danger = function(perc) {
  if (perc == 0) {
    $input.css('opacity', 1);
    $("body").css("box-shadow", "none");
    $progress.removeClass("danger");
  } else {
    $input.css("opacity", 1 - perc);
    $("body").css("box-shadow", `inset 0px 0px ${Math.floor(100 * perc)}px 0px rgba(242, 77, 77, ${perc * .7})`);
    $progress.addClass("danger");
  }
}

let keyFromCharCode = function(charCode, shift) {
  let char;
  if (key_replace.hasOwnProperty(charCode)) {
    char = key_replace[charCode];
  } else if (48 <= charCode && charCode <= 90) {
    char = String.fromCharCode(charCode);
    if (!shift) {
      char = char.toLowerCase();
    }
  } else { char = ""; }

  if (shift && shift_replace.hasOwnProperty(char)) {
    char = shift_replace[char];
  }
  return char;
};

let stroke = function(e) {
  update_stats();

  let evt = e || window.event;
  let charCode = evt.keyCode || evt.which;
  let ctrl_down = evt.ctrlKey || evt.metaKey;

  // Ctrl + (Alt or Cmd) + N -> Night Mode!
  if (evt.ctrlKey && __in__(charCode, [78, 192]) && (evt.metaKey || evt.altKey)) {
    $("body").toggleClass("night-mode"); return;
  }
  // If we have won, nothing to do
  if (won) { return; }
  // Ingore control keys such as shift, backspace, ...
  if (charCode && __in__(charCode, invalid_chars)) { return; }
  // Prevent Ctrl + C (or a or v or x)
  if (ctrl_down && __in__(charCode, [65, 67, 86, 88])) {
    evt.preventDefault();
    return;
  }

  if (hardcore) {
    hardcore.innerHTML = keyFromCharCode(charCode, evt.shiftKey);
  }

  time_since_stroke = 0;

  // Add to dangers avoided
  if (danger_zone) danger_count++;
  danger_zone = false;

  if (!run) {
    amplitude.logEvent('start_writing', {'session_type': session_type, 'session_limit': session_limit});
    run = true;
    start_time = now();
    tock = setInterval(tick, 100);
  } else { danger(0); }

};


$input.on('scroll', function () {
  $("#input-wrap").toggleClass("cut-top", this.scrollTop > 0);
  $("#input-wrap").toggleClass("cut-bottom", this.scrollHeight - 10 > $(this).height() + this.scrollTop && this.scrollHeight > $(this).height());
});

$input.on('compositionstart compositionend', function(){composing=!composing});
$input.on('input', function(e){if(composing){stroke(e)}});
$input.on('keydown', stroke);

let toggleFullScreen = function() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  $input.focus_end();
}

let toggleNightMode = function() {
  $("body").toggleClass("night-mode");
  $input.focus_end();
}

let now = () => new Date().getTime() / 1000;

let start = function() {
  if (hardcore_mode) {
    $hardcore.show();
    $input.addClass("hardcore");
  } else {
    $hardcore.hide();
  }
  if (won) win();
  return $input.focus_end();
};


function __in__(needle, haystack) {
  return haystack.indexOf(needle) >= 0;
}

  $("#toggle-night-mode").on('click', toggleNightMode);
  $("#toggle-fullscreen").on('click', toggleFullScreen);

  $("#download").on('click', function() {
    let title = $input.val().replace(/[",.!-::']/g , "");
    let length = title.indexOf(" ", 25);
    title = title.substr(0, length > 0 ? length : 30);
    let date = new Date().toLocaleDateString();
    let filename = `${title} (MDWA ${date}).txt`;
    var blob = new Blob([$input.val()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
    return false;
  });

  start();

 $("input.float-label").label_better({
    animationTime: 250,
    easing: "ease-in-out",
    offset: -8
  });


}).call(this, jQuery, window);
