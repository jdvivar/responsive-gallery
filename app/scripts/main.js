document.addEventListener('DOMContentLoaded', function() {

  // Options for zoom plugin
  var ezpOptions = {
    zoomWindowOffsetX: 10,
    zoomWindowOffsetY: -2
  };

  // responsive behaviour
  var mql = window.matchMedia('(max-width: 768px)');
  mql.addListener(handleOrientationChange);
  handleOrientationChange(mql);

  function handleOrientationChange(mql) {
    var trackedEvent = 'click';

    if (mql.matches) {
      // Mobile view

      setImageContainerHeight();

      // track event and callback
      $('.js-img-zoom').on(trackedEvent, toggleZoom);

      // clean zoom plugin data
      var ezpData = $('.js-img-zoom > img').data('ezPlus');
      ezpData ? ezpData.destroy() : null;
    } else {
      // Desktop view

      hideInstructions();

      // untrack event
      $('.js-img-zoom').off(trackedEvent);

      // init zoom plugin with options
      $('.js-img-zoom > img').ezPlus(ezpOptions);
    }
  }

  // Toggle zoom

  var isZoom = false;
  var animationTime = 600;

  function toggleZoom(e) {
    var el = $(e.target);
    if (isZoom) {
      zoomOut(el);
    } else {
      zoomIn(el);
    }
  }

  function zoomOut(el) {
    isZoom = false;
    el.css('width', '100%');
  }

  function zoomIn(el) {
    isZoom = true;
    hideInstructions();
    el.css('width', '500%');
    el.css('transition', 'all ' + animationTime / 1000 + 's');
    el.parent().animate({
      scrollTop: el.height() * 5 / 2.5,
      scrollLeft: el.width() * 5 / 2.5
    }, animationTime);
  }

  function hideInstructions() {
    var instructions = $('.js-img-zoom .js-instructions');
    $(instructions).remove();
  }

  // thumbnail list

  $('.js-select-this-img').click(function(e){
    var self = this;

    // remove active state from all thumbnails
    $('.js-select-this-img').removeClass('active');

    // set active to the one just clicked
    $(self).addClass('active');

    // set main image to the one selected
    $('.js-img-zoom img').attr('src',$(self).children('img').attr('src'));

    // set img container height according to contents within
    // setImageContainerHeight();
    setTimeout(function(){ setImageContainerHeight(); }, isZoom ? animationTime : 0);

    // force zoom out
    zoomOut($('.js-img-zoom img'));

    // restart
    // startZoom($('.js-img-zoom'));
  });

  function setImageContainerHeight() {
    var containerHeight = parsePx($('.js-img-zoom img').css('height')) + parsePx($('.js-img-zoom').css('padding-bottom')) + parsePx($('.js-img-zoom').css('padding-top')) + parsePx($('.js-img-zoom').css('border-top-width')) + parsePx($('.js-img-zoom').css('border-bottom-width'));
    $('.js-img-zoom').css('height',containerHeight);
  }
  function parsePx(px) {
    return Math.round(parseFloat(px))
  }

});
