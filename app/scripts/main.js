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

      // untrack event
      $('.js-img-zoom').off(trackedEvent);

      // init zoom plugin with options
      $('.js-img-zoom > img').ezPlus(ezpOptions);
    }
  }

  // Toggle zoom

  var zoom = false;
  var animationTime = 600;

  function toggleZoom (e) {
    var el = $(e.target);
    if (zoom) {
      el.css('width','100%');
    } else {
      el.css('width','500%');
      el.css('transition', 'all ' + animationTime/1000 + 's');
      el.parent().animate({
        scrollTop: el.height() * 5 / 2.5,
        scrollLeft: el.width() * 5 / 2.5
      }, animationTime);
    }
    zoom = !zoom;
  }


});
