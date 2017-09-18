var Combinatorics = require('js-combinatorics');
var objectMerge = require('object-merge');
var arrayToSentence = require("array-to-sentence");
var fs = require('fs')

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require('request-enhanced');
///ARBCD

var base1 = []

var first = "a", last = "z";
for(var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
    base1.push( eval("String.fromCharCode(" + i + ")"));
}
base2 = Combinatorics.baseN(base1, 2);
base3 = Combinatorics.baseN(base1, 3);
//var children = base3.concat(base2, base1);
base3 = base3.toArray()
base2 = base2.toArray()
var out = base1.concat(base2, base3);

var t = ''
var count  = 0;
var alp= {}



for (var k = 0; k < out.length; k++){
    setTimeout(function (k) {
        var mn = out[k]
        if (typeof (out[k]) !== "string") {
            mn = out[k].join('');

        }
        url = 'http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q=' + mn
        request.get(url, function (err, body) {
            if (err) {
                console.log(err);
            } else {
                //console.log('successful');
                //console.log(body)
                ba = JSON.parse(body)
                alp[ba[0]] = []
                alp[ba[0]] = ba[1]
                console.log(count, ba[0]);
            }
            count = count+1;
            if(count === out.length){
                console.log("all done my son")
                fs.writeFileSync('abcd.json', JSON.stringify(alp,null, 2) , 'utf-8', function (err) {
                    if (err) return console.log(err);
                    //console.log('Hello World > helloworld.txt');
                });
                setTimeout(function () {
                    four(alp, stack2, up_obj)
                },2000)
            }
        })


    },200*k,k)
}





/*var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q=' + mn);
    ourRequest.onload = function () {
        data = JSON.parse(ourRequest.responseText);
        alp[mn] = []
        alp[mn] = data[1]
        //console.log(mn,count)
        count = count+1
        if(count === 13){
            console.log("hello")
            console.log(alp)
            fs.writeFileSync('abcd.json', JSON.stringify(alp,null, 2) , 'utf-8', function (err) {
                if (err) return console.log(err);
                //console.log('Hello World > helloworld.txt');
            });

        }
    }
    ourRequest.send();
*/


