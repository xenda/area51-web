var $html = $("html");
var $body = $('body');

if (typeof console !== 'object') { console = { log: function () {} }}

if (GMaps) {
  map = new GMaps({
      div: '#map',
      lat: -12.043333,
      lng: -77.028333,
      enableNewStyle: true
    });
}


if($.fn.slitslider){
    var Page = (function() {
    var $nav = $( '#nav-dots > span' ),
      slitslider = $( '#slider' ).slitslider( {
        onBeforeChange : function( slide, pos ) {
          $nav.removeClass( 'nav-dot-current' );
          $nav.eq( pos ).addClass( 'nav-dot-current' );
        }
      } ),
      init = function() {
        initEvents();
      },
      initEvents = function() {
        $nav.each( function( i ) {
          $( this ).on( 'click', function( event ) {
            var $dot = $( this );
            if( !slitslider.isActive() ) {
              $nav.removeClass( 'nav-dot-current' );
              $dot.addClass( 'nav-dot-current' );
            }
            slitslider.jump( i + 1 );
            return false;
          });
        });
      };
      return { init : init };
    })();

    Page.init();
  }

if ($.fn.fullpage) {
  $.fn.fullpage({
    'paddingTop': '3em',
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
    'afterLoad': function(anchorLink, index){
    },
    'onLeave': function(index, direction){
    },
    afterRender: function(){}

  });
}