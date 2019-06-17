var m = require('mithril');

var data = require('./data');
var State = require('./State');
var View = require('./View');

var state = State( data );
var view = View( state );
m.mount( document.body, view );

state.type();