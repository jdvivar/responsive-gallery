(function( $ ) {
    $.fn.responsiveGallery = function(options) {

      var gallery = this;
      gallery.id = gallery[0].id;

      // ADD MARKUP

      // Add style to parent node
      gallery.addClass('img-container');

      // Adding children markup to gallery
      gallery.append('<img /><div id=' + gallery.id + '-instructions class="instructions animated js-instructions"><i class="fa fa-search-plus"></i><div class="text">Tap once to zoom in or out</div></div>');

      // Appending the thumbnails
      gallery.after('<div id=' + gallery.id + '-fade-left class="thumbnail-fade left js-fade"></div><div id=' + gallery.id + '-fade-right class="thumbnail-fade right js-fade"></div><div id=' + gallery.id + '-thumbnails class="thumbnail-list js-thumbnail-list">');

      var thumbnails = $('#' + gallery.id + '-thumbnails')

      // Adding each of the thumbnails with image src information passed as parameter
      $(options.images).each(function(ind, val){
        thumbnails.append('<div class="thumbnail-container"><a class="thumbnail js-select-this-img"><img src="' + val +'"/></a></div>')
      });

      // Options for zoom plugin
      if (!options.ezpOptions) {
        options.ezpOptions = {
          zoomWindowOffsetX: 10,
          zoomWindowOffsetY: 0,
          touchEnabled: false
        };
      }

      // element which is zoomed
      var zoomedElement = $('#' + gallery.id);

      // how much time does instructions notice stay on display?
      var instructionsDelay = 3000;

      // set initial zoom state
      var isZoom = false;

      // how much time do animations take?
      var animationTime = 600;

      // original position of lef fad of thumbnails list
      var originalFadeRightPosition = $('#' + gallery.id +'-fade-right').css('left');

      // responsive behaviour trigger
      var mql = window.matchMedia('(max-width: 768px)');
      mql.addListener(handleOrientationChange);

      // function which executes whenever a orientation change happens
      function handleOrientationChange(mql) {

        // event which will trigger zoom
        var trackedEvent = 'click';

        // some actions need to be done on previous zoomed elements
        var previousZoomedElement = zoomedElement;
        zoomedElement = $('#' + gallery.id);

        // clean zoom plugin data
        var ezpData;
        ezpData = zoomedElement.children('img').first().data('ezPlus');
        ezpData ? ezpData.destroy() : null;
        ezpData = previousZoomedElement.children('img').first().data('ezPlus');
        ezpData ? ezpData.destroy() : null;

        // zoom out when orientation change happens
        zoomOut(zoomedElement.children('img').first());

        // set correct height for widget
        setImageContainerHeight(zoomedElement, animationTime);

        if (mql.matches) {
          // MOBILE VIEW

          // hide instructions
          hideInstructions($('#' + gallery.id + ' .js-instructions'), instructionsDelay);

          // unbind triggers from all zoomed elements
          previousZoomedElement.off(trackedEvent);
          zoomedElement.off(trackedEvent);

          // bind tracked event to the element on display
          zoomedElement.on(trackedEvent, toggleZoom);

          // set position of right fade on thumbnail list responsively
          var rightFadePosition = parsePx($('#' + gallery.id +'-fade-left').css('left')) + $('#' + gallery.id +'-fade-right').parent().width() - $('#' + gallery.id +'-fade-right').width();
          $('#' + gallery.id +'-fade-right').css('left', rightFadePosition);

        } else {
          // DESKTOP VIEW

          // Instructions are only for mobile view
          hideInstructions($('#' + gallery.id +' .js-instructions'), 0);

          // unbind triggers from all zoomed elements
          zoomedElement.off(trackedEvent);
          previousZoomedElement.off(trackedEvent);

          // Initialise plugin for zooming in desktop to proper element
          zoomedElement.children('img').first().ezPlus(options.ezpOptions);

          // set position of right fade on thumbnail list to its original state
          $('#' + gallery.id +'-fade-right').css('left', originalFadeRightPosition);
        }
      }

      // function to toggle zoom natively (mobile)
      function toggleZoom(e) {
        (isZoom ? zoomOut : zoomIn)($(e.target));
      }

      // function to zoom out natively (mobile)
      function zoomOut(el) {
        isZoom = false;
        el.css('width', '100%');
      }

      // function to zoom in natively
      function zoomIn(el) {
        isZoom = true;
        hideInstructions($('#' + gallery.id +' .js-instructions'), 0);
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
        return Math.round(parseFloat(px));
      }

      // function to remove from DOM instructions element
      function hideInstructions(instructions, delay) {
        instructions.css('animation-delay', delay / 1000 +'s');
        instructions.css('animation-name', 'zoomOut');
        setTimeout(function(){ $(instructions).remove(); }, delay + animationTime);
      }

      // thumbnail list behaviour
      $('#' + gallery.id + '-thumbnails .js-select-this-img').click(function(){

        // remove active state from all thumbnails
        $('#' + gallery.id + '-thumbnails .js-select-this-img').removeClass('active');

        // set active to the one just clicked
        $(this).addClass('active');

        // set main image to the one selected
        zoomedElement.children('img').first().attr('src',$(this).children('img').attr('src'));

        // set img container height according to contents within
        // (has to be done after zoom out but the call should be done before)
        setImageContainerHeight(zoomedElement, isZoom ? animationTime : 0);

        // Zoom out when we select any thumbnail
        zoomOut(zoomedElement.children('img').first());

        // Force handle orientation change
        handleOrientationChange(mql);
      });

      // choose first image on list by default
      $('#' + gallery.id + '-thumbnails .js-select-this-img').first().click();

      // horizontal scroll behaviour
      $('#' + gallery.id + '-thumbnails').scroll(function(e){

        // horizontal scroll position 0 to 1, where 0 is left edge
        var horizontalScroll = this.scrollLeft / (this.scrollWidth - $(this).innerWidth());
        var startFade = 0.2;

        // fade left opacity, 0 on edge left, 1 on 20% horizontal scroll
        $('#' + gallery.id +'-fade-left').css('opacity', horizontalScroll * 1/startFade);

        // fade right opacity, 0 on edge right, 1 on 80% horizontal scroll
        $('#' + gallery.id +'-fade-right').css('opacity', (1 - horizontalScroll) * 1/startFade);

      });

      // check where we are on the scroll
      $('#' + gallery.id + '-thumbnails').scroll();

      // In order to vertically top align thumbnails, set the container height
      // to the greatest height amongst all thumbnails
      // function setThumbnailHeight(){
      //   var max = 30;
      //   $('#' + gallery.id + ' .js-thumbnail-list img').each(function(index, element){
      //     var thumbnailHeight = parsePx($(element).parent().css('height'));
      //     if (thumbnailHeight > max) {
      //       max = thumbnailHeight;
      //     }
      //   });
      //   $('#' + gallery.id + ' .js-thumbnail-list .thumbnail-container').css('height', max + 'px');
      //   $('#' + gallery.id + ' .js-thumbnail-list').css('height', parseInt(max + 6) + 'px');
      // }

      // setThumbnailHeight();
    };
}( jQuery ));