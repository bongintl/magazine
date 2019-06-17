(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canvas = document.createElement( 'canvas' );
var ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );

var DPR = window.devicePixelRatio;

var IMAGES = [
    "http://img.modem.studio/CC0-big/CC0-img-125.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-107.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-32.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-92.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-56.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-135.jpg",
    "http://img.modem.studio/CC0-big/CC0-img-84.jpg"
];

document.body.style.height = ( IMAGES.length + 1 ) * 100 + '%';

var scrollTop = 0;

Promise.all( IMAGES.map( url => {
    
    return new Promise( resolve => {
        
        var img = new Image();
        
        img.onload = () => {
            
            resolve({
                img,
                w: img.width,
                h: img.height
            })
            
        }
        
        img.src = url;
        
    })
    
}))
.then( imgs => {
    
    function render ( scrollTop ) {
        
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        
        var maxSt = IMAGES.length * wh;
        
        var st = maxSt - scrollTop;
        
        var pos = st / wh;
        
        var maxWidth = window.innerWidth / 2;
        var maxHeight = window.innerHeight / 2;
        
        imgs.forEach( ( img, i ) => {
            
            var p = ( i + 1 ) - pos;
            
            var maxScale = Math.max( maxWidth / img.w, maxHeight / img.h );
            
            var scale = maxScale * p * 3;
            
            var w = img.w * scale;
            var h = img.h * scale;
            
            var x = ww / 2 - w / 2;
            var y = p * wh;
            
            if( y > 0 && y < wh ) ctx.drawImage( img.img, x * DPR, y * DPR, w * DPR, h * DPR );
        })
        
    }
    
    var last = 0;
    
    var step = 1 / DPR;
    
    function onScroll () {
        
        var curr = window.pageYOffset;
        
        if ( curr > last ) {
            
            for ( var st = last; st < curr; st += step ) {
                
                render( st );
                
            }
            
        } else {
            
            for ( var st = last; st >= curr; st -= step ) {
                
                render( st );
                
            }
            
        }
        
        last = curr;
        
    }
    
    function resize () {
        
        canvas.width = window.innerWidth * DPR;
        canvas.height = window.innerHeight * DPR;
        
        onScroll( window.pageYOffset );
        
    }
    
    window.addEventListener( 'scroll', onScroll );
    window.addEventListener( 'resize', resize );
    
    resize();

})
},{}]},{},[1]);
