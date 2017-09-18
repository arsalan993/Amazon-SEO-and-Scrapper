//npm install --global --production windows-build-tools
//// Natural Language processing
var Combinatorics = require('js-combinatorics');
var arrayToSentence = require("array-to-sentence");
var natural = require('natural');
var wf = require('word-freq');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();
var nlp = require( 'wink-nlp-utils' );
var fs = require('fs')
const windowSlider = require('window-slider');
var sorto = require('sorto')

var cmb, a;

var sen1 = fs.readFileSync("plan9.txt",'utf8');
//var sen = "hi my name is arsalan, i am 24 years old, i love to play dota2, i am an engineer."

/*sen = nlp.string.removePunctuations(sen)
var tok = wf.tokenise(sen);
var tok2 = nlp.string.tokenize(sen);
console.log(tok2)*/
//var tok = nlp.tokens.removeWords(tok2)
//console.log(tok)
//var sen = detail
sen = nlp.string.removePunctuations(sen1)
var tok = wf.tokenise(sen);
var data = tok;
var b = []
len = data.length
var bm = []
for(var po = 1; po <= len/2; po++){
    const window = windowSlider(data, { startIndex: 0, windowSize: po });
    var t1 =  arrayToSentence(window.current(), {
        separator: ' ',
        lastSeparator: ' '

    });
    if(t1.length < 80) {
        b.push(t1)
    }
    for (var jk = 1; jk<= len-po; jk++){
        var t2 =  arrayToSentence(window.right(), {
            separator: ' ',
            lastSeparator: ' '

        });
        if(t2.length < 80) {
            b.push(t2)
        }
    }
}

var tr = {}

count = 0;
tfidf.addDocument(sen1);
b.forEach(function (item) {
    tfidf.tfidfs(item, function(i, measure) {
        tr[item] = measure;
        count = count + 1;
    });

})
var sor = sorto.byval(tr, parseFloat);
sor = sor.reverse()
bm["ar"] = sor;
console.log(sor)

//console.log(tok)
//tfidf.addDocument(sen);

// var P = tok;
// var j = 1;
// var final = []
// cmb = Combinatorics.power(P);
// console.log(cmb.length)

/*tfidf.addDocument(b);

tfidf.listTerms(0).forEach(function(item) {
    console.log(item.term + ': ' + item.tfidf);
});*/
/*cmb.forEach(function(a){
   // console.log(a)
    var t =  arrayToSentence(a, {
        separator: ' ',
        lastSeparator: ' '

    });

    t = a
    console.log(a)
    if((t !== '') && (t.length < 200)) {
        tfidf.tfidfs(t, function(i, measure) {

            final.push(t);

            final[t] = measure;
            console.log(t,measure)
            if(j === cmb.length-1){
               //console.log(Object.keys(final).length)
               // console.log(final)
            }
            j = j + 1;
        });

     //   console.log(j,cmb.length)
       // final.push(t,1);
    }



});*/


