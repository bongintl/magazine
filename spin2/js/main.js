var m = require('mithril');
var unzip = require('lodash/unzip');
var CLIP_PATH = '-webkit-clip-path'//require('detectcss').prefixed('clip-path');

var src = i => `http://img.modem.studio/CC0-big/CC0-img-${i}.jpg`;

var image = modifier => src => () => m('.image', {
    class: modifier ? 'image_' + modifier : '',
    style: {
        backgroundImage: `url(${src})`
    }
})

var nothing = () => '';
var full = image('full');
var frame = image('frame');
var frameLeft = image('frame-left');
var frameRight = image('frame-right');
var top = image('top');
var bottom = image('bottom');
var fullLeft = image('full-left');
var fullRight = image('full-right');
var title = text => () => m( '.title', text );
var titleLeft = text => () => m( '.title.title_left', text );
var titleRight = text => () => m( '.title.title_right', text );

var spreads = [
    [ title('New Document 1'), full( src( 1 ) ) ],
    [ titleLeft('CC-0'), titleRight('CC-0') ],
    [ title('Coyright-free imagery collected by by Modem Studio'), frame( src( 2 ) ) ],
    [ nothing, bottom( src( 79 ) ) ],
    [ top( src( 78 ) ), nothing, ],
    [ frame( src( 5 ) ), frame( src( 6 ) ) ],
    [ fullLeft( src( 161 ) ), nothing ],
    [ nothing, fullRight( src( 161 ) ) ],
    [ bottom( src( 8 ) ), nothing ],
    [ frame( src( 9 ) ), frame( src( 10 ) ) ],
    [ frame( src( 11 ) ), fullRight( src( 12 ) ) ],
    [ fullLeft( src( 12 ) ), frame( src( 143 ) ) ],
    [ nothing, full( src( 93 ) ) ],
    [ frame( src( 14 ) ), frame( src( 15 ) ) ],
    [ nothing, frameRight( src( 16 ) ) ],
    [ frameLeft( src( 16 ) ), nothing ],
    [ nothing, full(  src( 64 )  ) ],
    [ nothing, frame( src( 77 ) ) ],
    [ nothing, frame( src( 142 ) ) ],
    [ fullLeft( src( 88 ) ), fullRight( src( 88 ) ) ],
    [ frame(  src( 89 )  ), nothing ],
    [ frame(  src( 47 )  ), nothing ],
    [ frame(  src( 131 )  ), nothing ],
    [ frameLeft( src( 31 ) ), frameRight( src( 31 ) ) ],
    [ bottom(  src( 113 )  ), top( src( 108 ) ) ],
    [ nothing, frameRight( src( 44 ) ) ],
    [ frameLeft( src( 44 ) ), nothing ],
    [ nothing, fullRight( src( 166 ) ) ],
    [ fullLeft( src( 166 )  ), frame( src( 36 ) ) ],
    [ frame( src( 19 ) ), fullRight(  src( 166 )  ) ],
    [ fullLeft( src( 90 ) ), frame( src( 84 ) ) ],
    [ frame( src( 126 ) ), fullRight( src( 90 ) ) ],
    [ frameLeft( src( 25 ) ), nothing ],
    [ frame( src( 24 ) ), frameRight( src( 25 ) ) ],
    [ frame(  src( 34 )  ), top( src( 29 ) ) ],
    [ nothing, nothing ]
]

var layers = unzip( spreads.map( ( spread, i ) => i % 2 ? spread.reverse() : spread ) );

//layers[ 1 ] = layers

// var layer1 = [
//     "https://pbs.twimg.com/media/CXuM9BNWwAAy-bb.png:large",
//     "https://format-com-cld-res.cloudinary.com/image/private/s--4sJN4fHv--/c_limit,g_center,h_65535,w_1600/a_auto,fl_keep_iptc.progressive,q_95/21448-2524679-IMG_9817.jpg",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/58acbc4b6b8f5b0606d7275a/1488305449639/ves2.jpg?format=2500w",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/5898b9b837c58185b5f20668/1488305460169/jm_blundering_hurdle_lo_res.jpg?format=2500w",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/58b5bc63ff7c506c655b5e8a/1488983489824/jm_low_bundle_lo_res.jpg?format=2500w"
// ]

