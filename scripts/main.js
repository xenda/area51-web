'use strict';
/* globals google, Modernizr, jQuery, GMaps, window, document, navigator */
(function (Modernizr, $, GMaps, window, document, navigator) {
  var map = null;
  var markers = [];
  function setGoogleMaps() {
    if (GMaps) {
      map = new GMaps({
        div: '#map',
        lat: -12.043333,
        lng: -77.028333,
        enableNewStyle: true
      });
      markers.miraflores = map.addMarker({
        lat: -12.119148,
        lng: -77.033599,
        title: 'Miraflores',
        infoWindow: {
          content: '<div class="scrollFix">' + 'Hola Mundo<br>K ase?' + '</div>'
        }
      });
      markers.villa = map.addMarker({
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
          };
      return { init : init };
    })();

    Page.init();
  }
  if ($.fn.fullpage) {
    if (!Modernizr.touch) {
      if (!supportBlacklist()) {
        var $header  = $('#header-absolute'),
            $headerWrap = $header.find('.wrap-head'),
            $menuItems = $('.menu a'),
            goToHome = false;

        $menuItems.eq(0).parent().addClass('disabled');
        $menuItems.each(function (i, item) {
          $(item).attr('href', item.href.replace('sec-', '')).bind('click', function () {
            if (i === 0) {
              $headerWrap.addClass('wrap-head-home');
              goToHome = true;
            }
          });
        });
        $header.clone().attr('id', 'header-inner').prependTo($('#sec-inicio'));
        $header.hide();

        $.fn.fullpage({
          'anchors': ['inicio', 'cursos', 'nosotros', 'instructores', 'contacto'],
          'slidesColor': ['none', '#3e3e3e', '#3e3e3e', '#3e3e3e', '#ccc'],
          'scrollOverflow': true,
          'scrollingSpeed': 1000,
          'fixedElements': '#header-absolute',
          'menu': '#header-absolute',
          'paddingTop': '83px',
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
          }
        });
        $('#sec-inicio .slide').each(function (i) {
          var $dot = $('<span class="toSlide" data-index="' + (i+1) + '"/>');
          $('#nav-dots').append($dot);
        });
        // Course Tabs
        $('.wrap-tabs').each(function () {
          var $tabs = $(this),
              $tabsContent = $tabs.find('.tab-content'),
              tabsParentContainerHeight = $tabs.find('.wrap-tab-content').height(),
              tabSelectedId = null,
              tabCurrent = '';
          $tabsContent.css('height', tabsParentContainerHeight).filter(':not(.active)').slideUp();
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

        $.noop($header);
      } else {
        setGoogleMaps();
      }
    }
  }

  // See Maps
  function showContactInfo() {
    $('#return-contacto').fadeOut();
    $('#contact-content, #map-overlay').fadeIn();
  }
  $('#return-contacto').bind('click', function () {
    showContactInfo();
  }).hide();
  $('.see-map').bind('click', function (event) {
    if (!supportBlacklist()) {
      event.preventDefault();
      var selected = $(this).parents('.tab-content').attr('id').split('direccion-')[1];
      google.maps.event.trigger(markers[selected], 'click');
      $('#contact-content, #map-overlay').fadeOut();
      $('#return-contacto').fadeIn();
    }
  });
})(Modernizr, jQuery, GMaps, window, document, navigator);