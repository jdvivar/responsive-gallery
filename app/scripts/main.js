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
    if (mql.matches) {
      var trackedEvent = 'click';
      // Mobile view
      $('.js-img-zoom').on(trackedEvent, toggleZoom);
      var ezpData = $('.zoomed img').data('ezPlus');
      ezpData ? ezpData.destroy() : null;
    } else {
      // Desktop view
      $('.js-img-zoom').off(trackedEvent);
      $('.js-img-zoom > img').ezPlus(ezpOptions);
    }
  }

  // Toggle zoom
  var zoom = false;
  function toggleZoom (e) {
    var el = $(e.target);
    if (zoom) {
      el.css('width','100%');
    } else {
      el.css('width','500%');
      el.css('transition', 'all .6s');
      el.parent().animate({
        scrollTop: el.height() * 5 / 2.5,
        scrollLeft: el.width() * 5 / 2.5
      }, 600);
    }
    zoom = !zoom;
  }


});
