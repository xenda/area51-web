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
            var marginTop = (screen.height - 500) / 2;
            $('.gallery').css('margin-top', marginTop);
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

          var marginTop = ($('.gallery').parent().outerHeight() - $('.gallery').outerHeight()) / 2;
          $('.gallery').css('margin-top', marginTop);
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
        'afterLoad': function (anchorLink, index) {
          $headerWrap.removeClass('wrap-head-home');
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
          /*var wow = new WOW(
            {
              boxClass:     'wow',      // default
              animateClass: 'animated', // default
              offset:       0          // default
            }
          )
          wow.init();*/
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
    if ($navbarBtn.height() + $navbarBtn.offset().top > 70) {
      $navbarBtn.css({'position': 'fixed', 'top': '10px'});
    } else {
      $navbarBtn.css({'position': 'relative', 'top': 'auto'});
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

      $('.nosotros-content').fadeOut();
      $('.nosotros-gallery').fadeIn();

      galleryWidth = $('.gallery').width();
      galleryHeight = $('.gallery').height();
    });

  $(document).on('mouseover', '.gallery .item', function() {
    var imageURL = $(this).find('img').attr('src');
    imageURL = imageURL.replace('150', galleryWidth);
    imageURL = imageURL.replace('150', galleryHeight);

    if (cachedImages[imageURL] !== undefined) {
      return;
    }

    var image = new Image();
    image.src = imageURL;
    $(image).one('load', function() {
      cachedImages[imageURL] = image;
    });
  });

  $(document).on('click', '.gallery .item', function() {
    var image = $(this).find('img'),
        imageURL = image.attr('src');
    imageURL = imageURL.replace('150', galleryWidth);
    imageURL = imageURL.replace('150', galleryHeight);

    var scaleX = galleryWidth / $(this).outerWidth();
    var scaleY = galleryHeight / $(this).outerHeight();

    image.attr('src', imageURL);
    $(this).css({
      '-webkit-transition': 'all 0.8s',
      '-webkit-transform': 'scale(' + scaleX + ', ' + scaleY + ')',
      '-webkit-transform-origin': 'center center'
    });
  });

  $('.return-nosotros')
    .bind('click', function(e) {
      e.preventDefault();
      
      $('.nosotros-content').fadeIn();
      $('.nosotros-gallery').fadeOut();
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
})(Modernizr, jQuery, GMaps, window, document, navigator);