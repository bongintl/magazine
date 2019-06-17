var m = require('mithril');
var flatten = require('lodash/flatten');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');
var portrait = require('./portrait');

var wait = delay => new Promise( r => setTimeout( r, delay ) );

var NOTIFICATION_HEIGHT = 90;

var Tab = {
    
    view: vnode => {
        
        var { onclick, active, typing, unread, title } = vnode.attrs;
        
        var intensity = Math.min( unread / 10, 1 );
        var color = `rgba(255, 0, 0, ${ intensity })`;
        
        return m('.tab',
            {
                onclick,
                class: active ? 'tab_active' : '',
                style: {
                    // background: color,
                    // boxShadow: `0 0 ${intensity * 20}px ${ intensity * 10 }px ${ color }`
                }
            },
            
            title,
            
            !active && typing
                ? m( Throbber )
                : '',
                
            m( Bubble, { count: unread } )
            
        )
        
    }
    
}

var Bubble = {
    
    view: vnode => {
        
        return vnode.attrs.count === 0
            ? ''
            : m( '.bubble', vnode.attrs.count )
        
    }
    
}

var Throbber = {
    
    view: vnode => m('.throbber',
        m('span', '.'),
        m('span', '.'),
        m('span', '.')
    )
    
}

var Notification = {
    
    oninit: vnode => {
        
        vnode.state.portrait = portrait();
        
    },
    
    onbeforeremove: vnode => {
        
        vnode.dom.classList.add('notification_fade-out');
        
        return wait( 750 );
        
    },
    
    view: vnode => {
        
        var { title, text, tab, onclick, i } = vnode.attrs;
        
        return m( '.notification',
            {
                onclick,
                class: 'notification_tab-' + ( tab + 1 ),
                style: {
                    [ PREFIXED_TRANSFORM ]: `translateY(${ i * NOTIFICATION_HEIGHT }px)`
                }
            },
            m( '.notification__image', { style: { backgroundImage: `url(${vnode.state.portrait})` } } ),
            m( '.notification__title', title ),
            m( '.notification__text', text )
        )
        
    }
    
}

module.exports = state => {
    
    return {
        
        oninit: vnode => {
            
            vnode.state.menuOpen = false;
            
            vnode.state.setMenu = value => e => {
                e.stopPropagation();
                vnode.state.menuOpen = value;
            }

        },
        
        onupdate: vnode => {
            
            var title = 'A Friend Is Writing';
                
            var unread = state.getUnread();
            
            if ( unread > 0 ) title = '(' + unread + ') ' + title;
            
            document.title = title;
            
        },
        
        view: vnode => {
            
            var totalUnread = state.getUnread();
            
            return [
                
                m('.tabs',
                    
                    state.tabs.map( tab => {
                        
                        return {
                            title: tab.title,
                            typing: tab.typing,
                            sentences: flatten( tab.paragraphs )
                        }
                        
                    }).filter( tab => {
                        
                        return tab.typing || tab.sentences.some( sentence => sentence.sent )
                        
                    }).map( ( tab, i ) => {
                        
                        var active = i === state.activeTab;
                        var unread = state.getUnread( i );
                        
                        return m( Tab, {
                            title: tab.title,
                            onclick: () => {
                                vnode.state.menuOpen = false;
                                state.setTab( i );
                            },
                            typing: tab.typing,
                            active,
                            unread
                        })
                        
                        // return m('.tab',
                        //     {
                        //         class: active ? 'tab_active' : '',
                        //         onclick: () => {
                        //             vnode.state.menuOpen = false;
                        //             state.setTab( i );
                        //         }
                        //     },
                            
                        //     tab.title,
                            
                        //     !active && tab.typing
                        //         ? m( Throbber )
                        //         : '',
                            
                        //     m( Bubble, { count: unread } )
                            
                        // );
                        
                    })
                    
                ),
                
                m('.main',
                    {
                        class: vnode.state.menuOpen ? 'main_menu-open' : '',
                        onclick: vnode.state.setMenu( false )
                    },
                
                    m('.header',
                        {
                            class: state.maxTab() <= 0 ? 'header_hidden' : ''
                        },
                            
                        state.tabs[ state.activeTab ].title,
                        
                        m('.burger',
                            { onclick: vnode.state.setMenu( true ) },
                            m( Bubble, { count: totalUnread } )
                        )
                        
                    ),
                    
                    state.tabs.map( ( tab, i ) => {
                    
                        return m( '.article',
                            {
                                style: {
                                    visibility: i === state.activeTab ? 'visible' : 'hidden'
                                },
                                
                            },
                            
                            // m('h1', tab.title ),
                            
                            tab.paragraphs
                            .filter( paragraph => paragraph.some( sentence => sentence.sent ) )
                            .map( paragraph => {
                                
                                return m('p',
                                    paragraph
                                    .filter( sentence => sentence.sent )
                                    .map( sentence => m('span', m.trust(sentence.text) ) )
                                )
                                
                            }),
                            
                            tab.typing
                                ? m('p', m( Throbber ) )
                                : ''
                        )
                        
                    })
                
                ),
                
                m( '.notifications',
                    
                    state.notifications.map( ( notification, i ) => {
                        
                        return m( Notification, {
                            onclick: () => {
                                vnode.state.menuOpen = false;
                                state.setTab( notification.tab )
                            },
                            title: notification.title,
                            text: notification.text,
                            tab: notification.tab,
                            key: notification.id,
                            i
                        });
                        
                    })
                    
                    // state.notifications.map( notification => {
                        
                    //     return m('.notification',
                    //         {
                    //             onclick: () => {
                    //                 vnode.state.menuOpen = false;
                    //                 state.setTab( notification.tab )
                    //             }
                    //         },
                    //         m( '.notification__title', notification.title ),
                    //         m( '.notification__text', notification.text )
                    //     )
                        
                    // })
                    
                )
                
            ]
            
        }
        
    }
    
}