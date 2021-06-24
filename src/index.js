var lid = document.querySelector("#lid");
lid.addEventListener("click", function(e) {
    confetti.fire(e);
    open_box();
});
var box = document.querySelector("#box .front");
box.addEventListener("click", function(e) {
    confetti.fire(e);
    open_box();
});

var confettiRainSettings = { target: 'confettiRain', clock: 12 };
var confettiRain = new ConfettiGenerator(confettiRainSettings);
// Pass in the id of an element
var confetti = new Confetti('confetti');

// Edit given parameters
confetti.setCount(125);
confetti.setSize(2);
confetti.setPower(55);
confetti.setFade(false);
confetti.destroyTarget(false);

var musicbox_shouldPlay = false;
var musicbox_audioLoaded = false;
var audioElement = new Audio('audio/Blue_Clapper_music_box_ver_040621v2.mp3');
audioElement.addEventListener('canplaythrough', function() {
  musicbox_audioLoaded = true;
  audioElement.loop = true;
  audioElement.volume = slider.value/100;
  if (musicbox_shouldPlay) {
    audioElement.play();
  }
})
var box_opened = false;
var init_page = document.getElementById('init-page');
if (window.getComputedStyle(init_page).transform === "scale(0)") {
    // uses -ms- prefix aka IE.
    open_box();
}

function open_box() {
    var box = document.getElementById("box-container");
    box.classList.add('open');

    if (box_opened) {
        return;
    }
    box_opened = true;

    var white_full = document.getElementById("white-full");
    var content = document.getElementById('content');

    setTimeout(function(){
        white_full.style.opacity = 1;
        setTimeout(function(){
            confetti.pause();
            confettiRain.render();
            init_page.style.display = 'none'; // box begone
            content.classList.add('open');
            init();
            if (musicbox_audioLoaded) {
                audioElement.play();
            } else {
                musicbox_shouldPlay = true;
            }
            setTimeout(function(){
                white_full.style.opacity = 0;
            }, 500);
        }, 1000);
    }, 1000);
}

function init() {
    AOS.init({
        delay: 50,
        duration: 1000,
        mirror: true,
        once: false,
    });

    let gallery_a = new SimpleLightbox('#artbook-gallery a');
    gallery_a.on('error.simplelightbox', function (e) {
        console.log(e); // some usefull information
    });
}

var ytplayer;
function onYouTubeIframeAPIReady() {
    ytplayer = new YT.Player('ytplayer', {
        videoId: '0NOcQ9IOX9U',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
        });
}
// event that will be fired when the state of the video player changes
function onPlayerStateChange(event) {
  if(event.data == -1 || event.data == 1) {
    // unstarted or playing
    mute(true);
    volumeIcon.style.pointerEvents = "none";
  } else if (event.data == 0 || event.data == 2) {
    // stopped or paused
    mute(false);
    volumeIcon.style.pointerEvents = "";
  }
}

var volumeIcon = document.getElementById("volume-icon");
volumeIcon.addEventListener("click", function(e) {
    if (audioElement.muted) {
        mute(false);
    } else {
        mute(true);
    }
});

function mute(isMuted){
    if (isMuted){
        volumeIcon.classList.add("muted");
    } else {
        volumeIcon.classList.remove("muted");
    }
    slider.disabled = isMuted;
    audioElement.muted = isMuted;

}

var slider = document.getElementById("musicbox-volume");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function(e) {
    audioElement.volume = Math.min(1,this.value/100);
}