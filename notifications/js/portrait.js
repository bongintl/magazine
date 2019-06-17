var getUrl = () => `https://randomuser.me/api/portraits/${ Math.random() > .5 ? 'men' : 'women' }/${ Math.floor( Math.random() * 100 ) }.jpg`;

var load = url => {
    
    /* global Image */
    
    var img = new Image();
    
    img.src = url;
    
}

var next = getUrl();

load( next );

module.exports = () => {
    
    var ret = next;
    
    next = getUrl();
    
    load( next );
    
    return ret;
    
}