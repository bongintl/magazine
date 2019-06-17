var m = require('mithril');
var findLastIndex = require('lodash/findLastIndex');

var TYPING_SPEED = 30;
var MAX_DELAY = 1500;
var TAB_DELAY = 5000;

window.addEventListener('keydown', e => {
    
    if ( e.keyCode === 65 ) {
        TYPING_SPEED /= 10;
        MAX_DELAY /= 10;
        TAB_DELAY /= 10;
    }
    
})

var maxTab = tabs => findLastIndex( tabs, tab => {
    
    return tab.paragraphs[ 0 ][ 0 ].sent;
    
})

var odds = ( tabs, max ) => tabs.map( ( tab, i ) => {
        
    if ( tab.typing ) return 0;
    
    if ( i === max + 1 ) return .15;
    
    if ( i > max ) return 0;
    
    var done = tab.paragraphs.every( paragraph => {
        
        return paragraph.every( sentence => sentence.sent );
        
    })
    
    if ( done ) return 0;
    
    return 1;
    
});

var normalizeOdds = odds => {
    
    if ( odds.every( c => c === 0 ) ) return [];
    
    var sum = odds.reduce( ( a, c ) => a + c );
    
    return odds.map( c => c / sum );
    
}

var choose = odds => {
    
    var r = Math.random();
    var acc = 0;
    
    for ( var i = 0; i < odds.length; i++ ) {
        
        acc += odds[ i ];
        
        if ( r <= acc ) {
            
            return i;
            
        }
        
    }
    
    return false;
    
}

var nextUnsent = tab => {
    
    var ret;
    
    tab.paragraphs.find( paragraph => paragraph.find( sentence => {
        
        if ( !sentence.sent ) {
            
            ret = sentence;
            return true;
            
        }
        
    }))
    
    return ret;
    
}

module.exports = data => {
    
    var notificationId = 0;

    var state = {
        
        tabs: data.map( ( story, i ) => {
        
            return {
                
                title: story.title,
                typing: false,
                paragraphs: story.paragraphs.map( paragraph => {
                    
                    return paragraph.map( sentence => {
                        
                        return {
                            text: sentence,
                            sent: false,
                            seen: false
                        }
                        
                    })
                    
                })
                
            }
            
        }),
        
        activeTab: 0,
        
        typingTab: 0,
        
        maxTab: () => maxTab( state.tabs ),
        
        getUnread: i => {
            
            if ( i === undefined ) {
                
                return state.tabs.reduce( ( acc, tab, i ) => acc + state.getUnread( i ), 0 );
                
            }
            
            return state.tabs[ i ].paragraphs.reduce( ( acc, paragraph ) => {
                
                return acc + paragraph.filter( s => s.sent && !s.seen ).length;
                
            }, 0 );
            
        },
        
        setTab: i => {
            
            state.activeTab = i;
            
            state.tabs[ state.activeTab ].paragraphs.forEach( paragraph => paragraph.forEach( sentence => {
                
                if ( sentence.sent ) sentence.seen = true;
                
            }));
            
            state.notifications = state.notifications.filter( n => n.tab !== i );
            
        },
        
        notifications: [],
        
        chat: ( minDelay, maxDelay ) => {
            
            state.type();
            
            // var delay = Math.random() * ( maxDelay - minDelay ) + minDelay;
            
            // setTimeout( () => state.chat( minDelay, maxDelay ), delay );
            
        },
        
        type: () => {
            
            var nextTab = state.typingTab;
            
            var max = maxTab( state.tabs );
            
            var chances = normalizeOdds( odds( state.tabs, max ) );
            
            if ( chances[ state.typingTab ] === 0 || Math.random() > .75 ) nextTab = choose( chances );
            
            var nextSentence = nextUnsent( state.tabs[ nextTab ] );
            
            state.tabs[ nextTab ].typing = true;
            
            var duration = nextSentence.text.length * TYPING_SPEED;
            
            setTimeout( state.send( nextTab, nextSentence ), duration );
            
            m.redraw();
            
        },
        
        send: ( tab, sentence ) => () => {
            
            state.tabs[ tab ].typing = false;
            
            sentence.sent = true;
            
            if ( state.activeTab === tab ) {
                
                sentence.seen = true;
                
            } else {
                
                var notification = {
                    title: state.tabs[ tab ].title,
                    text: sentence.text.replace( /^(-|–|—| |,|;)*/g, '' ),
                    id: notificationId++,
                    tab
                }
                
                state.notifications.unshift( notification );
                
            }
            
            m.redraw();
            
            setTimeout( state.type, Math.random() * MAX_DELAY );
            
        }
            
    }
    
    return state;

}