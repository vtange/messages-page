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
audioElement.addEventListener('canplaythrough', () => {
  // let duration = audioElement.duration;
  // The duration variable now holds the duration (in seconds) of the audio clip
  musicbox_audioLoaded = true;
  if (musicbox_shouldPlay) {
    audioElement.play();
  }
})
var box_opened = false;

function open_box() {
    var box = document.getElementById("box-container");
    box.classList.add('open');

    if (box_opened) {
        return;
    }
    box_opened = true;

    var white_full = document.getElementById("white-full");
    var init_page = document.getElementById('init-page');
    var content = document.getElementById('content');

    setTimeout(function(){
        white_full.style.opacity = 1;
        setTimeout(function(){
            confetti.pause();
            confettiRain.render();
            init_page.style.display = 'none'; // box begone
            content.classList.add('open');
            init();
            setTimeout(function(){
                if (musicbox_audioLoaded) {
                    audioElement.play();
                } else {
                    musicbox_shouldPlay = true;
                }
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

    let credits = document.querySelector('#credits');
    let credits_msnry = new Masonry(credits, {
        itemSelector: '.credits-section',
        columnWidth: 300
    });

    // new GreenAudioPlayer('#cover-audio-container');

    let gallery_a = new SimpleLightbox('#artbook-gallery a');
    gallery_a.on('error.simplelightbox', function (e) {
        console.log(e); // some usefull information
    });

    credits_msnry.on('layoutComplete', function(){
        AOS.refresh();
    });
}