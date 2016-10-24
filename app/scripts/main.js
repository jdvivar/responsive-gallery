document.addEventListener('DOMContentLoaded', function() {

  // Options for zoom plugin
  var ezpOptions = {
    zoomWindowOffsetX: 10,
    zoomWindowOffsetY: 0,
    touchEnabled: false
  };

  var zoomedElement = $('.js-img-zoom');
  var instructionsDelay = 3000;
  var isZoom = false;
  var animationTime = 600;
  var originalFadeRightPosition = $('.js-fade.right').css('left');

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

    // zoom out when orientation change happens
    zoomOut(zoomedElement.children('img').first());
    setImageContainerHeight(zoomedElement, animationTime);

    if (mql.matches) {
      // Mobile view

      // hide instructions
      hideInstructions($('.js-instructions'), instructionsDelay);

      // untrack event
      previousZoomedElement.off(trackedEvent);
      zoomedElement.off(trackedEvent);

      // track event and callback
      zoomedElement.on(trackedEvent, toggleZoom);

      // set position of right fade on thumbnail list responsively
      var rightFadePosition = parsePx($('.js-fade.left').css('left')) + $('.js-fade.right').parent().width() - $('.js-fade.right').width();
      $('.js-fade.right').css('left', rightFadePosition);


    } else {
      // Desktop view

      // hide instructions
      hideInstructions($('.js-instructions'), 0);

      // untrack event
      zoomedElement.off(trackedEvent);
      previousZoomedElement.off(trackedEvent);

      // init zoom plugin
      zoomedElement.children('img').first().ezPlus(ezpOptions);

      // set position of right fade on thumbnail list to its original state
      $('.js-fade.right').css('left', originalFadeRightPosition);
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

  // horizontal scroll behaviour
  $('.js-thumbnail-list').scroll(function(e){

    // horizontal scroll position 0 to 1, where 0 is left edge
    var horizontalScroll = this.scrollLeft / (this.scrollWidth - $(this).innerWidth());
    var startFade = 0.2;

    // fade left opacity, 0 on edge left, 1 on 20% horizontal scroll
    $('.js-fade.left').css('opacity', horizontalScroll * 1/startFade);

    // fade right opacity, 0 on edge right, 1 on 80% horizontal scroll
    $('.js-fade.right').css('opacity', (1 - horizontalScroll) * 1/startFade);

  });

  // check where we are on the scroll
  $('.js-thumbnail-list').scroll();


  // In order to vertically top align thumbnails, set the container height
  // to the greatest height amongst all thumbnails
  function setThumbnailHeight(){
    var max = 30;
    $('.js-thumbnail-list img').each(function(index, element){
      var thumbnailHeight = parsePx($(element).parent().css('height'));
      if (thumbnailHeight > max) {
        max = thumbnailHeight;
      }
    });
    $('.js-thumbnail-list .thumbnail-container').css('height', max + 'px');
    $('.js-thumbnail-list').css('height', max + 'px');
  }

  setThumbnailHeight();



});
