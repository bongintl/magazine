var m = require('mithril');
var flatten = require('lodash/flatten');
var findLastIndex = require('lodash/findLastIndex');

var TYPING_SPEED = 42;
var MAX_DELAY = 1500;
var TAB_DELAY = 5000;

var wait = delay => new Promise( r => setTimeout( r, delay ) );

var sequence = ( arr, iter ) => {
    
    var p = Promise.resolve();
    
    arr.forEach( (...args) => p.then( () => iter( ...args ) ) );
    
    return p;
    
}

module.exports = data => {
    
    var notificationId = 0;

    var state = {
        
        tabs: [],
        
        notifications: [],
        
        activeTab: 0,
        
        setTab: i => {
            
            var tab = state.tabs[ i ];
            
            tab.unread = 0;
            
            state.activeTab.paragraphs.forEach( paragraph => paragraph.forEach( sentence => sentence.seen = true ) );
            
            state.activeTab = i;
            
        },
        
        send: ( tab, sentence ) => {
            
            var paragraph = tab.paragraphs[ tab.paragraphs.length - 1 ];
            
            var isActive = state.tabs[ state.activeTab ] === tab;
            
            paragraph.push({
                text: sentence,
                seen: !isActive
            })
            
            if ( !isActive ) {
                
                state.notifications.unshift({
                    title: tab.title,
                    text: sentence,
                    id: notificationId++,
                    tab: state.tabs.indexOf( tab )
                })
                
            }
            
        },
        
        sendParagraph: ( tab, paragraph ) => {
            
            
            
        },
        
        startTab: i => {
            
            var story = data[ i ];
            
            var tab = {
                title: story.title,
                unread: 0,
                paragraphs: [],
            }
            
            var delay = 0;
            
        },
        
        go: () => {
            
            
            
        },
        
    }
    
    return state;

}