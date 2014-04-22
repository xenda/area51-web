'use strict';
/* globals Modernizr, jQuery, GMaps, window, document, navigator */
(function (Modernizr, $, GMaps, window, document, navigator) {
  function noop() {
    return Array.prototype.slice.apply(arguments);
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

  // if (GMaps) {
  //   new GMaps({
  //     div: '#map',
  //     lat: -12.043333,
  //     lng: -77.028333,
  //     enableNewStyle: true
  //   });
  // }

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
        var $header  = $('#header .wrap-head'),
            checkMenuChange = function (index) {
              if (index > 1) {
                if (!$header.is('.wrap-head-min')) {
                  $header.addClass('wrap-head-min');
                }
              } else {
                $header.removeClass('wrap-head-min');
              }
            };
        $('#topnav a').each(function (i, item) {
          $(item).attr('href', item.href.replace('sec-', ''));
        });
        $.fn.fullpage({
          'anchors': ['inicio', 'cursos', 'nosotros', 'instructores', 'contacto'],
          'slidesColor': ['none', '#3e3e3e', '#3e3e3e', '#3e3e3e', '#ccc'],
          'scrollOverflow': true,
          'fixedElements': '#header',
          'menu': '#header',
          'paddingTop': '83px',
          'onLeave': function (index, direction) {
            noop(direction);
            checkMenuChange(index);
          },
          'afterLoad': function (anchorLink, index) {
            console.log(anchorLink, index);
            checkMenuChange(index);
          }
          // 'css3': true
        }
        /*{
          // 'autoScrolling': false,
          // 'paddingTop': '5em',
          'scrollingSpeed': 700,
          'easing': 'easeInQuart',
          'fixedElements': '#header',
          'verticalCentered': false,
          'css3': true,
          'slidesColor': ['none', '#3e3e3e', '#3e3e3e', '#3e3e3e', '#3e3e3e'],
          // 'anchors': ['inicio', 'cursos', 'nosotros', 'instructors', 'contact'],
          // 'menu': '#header',
          'navigation': false,
          'scrollOverflow': true,
          // 'afterLoad': function (anchorLink, index) {
          // },
          'onLeave': function (index, direction) {
            console.log(index, direction);
          },
          // afterRender: function () {
          // }
        }*/);
        noop($header);
      }
    }
  }
})(Modernizr, jQuery, GMaps, window, document, navigator);