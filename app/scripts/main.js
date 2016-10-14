document.addEventListener('DOMContentLoaded', function() {

  // Options for zoom plugin
  var ezpOptions = {
    zoomWindowOffsetX: 10,
    zoomWindowOffsetY: -2,
    touchEnabled: false
  };

  var zoomedElement = $('.js-img-zoom');
  var instructionsDelay = 3000;
  var isZoom = false;
  var animationTime = 600;

  // responsive behaviour
  var mql = window.matchMedia('(max-width: 768px)');
  mql.addListener(handleOrientationChange);
  // handleOrientationChange(mql);

  function handleOrientationChange(mql) {
    var trackedEvent = 'click';
    var previousZoomedElement = zoomedElement;
    zoomedElement = $('.js-img-zoom');

    // clean zoom plugin data
    var ezpData;
    ezpData = zoomedElement.children('img').first().data('ezPlus');
    ezpData ? ezpData.destroy() : null;
    ezpData = previousZoomedElement.children('img').first().data('ezPlus');
    ezpData ? ezpData.destroy() : null;

    zoomOut(zoomedElement.children('img').first());
    setImageContainerHeight(zoomedElement, animationTime);

    if (mql.matches) {
      // Mobile view

      hideInstructions($('.js-instructions'), instructionsDelay);

      // untrack event
      previousZoomedElement.off(trackedEvent);
      zoomedElement.off(trackedEvent);

      // track event and callback
      zoomedElement.on(trackedEvent, toggleZoom);

    } else {
      // Desktop view

      // hide instructions
      hideInstructions($('.js-instructions'), 0);

      // untrack event
      zoomedElement.off(trackedEvent);
      previousZoomedElement.off(trackedEvent);

      // init zoom plugin
      zoomedElement.children('img').first().ezPlus(ezpOptions);
    }
  }

  // function to toggle zoom natively (mobile)
  function toggleZoom(e) {
    var el = $(e.target);
    if (isZoom) {
      zoomOut(el);
    } else {
      zoomIn(el);
    }
  }

  // function to zoom out natively (mobile)
  function zoomOut(el) {
    isZoom = false;
    el.css('width', '100%');
  }

  // function to zoom in natively
  function zoomIn(el) {
    isZoom = true;
    hideInstructions($('.js-instructions'), 0);
    el.css('width', '500%');
    el.css('transition', 'all ' + animationTime / 1000 + 's');
    el.parent().animate({
      scrollTop: el.height() * 5 / 2.5,
      scrollLeft: el.width() * 5 / 2.5
    }, animationTime);
  }

  // function to remove from DOM instructions element
  function hideInstructions(instructions, delay) {
    instructions.css('animation-delay', delay / 1000 +'s');
    setTimeout(function(){ $(instructions).remove(); }, delay + animationTime);
  }

  // thumbnail list behaviour
  $('.js-select-this-img').click(function(){

    // remove active state from all thumbnails
    $('.js-select-this-img').removeClass('active');

    // set active to the one just clicked
    $(this).addClass('active');

    // set main image to the one selected
    zoomedElement.children('img').first().attr('src',$(this).children('img').attr('src'));

    // set img container height according to contents within
    setImageContainerHeight(zoomedElement, isZoom ? animationTime : 0);

    // force zoom out
    zoomOut(zoomedElement.children('img').first());

    // force handle proper zoom method
    handleOrientationChange(mql)
  });

  // choose first image on list
  $('.js-select-this-img').first().click();

  // function to set image container height to the image height plus paddings and borders
  function setImageContainerHeight(container, delay) {
    setTimeout(function(){
      // only execute if image is loaded (while?)
      if (container.children('img').first().css('height') === 0) {
        setImageContainerHeight(container, delay);
        return false;
      }

      var containerHeight = parsePx(container.children('img').first().css('height')) + parsePx(container.css('padding-bottom')) + parsePx(container.css('padding-top')) + parsePx(container.css('border-top-width')) + parsePx(container.css('border-bottom-width'));
      container.css('height',containerHeight);
    }, delay);
  }

  // function to convert size from css in px to a correctly rounded integer
  function parsePx(px) {
    return Math.round(parseFloat(px))
  }

});
