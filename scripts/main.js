"use strict";document.addEventListener("DOMContentLoaded",function(){function o(o){var i="click";if(o.matches){$(".js-img-zoom").on(i,t);var s=$(".js-img-zoom > img").data("ezPlus");s?s.destroy():null}else $(".js-img-zoom").off(i),$(".js-img-zoom > img").ezPlus(e)}function t(o){var t=$(o.target);s?t.css("width","100%"):(t.css("width","500%"),t.css("transition","all "+m/1e3+"s"),t.parent().animate({scrollTop:5*t.height()/2.5,scrollLeft:5*t.width()/2.5},m)),s=!s}var e={zoomWindowOffsetX:10,zoomWindowOffsetY:-2},i=window.matchMedia("(max-width: 768px)");i.addListener(o),o(i);var s=!1,m=600;new Hammer($(".js-img-zoom")[0]);hammerime.on("doubletap",t)});