// var layer2 = [
//     "https://pbs.twimg.com/media/CXuM9BNWwAAy-bb.png:large",
//     "https://format-com-cld-res.cloudinary.com/image/private/s--4sJN4fHv--/c_limit,g_center,h_65535,w_1600/a_auto,fl_keep_iptc.progressive,q_95/21448-2524679-IMG_9817.jpg",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/58acbc4b6b8f5b0606d7275a/1488305449639/ves2.jpg?format=2500w",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/5898b9b837c58185b5f20668/1488305460169/jm_blundering_hurdle_lo_res.jpg?format=2500w",
//     "https://static1.squarespace.com/static/565c7cf3e4b0b80773acefc5/581a24534402432cd0dfd5fc/58b5bc63ff7c506c655b5e8a/1488983489824/jm_low_bundle_lo_res.jpg?format=2500w"
// ].reverse()

var { PI, cos, sin, sqrt } = Math;
var TAU = PI * 2;

var MIN_ANGLE = -PI / 2;
var MAX_ANGLE = ( spreads.length - 1 ) * PI + MIN_ANGLE;

var cssMask = ( ...pts ) => `polygon( ${ pts.map( p => p.map( x => x + 'px' ).join(' ') ).join(', ')  } )`;

var coverHalf = ( angle, w, h ) => {
    
    var cx = w / 2;
    var cy = h / 2;
    
    var length = sqrt( cx * cx + cy * cy );
    
    var dx = cos( angle ) * length;
    var dy = sin( angle ) * length;
    
    var end1 = [ cx + dx, cy + dy ];
    var end2 = [ cx - dx, cy - dy ];
    
    var ox = cos( angle + PI / 2 ) * length;
    var oy = sin( angle + PI / 2 ) * length;
    
    var offset1 = [ end1[ 0 ] + ox, end1[ 1 ] + oy ];
    var offset2 = [ end2[ 0 ] + ox, end2[ 1 ] + oy ];
    
    return cssMask( end1, offset1, offset2, end2 );
    
}

// var Marker = {
    
//     view: vnode => {
        
//         var { x, y, w = 20, h = 20, visible = true } = vnode.attrs;
        
//         return m('div', {
//             style: {
//                 position: 'fixed',
//                 top: y - h / 2 + 'px',
//                 left: x - w / 2 + 'px',
//                 width: w + 'px',
//                 height: h + 'px',
//                 background: 'blue',
//                 display: visible ? 'block' : 'none'
//             }
//         })
        
//     }
    
// }

m.mount( document.body, {
    
    oninit: vnode => {
        
        vnode.state.angle = MIN_ANGLE;
        
    },
    
    view: vnode => {
        
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        
        var dA = vnode.state.angle - MIN_ANGLE;
        
        var i1 = Math.min( Math.floor( ( dA + PI ) / TAU ) * 2, spreads.length - 1 );
        var i2 = Math.min( Math.floor( dA / TAU ) * 2 + 1, spreads.length - 1 );
        
        return m('.main',
        
            {
                onmousemove: e => {
                    
                    var angle = vnode.state.angle;
                    
                    var x = e.clientX;
                    var y = e.clientY;
                    var cx = ww / 2;
                    var cy = wh / 2;
                    var a = Math.atan2( y - cy, x - cx );
                    
                    var dA = a - ( angle % TAU );
                    dA += dA > PI ? -TAU : dA < -PI ? TAU : 0;
                    
                    angle += dA;
                    
                    angle = Math.min( Math.max( angle, MIN_ANGLE ), MAX_ANGLE );
                    
                    vnode.state.angle = angle;
                    
                }
                
            },
            
            m('.line', 
                {
                    style: {
                        transform: `translate(-50%, -50%) rotate(${vnode.state.angle}rad)`,
                        width: Math.sqrt( ww * ww + wh * wh ) + 'px'
                    }
                }
            ),
            
            m('.layer',
                {
                    style: {
                        [ CLIP_PATH ]: coverHalf( vnode.state.angle + PI, ww, wh )
                    }
                },
                m('.layer__left',
                    layers[ 0 ][ i1 ]()
                ),
                m('.layer__right',
                    layers[ 0 ][ i2 ]()
                )
            ),
            
            m('.layer',
                {
                    style: {
                        [ CLIP_PATH ]: coverHalf( vnode.state.angle, ww, wh ),
                        // background: 'black',
                        // color: 'white'
                    }
                },
                m('.layer__left',
                    layers[ 1 ][ i2 ]()
                ),
                m('.layer__right',
                    layers[ 1 ][ i1 ]()
                )
            )
            
            // ends( vnode.state.angle, ww, wh ).map( ( [x, y] ) => m( Marker, { x, y } ) )
            
            // edges( ww, wh )
            //     .map( edge => intersect( [ vnode.state.angle, 0 ], edge ) )
            //     .map( ([x, y]) => [ x * ww / 2 + ww / 2, y * wh / 2 + wh / 2 ])
            //     .map( ([x, y]) => m(Marker, { x, y } ))
            
        )
        
    }
    
})

window.addEventListener( 'resize', m.redraw );