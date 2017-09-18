const windowSlider = require('window-slider');
var natural = require('natural');
var wf = require('word-freq');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();
var nlp = require( 'wink-nlp-utils' );
var fs = require('fs')


var sen = fs.readFileSync("plan9.txt",'utf8');
sen = nlp.string.removePunctuations(sen)
var tok = wf.tokenise(sen);
var data = tok;
var b = []
len = data.length
for(var i = 1; i <= len/2; i++){
    const window = windowSlider(data, { startIndex: 0, windowSize: i });
    b.push(window.current())
    for (var j = 1; j<= len-i; j++){
        b.push(window.right())
    }
}
console.log(b.length)
//134217728
//    53865