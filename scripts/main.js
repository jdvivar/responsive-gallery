"use strict";document.addEventListener("DOMContentLoaded",function(){function t(t){var e="click",o=l;l=$(".js-img-zoom");var d;if(d=l.children("img").first().data("ezPlus"),d?d.destroy():null,d=o.children("img").first().data("ezPlus"),d?d.destroy():null,i(l.children("img").first()),n(l,f),t.matches){r($(".js-instructions"),h),o.off(e),l.off(e),l.on(e,s);var u=c($(".js-fade.left").css("left"))+$(".js-fade.right").parent().width()-$(".js-fade.right").width();$(".js-fade.right").css("left",u)}else r($(".js-instructions"),0),l.off(e),o.off(e),l.children("img").first().ezPlus(a),$(".js-fade.right").css("left",m)}function s(t){var s=$(t.target);d?i(s):e(s)}function i(t){d=!1,t.css("width","100%")}function e(t){d=!0,r($(".js-instructions"),0),t.css("width","500%"),t.css("transition","all "+f/1e3+"s"),t.parent().animate({scrollTop:5*t.height()/2.5,scrollLeft:5*t.width()/2.5},f)}function n(t,s){setTimeout(function(){if(0===t.children("img").first().css("height"))return n(t,s),!1;var i=c(t.children("img").first().css("height"))+c(t.css("padding-bottom"))+c(t.css("padding-top"))+c(t.css("border-top-width"))+c(t.css("border-bottom-width"));t.css("height",i)},s)}function c(t){return Math.round(parseFloat(t))}function r(t,s){t.css("animation-delay",s/1e3+"s"),setTimeout(function(){$(t).remove()},s+f)}function o(){var t=30;$(".js-thumbnail-list img").each(function(s,i){var e=c($(i).parent().css("height"));e>t&&(t=e)}),$(".js-thumbnail-list .thumbnail-container").css("height",t+"px"),$(".js-thumbnail-list").css("height",t+"px")}var a={zoomWindowOffsetX:10,zoomWindowOffsetY:0,touchEnabled:!1},l=$(".js-img-zoom"),h=3e3,d=!1,f=600,m=$(".js-fade.right").css("left"),u=window.matchMedia("(max-width: 768px)");u.addListener(t),$(".js-select-this-img").click(function(){$(".js-select-this-img").removeClass("active"),$(this).addClass("active"),l.children("img").first().attr("src",$(this).children("img").attr("src")),n(l,d?f:0),i(l.children("img").first()),t(u)}),$(".js-select-this-img").first().click(),$(".js-thumbnail-list").scroll(function(t){var s=this.scrollLeft/(this.scrollWidth-$(this).innerWidth()),i=.2;$(".js-fade.left").css("opacity",1*s/i),$(".js-fade.right").css("opacity",1*(1-s)/i)}),$(".js-thumbnail-list").scroll(),o()});