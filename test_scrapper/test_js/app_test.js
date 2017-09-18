var fs = require('fs');
var req = require('req-fast');
var cheerio = require('cheerio');
const windowSlider = require('window-slider');
var natural = require('natural');
var wf = require('word-freq');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();
var arrayToSentence = require("array-to-sentence");
var nlp = require( 'wink-nlp-utils' );

//Scraping data from all product links ..  integrate newscrap.js with this

data_s = fs.readFileSync("product_url.json",'utf8');
//string = string.split("\n");
data_s =  JSON.parse(data_s);

console.log(data_s.length)

//.length = string.length + 1; //max index + 1
var content = [];
var count = 0;
var newobj = {};
var title = "";
var detail = "";
var freq = ''
var av =[]
function step(i){
    if(i < 12){

            req({url: data_s[i],agent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) \n' +
            '    Silk/44.1.54 like Chrome/44.0.2403.63 Safari/537.36'}, function(err, resp){
                console.log(data_s[i])
                if(err){
                    console.log("error at ", err)
                }else{
                    var $ = cheerio.load(resp.body);
                    if((resp.body).includes("sure you're not a robot") === true){
                        console.log(resp.body)
                    }else{

                        var n1 = data_s[i].indexOf("/dp/");
                        var m1 = data_s[i].indexOf("/",n1 + 4);
                        var asin = data_s[i].substring(n1 + 4, m1 );

                        if (data_s[i-1].includes("Apps & Games") === true){
                          //  console.log("Apps & Games")
                            //Title
                            T = $('#btAsinTitle');
                            title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //Product Description
                            PD = $("#mas-product-description")
                            detail = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))+ " " + title

                        }else if(data_s[i-1].includes("Books") === true){
                         //   console.log("Books")
                            //Title
                            T = $('#productTitle');
                            title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            PD = $("#bookDescription_feature_div")
                            detail = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' ')) + " " +title;

                        }else if(data_s[i-1].includes("Kindle Store") === true){
                           // console.log("Kindle Store")
                            T = $('#ebooksProductTitle');
                           title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //Product Description
                            PD = $("#bookDescription_feature_div")
                            detail = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' ')) + " " + title;

                        }else if(data_s[i-1].includes("Magazine Subscriptions") === true){
                           // console.log("Magazine Subscriptions")
                            //Title
                            T = $('#productTitle');
                            title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //About the Product
                            ATP = $('#magazineDetails_feature_div');
                            ATP = ($(ATP).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //Product Description
                            PD = $("#productDescription")
                            PD = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            detail = ATP + " " + PD + " " + title;

                        }else if(data_s[i-1].includes("Industrial & Scientific") === true){
                            console.log("Industrial & Scientific")
                            //Title
                            T = $('#productTitle');
                            title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //About the Product
                            ATP = $('#feature-bullets');
                            ATP = ($(ATP).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //Product Description
                            PD = $("#productDescription")
                            PD = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //From Manufacturer
                            FM = $("#aplus")
                            FM = ($(FM).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            //Features
                            PF = $("#feature-bullets-btf")
                            PF = ($(PF).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '));
                            detail = title + " " + ATP + " " + PD + " " + FM + " " + PF

                        }else{
                        	//Title
                            T = $('#productTitle');
                            title = ($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
                            //About the Product
                            ATP = $('#feature-bullets');
                            ATP = ($(ATP).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
                            //Product Description
                            PD = $("#productDescription")
                            PD = ($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
                            //From Manufacturer
                            FM = $("#aplus")
                            FM = ($(FM).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
                            detail = title + " " + ATP + " " + PD + " " + FM ;

                        }
                        var sen = detail
                        sen = nlp.string.removePunctuations(sen)
                        var tok = wf.tokenise(sen);
                        var data = tok;
                        var b = []
                        len = data.length
                        for(var po = 1; po <= len/2; po++){
                            const window = windowSlider(data, { startIndex: 0, windowSize: po });
                            var t1 =  arrayToSentence(window.current(), {
                                separator: ' ',
                                lastSeparator: ' '

                            });
                            av.push(t1)
                            for (var jk = 1; jk<= len-po; jk++){
                                var t2 =  arrayToSentence(window.right(), {
                                    separator: ' ',
                                    lastSeparator: ' '

                                });
                                av.push(t2)
                            }
                        }

                        console.log(title)
                        console.log(b.length)
                       /* fs.writeFileSync('E:/Tahir mamoo/project 1/test_scrapper/HTML/'+asin+ '.html', resp.body , function (err) {
                            if (err) return console.log(err);
                            //console.log('Hello World > helloworld.txt');
                        });*/
                    }
                }
                setTimeout(function () {
                    step(i+2)
                },2000)
            });
        }else{
        console.log("finished all")
        console.log(av)
    }






}
step(1)

        // }



