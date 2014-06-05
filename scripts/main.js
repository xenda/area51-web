'use strict';
/* globals google, Modernizr, jQuery, GMaps, window, document, navigator */
(function (Modernizr, $, GMaps, window, document, navigator) {
  var map = null;
  var markers = [];
  var galleryWidth,
      galleryHeight,
      cachedImages = {};
  function setGoogleMaps() {
    if (GMaps) {
      map = new GMaps({
        div: '#map',
        lat: -12.043333,
        lng: -77.028333,
        enableNewStyle: true
      });
      markers.miraflores = map.addMarker({ // GMarker de Miraflores
        lat: -12.119148,
        lng: -77.033599,
        title: 'Miraflores',
        infoWindow: {
          content: '<div class="scrollFix">' + 'Hola Mundo<br>K ase?' + '</div>'
        }
      });
      markers.villa = map.addMarker({ // GMarker de Villa
        lat: -12.204662,
        lng: -77.013107,
        title: 'Villa',
        infoWindow: {
          content: '<div class="scrollFix">' + 'Hola Mundo<br>K ase?' + '</div>'
        }
      });
      map.fitZoom();
    }
  }
  function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
    // return true;
  }
  function supportBlacklist() {
    var w = window,
      ua = navigator.userAgent,
      platform = navigator.platform,
      // Rendering engine is Webkit, and capture major version
      wkmatch = ua.match(/AppleWebKit\/([0-9]+)/),
      wkversion = !!wkmatch && wkmatch[1],
      ffmatch = ua.match(/Fennec\/([0-9]+)/),
      ffversion = !!ffmatch && ffmatch[1],
      operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/),
      omversion = !!operammobilematch && operammobilematch[1];
    if (
    // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less or equal to 534 (ios5)
    ((platform.indexOf('iPhone') > -1 || platform.indexOf('iPad') > -1  || platform.indexOf('iPod') > -1) && wkversion && wkversion <= 534) ||
    // Opera Mini
    (w.operamini && ({}).toString.call(w.operamini) === '[object OperaMini]') ||
    (operammobilematch && omversion < 7458) ||
    //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
    (ua.indexOf('Android') > -1 && wkversion && wkversion < 533) ||
    // Firefox Mobile before 6.0 -
    (ffversion && ffversion < 6) ||
    // WebOS less than 3
    ('palmGetResource' in window && wkversion && wkversion < 534) ||
    // MeeGo
    (ua.indexOf('MeeGo') > -1 && ua.indexOf('NokiaBrowser/8.5.0') > -1)) {
      return true;
    }
    return false;
  }

  if ($.fn.slitslider) {
    var Page = (function () {
      var $nav = $('#nav-dots > span'),
          slitslider = $('#slider').slitslider({
          onBeforeChange : function (slide, pos) {
              $nav.removeClass('nav-dot-current');
              $nav.eq(pos).addClass('nav-dot-current');
            }
        }),
          init = function () {
            initEvents();
          },
          initEvents = function () {
            $nav.each(function (i) {
              $(this).on('click', function () {
                var $dot = $(this);
                if (!slitslider.isActive()) {
                  $nav.removeClass('nav-dot-current');
                  $dot.addClass('nav-dot-current');
                }
                slitslider.jump(i + 1);
                return false;
              });
            });

            var container = $('.background-container');
            container.on('transitionend', '.background.current', function(e) {
              var current = $(e.target),
                  next = current.next();

              current.removeClass('current');

              if (current.is(':last-child')) {
                next = current.siblings().first();
              }

              next.addClass('current');
            });

            $(window).on('load', function() {
              var current = $('.background.current'),
                  next = current.next();

              current.removeClass('current');
              next.addClass('current');
            });
          };
      return { init : init };
    })();

    Page.init();
  }
  if ($.fn.fullpage) {
    // Si el navegador está registrado en el blacklist, no salta el script
    var $header  = $('#header-absolute'),
        $headerWrap = $header.find('.wrap-head'),
        $menuItems = $('.menu a'),
        goToHome = false;

    $header.clone().attr('id', 'header-inner').prependTo($('#sec-inicio'));
    $header.hide();

    if (!supportBlacklist() && !isMobile()) {
      $('html').addClass('fullpage');
      $menuItems.eq(0).parent().addClass('disabled');
      $menuItems.each(function (i, item) {
        $(item).attr('href', item.href.replace('sec-', '')).bind('click', function () {
          if (i === 0) {
            $headerWrap.addClass('wrap-head-home');
            goToHome = true;
          }
        });
      });

      $.fn.fullpage({
        'anchors': ['inicio', 'cursos', 'nosotros', 'instructores', 'contacto'],
        'slidesColor': ['none', '#3e3e3e', '#3e3e3e', '#3e3e3e', '#ccc'],
        'scrollingSpeed': 700,
        'easing': 'easeInOutCirc',
        'fixedElements': '#header-absolute',
        'menu': '#header-absolute',
        'paddingTop': '83px',
        'touchSensitivity': 10,
        'autoScrolling': true,
        'scrollOverflow': true,
        'onResize': function (w, h) {
          // console.log('resized', w, h);
          if (h < 680) {
            $.fn.fullpage.setAutoScrolling(false);
            $.fn.fullpage.setAllowScrolling(false);
          } else {
            $.fn.fullpage.setAutoScrolling(true);
            $.fn.fullpage.setAllowScrolling(true);
          }
        },
        'onLeave': function (index, direction) {
          $.noop(direction);
          if ((index === 2 && direction === 'up') || goToHome) {
            $headerWrap.addClass('wrap-head-home');
            setTimeout(function () {
              $header.hide();
            }, 500);
          }
          $('#map').empty().removeAttr('style');
          map = null;
          setTimeout(function () {
            showContactInfo();
          }, 900);
        },
        afterPageScroll: function(page) {
          if (!page.find('.animated').hasClass('wow')) {
            page.find('.animated').addClass('wow');
          }

          var wow = new WOW(
            {
              boxClass:     'wow',      // default
              animateClass: 'animated', // default
              offset:       0          // default
            }
          )
          wow.init();
        },
        'afterLoad': function (anchorLink, index) {
          $headerWrap.removeClass('wrap-head-home');
          // console.log($('html').height() - 83);
          // $('#fullpage').children().height($('html').height() - 83);
          if (index === 1) {
            $header.hide();
          } else if (index > 1) {
            $menuItems.eq(0).parent().removeClass('disabled');
            goToHome = false;
            $header.show();
            $headerWrap.addClass('wrap-head-min');
            if (anchorLink === 'contacto') {
              setGoogleMaps();
            }
          }
          var indexBlacks = [3, 5]; // Las secciones se oscurecerá el menu
          if (indexBlacks.indexOf(index) !== -1) {
            $header.addClass('darker');
            $header.find('.logo img').attr('src', 'images/logo_area51_black.png');
          } else {
            $header.removeClass('darker');
            $header.find('.logo img').attr('src', 'images/logo_area51.png');
          }
        },
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
          console.log(anchorLink, index, slideAnchor, slideIndex);
          $('#nav-dots span:eq(' + slideIndex + ')').addClass('nav-dot-current').siblings().removeClass('nav-dot-current');
        }
      });
      $.noop($header);
    } else {
      setGoogleMaps();
    }
  }
  // See Maps
  var $mapOverlay = $('#contact-content, #map-overlay'),
      $navbarBtn = $('.navbar-toggle'),
      $mainFooter = $('#main-footer');
  function showContactInfo() {
    $('#return-contacto').fadeOut();
    $mapOverlay.fadeIn();
  }

  function checkOffset() {
    //var $navbar = $($navbarBtn.data('target'));
    if ($navbarBtn.height() + $navbarBtn.offset().top > 70) {
      $navbarBtn.css({'position': 'fixed', 'top': '10px'});
      //$navbar.css({'position': 'fixed', 'top': '50px'});
    } else {
      $navbarBtn.css({'position': 'relative', 'top': 'auto'});
      //$navbar.css({'position': 'fixed', 'top': '137px'});
    }
  }

  $('#sec-inicio .slide').each(function (i) {
    var $dot = $('<span class="toSlide animated wow fadeIn" data-index="' + (i + 1) + '"/>');
    $('#nav-dots').append($dot);
  });

  if (isMobile()) {
    $('#nav-dots').find('.toSlide').bind('click', function () {
      var slideIndex = parseInt($(this).data('index'), 10);
      $('#nav-dots span:eq(' + (slideIndex - 1) + ')').addClass('nav-dot-current').siblings().removeClass('nav-dot-current');
      $('#sec-inicio .slide').hide().removeClass('active').filter(':eq(' + (slideIndex - 1) + ')').show().addClass('active');
    }).filter(':eq(0)').trigger('click');

    var $navbar = $($navbarBtn.data('target'));

    $navbar.bind('click', function() {
      $navbar.removeClass('active');
      $('#fullpage').removeClass('pushed');
    });

    $navbarBtn.bind('click', function() {
      var target = $($(this).data('target'));
      var fullpage = $('#fullpage');

      target.find('a').each(function(index, item) {
        var href = $(item).attr('href');

        if (href.indexOf('#sec-') === -1) {
          $(item).attr('href', href.replace('#', '#sec-'));
        }
      });

      target.removeClass('animated slideInDown');

      if (target.hasClass('active')) {
        target.removeClass('active');
        fullpage.removeClass('pushed');
      }
      else {
        target.addClass('active');
        fullpage.addClass('pushed');
      }

      // if (target.hasClass('active')) {
      //   target.removeClass('slideInDown').addClass('slideOutUp');

      //   window.setTimeout(function() {
      //     target.removeClass('active');
      //   }, 1000);
      // }
      // else {
      //   target.removeClass('slideOutUp').addClass('slideInDown').addClass('active');
      // }
    });


    $(document).bind('scroll', function () {
      checkOffset();
    });
  }
  // Course Tabs
  $('.wrap-tabs').each(function () {
    var $tabs = $(this),
        $tabsContent = $tabs.find('.tab-content'),
        tabsParentContainerHeight = $tabs.find('.wrap-tab-content').height(),
        tabSelectedId = null,
        tabCurrent = '';
    if (!isMobile()) {
      $tabsContent.css('height', tabsParentContainerHeight);
    }
    $tabsContent.filter(':not(.active)').slideUp();
    $tabs.find('.list_tab li a').bind('click', function (event) {
      event.preventDefault();
      tabSelectedId = $(this).attr('href').split('#');
      tabCurrent = '#' + tabSelectedId[tabSelectedId.length - 1];
      if (!$(tabCurrent).is('.active')) {
        $tabsContent.filter('.active').slideUp().removeClass('active');
        $tabsContent.filter(tabCurrent).slideDown().addClass('active');
        $(this).parent().siblings().find('a').removeClass('active');
        $(this).addClass('active');
      }
    });
  });

  $('#return-contacto')
    .bind('click', function () {
      showContactInfo();
    })
    .hide();

  $('.see-gallery')
    .bind('click', function(e) {
      e.preventDefault();

      $('#sec-nosotros').height($('#sec-nosotros').height());

      $('.nosotros-content').fadeOut();
      $('.nosotros-gallery').removeClass('hidden');

      galleryWidth = $('.gallery').width();
      galleryHeight = $('.gallery').height();
    });

  $(document).on('mouseover', '.gallery .item', function() {
    var imageURL = $(this).find('img').attr('src');
    imageURL = imageURL.replace('thumbs', 'originals');

    if (cachedImages[imageURL] !== undefined) {
      return;
    }

    var image = new Image();
    image.src = imageURL;
    $(image).one('load', function() {
      cachedImages[imageURL] = image;
    });
  });

  function hidePhotoBig() {
    var photoBig = $('#photo-big');

    photoBig.attr('class', 'animated fadeOut');

    window.setTimeout(function() {
      photoBig.hide();
      photoBig.removeClass('active');
    }, 1001);
  }

  $(document).one('click', hidePhotoBig);

  $(document).on('click', '.gallery .item', function(e) {
    var image = $(this).find('img'),
        figure = $(this),
        photoBig = $('#photo-big');

    var imageURL = $(this).find('img').attr('src');
    imageURL = imageURL.replace('thumbs', 'originals');

    if (!photoBig.hasClass('active')) {
      photoBig.attr('class', 'animated').hide().css({
        'width': '100%',
        'height': '100%',
        'display': 'block',
        'opacity': 0,
        'background': '#000 url("/images/ajax-loader.gif") no-repeat center center',
        'background-size': 'auto auto'
      }).addClass('fadeIn');

      window.setTimeout(function() {
        photoBig.addClass('active');
        //$(document).off('click', hidePhotoBig);
      }, 10);

      window.setTimeout(function() {
        photoBig.css({
          'background': 'url("' + imageURL + '") no-repeat center center, #000 url("/images/ajax-loader.gif") no-repeat center center',
          'background-size': 'contain, auto auto'
        });
      }, 250);
    }
  });

  $(document).on('click', '.gallery #photo-big', function(e) {
    e.stopPropagation();
    hidePhotoBig();
  });

  $('.return-nosotros')
    .bind('click', function(e) {
      e.preventDefault();

      $('#sec-nosotros').height('');
      
      $('.nosotros-content').fadeIn();
      $('.nosotros-gallery').addClass('hidden');
    });

  $('.see-map')
    .bind('click', function (event) {
      if (!supportBlacklist()) {
        event.preventDefault();
        var selected = $(this).parents('.tab-content').attr('id').split('direccion-')[1];
        map.setCenter(markers[selected].getPosition());
        google.maps.event.trigger(markers[selected], 'click');
        $mapOverlay.fadeOut();
        $('#return-contacto').fadeIn();
      }
    });

  $(document).on('click', '.wrap-courses-logo figure', function() {
    var title = $(this).data('title'),
        caption = $(this).find('figcaption'),
        captionText = caption.text();

    caption.text(title);
    $(this).data('title', captionText);
  });
})(Modernizr, jQuery, GMaps, window, document, navigator);