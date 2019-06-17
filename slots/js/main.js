var m = require('mithril');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');

var MARGIN = 200;

var content = [
    "http://img.modem.studio/CC0-big/CC0-img-119.jpg",
    [
        "http://img.modem.studio/CC0-big/CC0-img-137.jpg",
        "http://img.modem.studio/CC0-big/CC0-img-145.jpg",
        "http://img.modem.studio/CC0-big/CC0-img-123.jpg",
        [
            "http://img.modem.studio/CC0-big/CC0-img-121.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-110.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-100.jpg",
        ],
        "http://img.modem.studio/CC0-big/CC0-img-138.jpg",
        "http://img.modem.studio/CC0-big/CC0-img-131.jpg",
        [
            "http://img.modem.studio/CC0-big/CC0-img-22.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-81.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-67.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-118.jpg",
            [
                "http://img.modem.studio/CC0-big/CC0-img-59.jpg",
                "http://img.modem.studio/CC0-big/CC0-img-96.jpg"
            ],
            "http://img.modem.studio/CC0-big/CC0-img-103.jpg",
            "http://img.modem.studio/CC0-big/CC0-img-44.jpg",
        ]
    ],
    "http://img.modem.studio/CC0-big/CC0-img-116.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-70.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-65.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-99.jpg"
]

function nestedLength( array, total = 0 ) {
    
    for ( var i = 0; i < array.length; i++ ) {
        
        if ( Array.isArray( array[ i ] ) ) {
            
            total += nestedLength( array[ i ] )
            
        } else {
            
            total += 1;
            
        }
        
    }
    
    return total;
    
}

var Slots = {
    
    view: vnode => {
        
        var st = vnode.attrs.scrollTop;
        
        var children = vnode.attrs.children.map( ( item, i ) => {
            
            if ( Array.isArray( item ) ) {
                
                var st2 = vnode.attrs.scrollTop - nestedLength( vnode.attrs.children.slice(0, i) );
                
                st2 = Math.max( 0, Math.min( st2, nestedLength( item ) - 1 ) );
                
                st -= st2;
                
                return m( Slots, {
                    children: item,
                    width: vnode.attrs.width - MARGIN,
                    height: vnode.attrs.height - MARGIN,
                    scrollTop: st2
                })
                
            } else {
                
                return m( Image, {
                    url: item,
                    width: vnode.attrs.width - MARGIN,
                    height: vnode.attrs.height - MARGIN
                })
                
            }

        })
        
        var y = -st * vnode.attrs.height;
        
        return m('.item.slots',
            {
                class: vnode.attrs.root ? 'root' : '',
                style: {
                    width: vnode.attrs.width + 'px',
                    height: vnode.attrs.height + 'px'
                }
            },
            m('.slots__inner',
                {
                    style: { [ PREFIXED_TRANSFORM ]: `translateY(${ y }px)` }
                },
                
                children
                
            )
        )
        
    }
    
}

var Image = {
    
    view: vnode => {
        
        return m('.item.image',
            {
                style: {
                    backgroundImage: `url( ${ vnode.attrs.url } )`,
                    width: vnode.attrs.width + 'px',
                    height: vnode.attrs.height + 'px'
                }
            }
        )
        
    }
    
}

m.mount( document.body, {
    
    view: vnode => {
        
        return [
            
            m( '.sizer',
                {
                    style: {
                        height: nestedLength( content ) * 100 + '%'
                    }
                }
            ),
            
            m( Slots,
                {
                    root: true,
                    scrollTop: window.pageYOffset / window.innerHeight,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    offset: 0,
                    depth: 0,
                    children: content
                }
            )
        ]
        
    }
    
})

window.addEventListener( 'scroll', m.redraw );
window.addEventListener( 'resize', m.redraw );