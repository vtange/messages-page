"use strict";var door=document.querySelector("#door"),door_back=document.querySelector("#door_back");door.addEventListener("click",function(){open_door()}),door_back.addEventListener("click",function(){open_door()});var door_opened=!1;function open_door(){var o,e,t;document.querySelector("#door").classList.add("open"),door_opened||(door_opened=!0,o=document.querySelector("#white-full"),e=document.querySelector("#init-page"),t=document.querySelector("#content"),o.style.opacity=1,setTimeout(function(){e.style.display="none",t.style.display="",o.style.opacity=0,init()},1e3))}function init(){AOS.init({delay:50,duration:1e3,mirror:!0,once:!1});var o=document.querySelector("#credits"),o=new Masonry(o,{itemSelector:".credits-section",columnWidth:300});new SimpleLightbox("#artbook-gallery a").on("error.simplelightbox",function(o){console.log(o)}),o.on("layoutComplete",function(){AOS.refresh()})}