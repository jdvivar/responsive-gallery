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

      // track event and callback
      $('.js-img-zoom').on(trackedEvent, toggleZoom);

      // clean zoom plugin data
      var ezpData = $('.js-img-zoom > img').data('ezPlus');
      ezpData ? ezpData.destroy() : null;
    } else {
      // Desktop view

      // Hide instructions
      hideInstructions()

      // untrack event
      $('.js-img-zoom').off(trackedEvent);

      // init zoom plugin with options
      $('.js-img-zoom > img').ezPlus(ezpOptions);
    }
  }

  // Toggle zoom

  var zoom = false;
  var animationTime = 600;

  function toggleZoom(e) {

    var el = $(e.target);
    if (zoom) {
      zoomOut(el);
    } else {
      zoomIn(el);
    }
    zoom = !zoom;
  }

  function zoomOut(el) {
    el.css('width', '100%');
  }

  function zoomIn(el) {
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
    $(instructions).hide();
  }

  // hammer

  // var hammertime = new Hammer($('.js-img-zoom')[0],{
  //       touchAction: 'pan-x pan-y'
  //   });

  // hammertime.get('pinch').set({
  //   enable: true
  // });
  // hammertime.on('pinch', function(e) {
  //   if (e.srcEvent.type === 'touchend') {
  //     if (e.additionalEvent === 'pinchin') {
  //       zoomOut($(e.target));
  //     }
  //     else if (e.additionalEvent === 'pinchout') {
  //       zoomIn($(e.target));
  //     }
  //   }
  // });

  // hammertime.on('doubletap', toggleZoom);

});
