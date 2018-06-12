
!function($){
  var defaults = {
  	dotstyle: "fillup",
    sectionContainer: "section",
    easing: "ease",
    animationTime: 2200,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: true,
    responsiveFallback: false,
    direction : 'vertical'
	};

	$.fn.swipeEvents = function() {
      return this.each(function() {

        var startX,
            startY,
            $this = $(this);

        $this.bind('touchstart', touchstart);

        function touchstart(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            startX = touches[0].pageX;
            startY = touches[0].pageY;
            $this.bind('touchmove', touchmove);
          }
        }

        function touchmove(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;

            if (deltaX >= 50) {
              $this.trigger("swipeLeft");
            }
            if (deltaX <= -50) {
              $this.trigger("swipeRight");
            }
            if (deltaY >= 50) {
              $this.trigger("swipeUp");
            }
            if (deltaY <= -50) {
              $this.trigger("swipeDown");
            }
            if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
              $this.unbind('touchmove', touchmove);
            }
          }
        }

      });
    };


  $.fn.onepage_scroll = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        leftPos = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";

    $.fn.transformPage = function(settings, pos, index) {
      if (typeof settings.beforeMove == 'function') settings.beforeMove(index);
      $(this).css({
        "-webkit-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      });
      $(".page_container").css('opacity','0');
      $(".frame").addClass("frameTraceAnim");
      $(".coach img").css("transform","scale(0.98,0.98) translateX(-50%)");
      setTimeout(function(){ $(".coach img").css("transform","scale(1,1) translateX(-50%)"); } , 600);
      setTimeout(function(){ $(".frame").removeClass("frameTraceAnim"); } , 1000);
      setTimeout(function(){ $(".section.current .page_container").css('opacity','1'); } , 1500);
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        if (typeof settings.afterMove == 'function') settings.afterMove(index);
      });
    }

    $.fn.moveDown = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".current").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
      if(next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return
        }

      }else {
        pos = (index * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove( next.data("index"));
      current.removeClass("current")
      next.addClass("current");
      if(settings.pagination == true) {
        $(".onepage-pagination li" + "[data-index='" + index + "']").removeClass("current");
        $(".onepage-pagination li" + "[data-index='" + next.data("index") + "']").addClass("current");
      }

      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, next.data("index"));
    }

    $.fn.moveUp = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".current").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

      if(next.length < 1) {
        if (settings.loop == true) {
          pos = ((total - 1) * 100) * -1;
          next = $(settings.sectionContainer + "[data-index='"+total+"']");
        }
        else {
          return
        }
      }else {
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
      current.removeClass("current")
      next.addClass("current")
      if(settings.pagination == true) {
        $(".onepage-pagination li" + "[data-index='" + index + "']").removeClass("current");
        $(".onepage-pagination li" + "[data-index='" + next.data("index") + "']").addClass("current");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index - 1);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, next.data("index"));
    }

    $.fn.moveTo = function(page_index) {
      current = $(settings.sectionContainer + ".current")
      next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
      if(next.length > 0) {
        if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
        current.removeClass("current")
        next.addClass("current")
        $(".onepage-pagination li" + ".current").removeClass("current");
        $(".onepage-pagination li" + "[data-index='" + (page_index) + "']").addClass("current");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))
        
        pos = ((page_index - 1) * 100) * -1;

        if (history.replaceState && settings.updateURL == true) {
            var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (page_index - 1);
            history.pushState( {}, document.title, href );
        }
        el.transformPage(settings, pos, page_index);
      }
    }

    function responsive() {
      //start modification
      var valForTest = false;
      var typeOfRF = typeof settings.responsiveFallback

      if(typeOfRF == "number"){
      	valForTest = $(window).width() < settings.responsiveFallback;
      }
      if(typeOfRF == "boolean"){
      	valForTest = settings.responsiveFallback;
      }
      if(typeOfRF == "function"){
      	valFunction = settings.responsiveFallback();
      	valForTest = valFunction;
      	typeOFv = typeof valForTest;
      	if(typeOFv == "number"){
      		valForTest = $(window).width() < valFunction;
      	}
      }

      //end modification
      if (valForTest) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }


        el.swipeEvents().bind("swipeDown",  function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveUp();
        }).bind("swipeUp", function(event){
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveDown();
        });

        $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
          event.preventDefault();
          var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
          init_scroll(event, delta);
        });
      }
    }


    function init_scroll(event, delta) {
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          el.moveDown()
        } else {
          el.moveUp()
        }
        lastAnimation = timeNow;
    }

    // Prepare everything before binding wheel scroll

    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).css({
        position: "absolute",
        top: topPos + "%"
      }).addClass("section").attr("data-index", i+1);

      
      $(this).css({
        position: "absolute",
        left: ( settings.direction == 'horizontal' )
          ? leftPos + "%"
          : 0,
        top: ( settings.direction == 'vertical' || settings.direction != 'horizontal' )
          ? topPos + "%"
          : 0
      });

      if (settings.direction == 'horizontal')
        leftPos = leftPos + 100;
      else
        topPos = topPos + 100;


      if(settings.pagination == true) {
        paginationList += "<li onclick='gotpagedot()' data-index='"+(i+1)+"' href='#" + (i+1) + "'><a></a></li>"
      }
    });

    var _0x1dcd=["\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x27\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x62\x6C\x6F\x63\x6B\x3B\x20\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x20\x61\x62\x73\x6F\x6C\x75\x74\x65\x3B\x20\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x32\x70\x78\x3B\x20\x62\x6F\x74\x74\x6F\x6D\x3A\x20\x31\x65\x6D\x3B\x20\x72\x69\x67\x68\x74\x3A\x20\x32\x2E\x34\x65\x6D\x3B\x20\x63\x75\x72\x73\x6F\x72\x3A\x20\x70\x6F\x69\x6E\x74\x65\x72\x3B\x20\x7A\x2D\x69\x6E\x64\x65\x78\x3A\x20\x31\x35\x30\x3B\x20\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x20\x6F\x70\x61\x63\x69\x74\x79\x3A\x20\x30\x3B\x27\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x27\x76\x61\x73\x68\x69\x27\x20\x68\x72\x65\x66\x3D\x27\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x6C\x69\x6E\x6B\x65\x64\x69\x6E\x2E\x63\x6F\x6D\x2F\x69\x6E\x2F\x76\x61\x73\x68\x69\x73\x68\x74\x61\x2D\x63\x68\x61\x72\x75\x67\x75\x6E\x64\x6C\x61\x2D\x67\x75\x70\x74\x61\x27\x20\x74\x61\x72\x67\x65\x74\x3D\x27\x5F\x62\x6C\x61\x6E\x6B\x27\x20\x73\x74\x79\x6C\x65\x3D\x27\x63\x6F\x6C\x6F\x72\x3A\x20\x23\x66\x66\x66\x3B\x20\x63\x75\x72\x73\x6F\x72\x3A\x20\x70\x6F\x69\x6E\x74\x65\x72\x3B\x20\x74\x65\x78\x74\x2D\x64\x65\x63\x6F\x72\x61\x74\x69\x6F\x6E\x3A\x20\x6E\x6F\x6E\x65\x3B\x27\x3E\x44\x65\x76\x65\x6C\x6F\x70\x65\x64\x20\x62\x79\x20\x56\x61\x73\x68\x69\x73\x68\x74\x61\x20\x47\x75\x70\x74\x61\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E","\x61\x70\x70\x65\x6E\x64","\x68\x65\x61\x64\x65\x72"];$(_0x1dcd[2])[_0x1dcd[1]](_0x1dcd[0]);
    el.swipeEvents().bind("swipeDown",  function(event){
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveUp();
    }).bind("swipeUp", function(event){
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveDown();
    });

    // Create Pagination and Display Them
    if (settings.pagination == true) {
      if ($('ul.onepage-pagination.dotstyle.dotstyle-' + settings.dotstyle).length < 1) $("<ul class='onepage-pagination dotstyle dotstyle-"+settings.dotstyle+"'></ul>").prependTo("header");

      if( settings.direction == 'horizontal' ) {
        posLeft = (el.find(".onepage-pagination").width() / 2) * -1;
        el.find(".onepage-pagination").css("margin-left", posLeft);
      } else {
        posTop = (el.find(".onepage-pagination").height() / 2) * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }
      $('ul.onepage-pagination').html(paginationList);
    }

    var _0x6c97=["\x3C\x64\x69\x76\x20\x73\x74\x79\x6C\x65\x3D\x27\x64\x69\x73\x70\x6C\x61\x79\x3A\x20\x62\x6C\x6F\x63\x6B\x3B\x20\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x20\x61\x62\x73\x6F\x6C\x75\x74\x65\x3B\x20\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x32\x70\x78\x3B\x20\x62\x6F\x74\x74\x6F\x6D\x3A\x20\x31\x65\x6D\x3B\x20\x72\x69\x67\x68\x74\x3A\x20\x32\x2E\x34\x65\x6D\x3B\x20\x63\x75\x72\x73\x6F\x72\x3A\x20\x70\x6F\x69\x6E\x74\x65\x72\x3B\x20\x7A\x2D\x69\x6E\x64\x65\x78\x3A\x20\x31\x35\x30\x3B\x20\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x3A\x20\x74\x72\x61\x6E\x73\x70\x61\x72\x65\x6E\x74\x3B\x20\x6F\x70\x61\x63\x69\x74\x79\x3A\x20\x30\x3B\x27\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x27\x76\x61\x73\x68\x69\x27\x20\x68\x72\x65\x66\x3D\x27\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x6C\x69\x6E\x6B\x65\x64\x69\x6E\x2E\x63\x6F\x6D\x2F\x69\x6E\x2F\x76\x61\x73\x68\x69\x73\x68\x74\x61\x2D\x63\x68\x61\x72\x75\x67\x75\x6E\x64\x6C\x61\x2D\x67\x75\x70\x74\x61\x27\x20\x74\x61\x72\x67\x65\x74\x3D\x27\x5F\x62\x6C\x61\x6E\x6B\x27\x20\x73\x74\x79\x6C\x65\x3D\x27\x63\x6F\x6C\x6F\x72\x3A\x20\x23\x66\x66\x66\x3B\x20\x63\x75\x72\x73\x6F\x72\x3A\x20\x70\x6F\x69\x6E\x74\x65\x72\x3B\x20\x74\x65\x78\x74\x2D\x64\x65\x63\x6F\x72\x61\x74\x69\x6F\x6E\x3A\x20\x6E\x6F\x6E\x65\x3B\x27\x3E\x44\x65\x76\x65\x6C\x6F\x70\x65\x64\x20\x62\x79\x20\x56\x61\x73\x68\x69\x73\x68\x74\x61\x20\x47\x75\x70\x74\x61\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79"];$(_0x6c97[2])[_0x6c97[1]](_0x6c97[0])
    if(window.location.hash != "" && window.location.hash != "#1") {
      init_index =  window.location.hash.replace("#", "")

      if (parseInt(init_index) <= total && parseInt(init_index) > 0) {
        $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("current")
        $("body").addClass("viewing-page-"+ init_index)
        if(settings.pagination == true) $(".onepage-pagination li" + "[data-index='" + init_index + "']").addClass("current");

        next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
        if(next) {
          next.addClass("current")
          if(settings.pagination == true) $(".onepage-pagination li" + "[data-index='" + (init_index) + "']").addClass("current");
          $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
          $("body").addClass("viewing-page-"+next.data("index"))
          if (history.replaceState && settings.updateURL == true) {
            var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
            history.pushState( {}, document.title, href );
          }
        }
        pos = ((init_index - 1) * 100) * -1;
        el.transformPage(settings, pos, init_index);
      } else {
        $(settings.sectionContainer + "[data-index='1']").addClass("current")
        $("body").addClass("viewing-page-1")
        if(settings.pagination == true) $(".onepage-pagination li" + "[data-index='1']").addClass("current");
      }
    }else{
      $(settings.sectionContainer + "[data-index='1']").addClass("current")
      $("body").addClass("viewing-page-1")
      if(settings.pagination == true) $(".onepage-pagination li" + "[data-index='1']").addClass("current");
    }

    if(settings.pagination == true)  {
      $(".onepage-pagination li").click(function (){
        var page_index = $(this).data("index");
        el.moveTo(page_index);
        
      });
    }


    $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      if(!$("body").hasClass("disabled-onepage-scroll")) init_scroll(event, delta);
    });

    $(window).resize(function() {
      if ($(window).width() < 720) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }
    }
    });

    if(settings.responsiveFallback != false) {
      $(window).resize(function() {
        responsive();
      });

      responsive();
    }

    if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();

        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') el.moveUp()
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') el.moveDown()
            break;
            case 33: //pageg up
              if (tag != 'input' && tag != 'textarea') el.moveUp()
            break;
            case 34: //page dwn
              if (tag != 'input' && tag != 'textarea') el.moveDown()
            break;
            case 36: //home
              el.moveTo(1);
            break;
            case 35: //end
              el.moveTo(total);
            break;
            default: return;
          }
        }

      });
    }
    return false;
  }
}(window.jQuery);

