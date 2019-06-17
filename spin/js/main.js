var m = require('mithril');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');

var PI = Math.PI;
var TAU = PI * 2;

var IMGS = [
    "http://img.modem.studio/CC0-big/CC0-img-135.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-125.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-59.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-30.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-19.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-6.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-13.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-155.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-166.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-154.jpg"
]

var MIN_ANGLE = -PI / 2;
var MAX_ANGLE = ( IMGS.length - 1 ) * PI - MIN_ANGLE;

var angle = MIN_ANGLE;

var lastTilt;

window.addEventListener('deviceorientation', e => {
    
    if ( lastTilt === undefined ) {
        
        lastTilt = e.gamma;
        
    }
    
    angle -= ( ( e.alpha - lastTilt ) / 360 ) * ( Math.PI * 2 );
    
    lastTilt = e.alpha;
    
    m.redraw();
    
});

m.mount(document.body, {
    
    view: vnode => {
        
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        
        var diagonal = Math.sqrt( ww * ww + wh * wh );
        
        var leftImgIndex = Math.floor( ( angle - MIN_ANGLE ) / TAU ) * 2 + 1;
        var rightImgIndex = Math.floor( ( angle - MIN_ANGLE + PI ) / TAU ) * 2;
        
        return m('main',
        
            {
                onmousemove: e => {
                    
                    var x = e.clientX;
                    var y = e.clientY;
                    var cx = ww / 2;
                    var cy = wh / 2;
                    var a = Math.atan2( y - cy, x - cx );
                    
                    var dA = a - ( angle % TAU );
                    dA += dA > PI ? -TAU : dA < -PI ? TAU : 0;
                    
                    angle += dA;
                    
                    angle = Math.min( Math.max( angle, MIN_ANGLE ), MAX_ANGLE );
                    
                }
                
            },
            
            IMGS.map( ( src, i ) => {
                
                return m('img.image', {
                    src: IMGS[ i ],
                    class: [
                        i === leftImgIndex ? 'image_left' : '',
                        i === rightImgIndex ? 'image_right' : '',
                    ].join(' ')
                })
                
            }),
            
            m('.spinner',
                {
                    style: {
                        width: diagonal + 'px',
                        height: diagonal / 2 + 'px',
                        [ PREFIXED_TRANSFORM ]: `translate(-50%, -100%) rotate(${ angle }rad)`
                    }
                }
            )
            
        )
        
    }
    
})