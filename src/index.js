var lid = document.querySelector("#lid");
lid.addEventListener("click", function() {
    open_box();
});
var box = document.querySelector("#box .front");
box.addEventListener("click", function() {
    open_box();
});

var box_opened = false;

function open_box() {
    var lid = document.querySelector("#lid");
    lid.classList.add('open');

    if (box_opened) {
        return;
    }
    box_opened = true;

    var white_full = document.querySelector("#white-full");
    var init_page = document.querySelector('#init-page');
    var content = document.querySelector('#content');

    setTimeout(function(){
        white_full.style.opacity = 1;
        setTimeout(function(){
            init_page.style.display = 'none'; // box begone
            content.style.display = "";  // makes it possible to scroll down
            init();
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