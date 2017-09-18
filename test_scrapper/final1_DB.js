var fs = require('fs');
var request = require('request-enhanced');
var cheerio = require('cheerio');
var req = require('req-fast');
var Combinatorics = require('js-combinatorics');
var arrayToSentence = require("array-to-sentence");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const windowSlider = require('window-slider');
var natural = require('natural');
var wf = require('word-freq');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();
var nlp = require( 'wink-nlp-utils' );
var sorto = require('sorto')
UV_THREADPOOL_SIZE=128
var mongoose = require('mongoose');

var conn1 = mongoose.connect('mongodb://localhost/pro_base');
var conn2 = mongoose.connect('mongodb://localhost/search_db');
var Schema = mongoose.Schema;
//ObjectId = Schema.ObjectId;




var Prodcut = new Schema({
    ASIN_        : String,
    title_       : String,
    category_    : String,
    cat_url      : String,
    pro_url      : String,
    img_         : String,
    detail_      : String,
    freq_word_   : Object
});
var Search = new Schema({
    Keyword_     : String,
    aplha        : String,
    Tier_        : Number,
    Band_        : Number,
    ASINs_       : Array
});

var prod = conn1.model('prod',Prodcut);
var refer = conn2.model('refer',Search);


/// Use this library always for request https://www.npmjs.com/package/request-enhanced


//////////////////////
//   FUNCTION 1    //
/////////////////////
var url1 = "https://www.amazon.com/gp/bestsellers/";
function first(url) {
    var obj = {};
    var obj1 = {};
    var sub_links = [];

    request.get(url, function (err, body) {
        if (err) {
            console.log(err);
        } else {
            console.log('successful');
            var $ = cheerio.load(body);


            links = $('#zg_browseRoot a'); //jquery get all hyperlinks

            if (links.text() !== "") {
                $(links).each(function (i, link) {


                    var cat_link = $(link).attr('href');

                   /* obj[$(link).text()]={}
                    obj1["link"] = $(link).attr('href');
                    obj[$(link).text()] = {}
                    obj[$(link).text()]["link"]=$(link).attr('href');
                    var obj2 = {};
                    obj2["Product"] = {}
                    obj[$(link).text()]["Product"] = {};*/


                    for (var j = 1; j <6; j++){

                        sub_links.push($(link).text())
                        sub_links.push(cat_link+'/ref=zg_bs_pg_'+ j.toString() + '?_encoding=UTF8&pg='+ j.toString())
                    }



                })
                second(sub_links)



            }
        }
    })
}

//////////////////////
//   FUNCTION 2    //
/////////////////////
function second(stack1) {
    // console.log(stack1);
    //console.log(obj_js);
    var pro_links = [];
    var count = 0;

    function step0(y) {
        if (y < stack1.length) {


            req({url: stack1[y], maxRedirects: 10}, function (err, resp) {

                if (err) {
                    console.log("error at ", err)

                } else {
                    if ((resp.body).includes("sure you're not a robot") === true) {
                        console.log("Robot error")
                    } else {
                        /////code here
                        var ind = stack1.indexOf(stack1[y]);
                        var cat_name = stack1[ind - 1];
                        var $ = cheerio.load(resp.body);
                        ///grab each product link and game

                        nocat_links = $('#zg_centerListWrapper .zg_itemWrapper .a-link-normal');


                        $(nocat_links).each(function (k, nocat_link) {
                            //no category  page ,product title and image


                            if (($(nocat_link).attr('href')).includes('/product-reviews/') === false) {
                                var pro_link = 'https://www.amazon.com' + ($(nocat_link).attr('href'));
                                var img_l = $(nocat_link).find("img").attr('src');
                                //var path = 'product_url.txt';

                                // open the file in writing mode, adding a callback function where we do the actual writing
                                ///////////// Processing the frequent word ///////////////
                                tit = $(nocat_link).find("img").attr('alt');
                                if (typeof (tit) !== 'undefined') {

                                    var sen = tit;
                                    sen = nlp.string.removePunctuations(sen);
                                    //var data = wf.tokenise(sen);
                                    var tok2 = nlp.string.tokenize(sen);
                                    var data = nlp.tokens.removeWords(tok2)
                                    var b = []
                                    len = data.length
                                    for (var po = 1; po <= len / 2; po++) {
                                        const window = windowSlider(data, {startIndex: 0, windowSize: po});
                                        var t1 = arrayToSentence(window.current(), {
                                            separator: ' ',
                                            lastSeparator: ' '

                                        });
                                        if (t1.length < 85) {
                                            b.push(t1)
                                        }
                                        b.push(t1)
                                        for (var jk = 1; jk <= len - po; jk++) {
                                            var t2 = arrayToSentence(window.right(), {
                                                separator: ' ',
                                                lastSeparator: ' '

                                            });
                                            if (t2.length < 85) {
                                                b.push(t2)
                                            }
                                        }
                                    }
                                    var tr = {}

                                    tfidf.addDocument(tit);
                                    b.forEach(function (item) {
                                        tfidf.tfidfs(item, function (i, measure) {
                                            tr[item] = measure;
                                        });

                                    })
                                    var sor = sorto.byval(tr, parseFloat);
                                    sor = sor.reverse()

                                }

                                /////////////////////////////


                                var asin = ( "https://www.amazon.com" + $(nocat_link).attr('href')).split('/')[5];

                                /*obj_js[cat_name]["Product"][asin] = {}
                                obj_js[cat_name]["Product"][asin]["Title"] = ''
                                obj_js[cat_name]["Product"][asin]["Title"] = $(nocat_link).find("img").attr('alt');
                                obj_js[cat_name]["Product"][asin]["url"] = ''
                                obj_js[cat_name]["Product"][asin]["url"] = "https://www.amazon.com" + $(nocat_link).attr('href');
                                obj_js[cat_name]["Product"][asin]["img"] = ''
                                obj_js[cat_name]["Product"][asin]["img"] = $(nocat_link).find("img").attr('src');
                                obj_js[cat_name]["Product"][asin]["detail"] = '';
                                obj_js[cat_name]["Product"][asin]["detail"] = tit;
                                obj_js[cat_name]["Product"][asin]["frequent word"] = '';
                                obj_js[cat_name]["Product"][asin]["frequent word"] = sor;
                                obj_js[cat_name]["Product"][asin]["keyword"] = '';*/
                                prod.findOne({ASIN : asin})
                                    .then(function (doc1) {
                                        if (doc1 === null){

                                            item = {
                                                ASIN_     : asin,
                                                title_    : tit,
                                                category_ : cat_name,
                                                cat_url   : stack1[y],
                                                pro_url   : pro_link,
                                                img_      : img_l,
                                                detail_   : tit,
                                                freq_word_: sor
                                            }
                                            var data1 =  new prod(item);
                                            data1.save();

                                        }else{
                                            prod.update({ASIN : asin},{
                                                title_     : tit,
                                                category_  : cat_name,
                                                cat_url    : stack1[y],
                                                pro_url    : pro_link,
                                                img_       : img_l,
                                                detail_    : tit,
                                                freq_word_ : sor
                                            }, function(err,affected) {
                                                console.log('affected rows %d', affected);
                                            });
                                        }
                                    });


                                pro_links.push(cat_name);
                                pro_links.push("https://www.amazon.com" + $(nocat_link).attr('href'))
                                ///////////////////file end writing


                            }
                        })
                        console.log(count)

                        /* fs.writeFileSync('E:/Tahir mamoo/project 1/test_scrapper/HTML/'+ h.toString() + '.html', resp.body , function (err) {
                             if (err) return console.log(err);
                             //console.log('Hello World > helloworld.txt');
                         });*/


                    }
                }
                /*  if (count === (stack1.length / 2) - 1) {
                      ///// Function Completed
                      console.log("calling function 3")
                      setTimeout(function () {
                          fs.writeFile('data.json', JSON.stringify(obj_js, null, 2), 'utf-8', function (err) {
                              if (err) return console.log(err);
                              //console.log('Hello World > helloworld.txt');
                          });
                          /!*
                          fs.writeFile('product_url.json', JSON.stringify(pro_links,null, 2), 'utf-8', function (err) {
                              if (err) return console.log(err);
                              //console.log('Hello World > helloworld.txt');
                          });
                          console.log(pro_links)*!/
                          three(pro_links, obj_js)


                      }, 2000)
                  }*/
                count = count + 1
                step0(y+2)

            });


        }else{
            console.log( "function second finished")
            console.log("calling function 3")
            setTimeout(function () {
                /*fs.writeFile('data.json', JSON.stringify(obj_js, null, 2), 'utf-8', function (err) {
                    if (err) return console.log(err);
                    //console.log('Hello World > helloworld.txt');
                });*/
                /*
                fs.writeFile('product_url.json', JSON.stringify(pro_links,null, 2), 'utf-8', function (err) {
                    if (err) return console.log(err);
                    //console.log('Hello World > helloworld.txt');
                });
                console.log(pro_links)*/
                four(pro_links)


            }, 2000)
        }


    }
    step0(1)
}


//////////////////////
//   FUNCTION 3    //
/////////////////////

function three (){
    console.log("function 3 initiated")
    var alp= {}
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
    var alp = {};


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
                    /*alp[ba[0]] = []
                    alp[ba[0]] = ba[1]*/
                    user.remove({alpha : ba[0]},function (err,rem) {
                        console.log("remove ",rem)
                    });
                    var band = 0;

                    if(ba[1].length !== 0) {
                        ba[1].forEach(function (arg) {

                            var query = {};
                            var criteria = "freq_word_." + arg;
                            query[criteria] = { $exists: true, $ne: [] } ;
                            prod.find(query)
                                .then(function (doc1) {
                                    // console.log(doc1)
                                    var pv = doc1.map(value => value.title);
                                    var ind = ba[1].indexOf(arg) + 1;
                                    if(ba[0].length === 1){
                                        if(ind > ba[1].length/2){
                                            band = 5;
                                        }else {
                                            band = 4;
                                        }
                                    }else if(ba[0].length === 2){
                                        if(ind > ba[1].length/2){
                                            band = 3;
                                        }else {
                                            band = 2;
                                        }
                                    }else{
                                        band = 1;
                                    }

                                    var item2 = {
                                        Keyword_: arg,
                                        aplha: ba[0],
                                        Tier_: ba[0].length(),
                                        Band_: band,
                                        ASINs_: pv
                                    }
                                    var data2 = new refer(item2);
                                    data2.save()

                                });

                        })

                    }else {
                      var  item3 = {
                            Keyword_: "",
                            aplha: ba[0],
                            Tier_: ba[0].length,
                            Band_: band,
                            ASINs_: []
                        };
                        var data3 = new refer(item3);
                        data3.save()

                    }

                    console.log(count, ba[0]);
                }
                count = count+1;
                if(count === out.length){
                    console.log("all done my son")
                    /*fs.writeFileSync('abcd.json', JSON.stringify(alp,null, 2) , 'utf-8', function (err) {
                        if (err) return console.log(err);
                        //console.log('Hello World > helloworld.txt');
                    });*/
                    setTimeout(function () {
                        console.log("third finished")
                    },2000)
                }
            })


        },200*k,k)
    }



}

//////////////////////
//   FUNCTION 4    //
/////////////////////
//ab contain all combination of alphabets
//stack3 contain categories and url
//main_obj contain JSON object

function four( stack3 ) {
    console.log("function 4 initiated")
    data_s =  stack3;

    console.log(data_s.length)

//.length = string.length + 1; //max index + 1
    var content = [];
    var count = 0;
    var newobj = {};
    var title = "";
    var detail = "";
    var freq = ''
    function step1(i){
        if(i < data_s.length){

            req({url: data_s[i], agent:"Chrome/60.0.3112.113"}, function(err, resp){
                if(err){
                    console.log("error at ", err)
                }else{
                    var $ = cheerio.load(resp.body);
                    if((resp.body).includes("sure you're not a robot") === true){
                        console.log(resp.body)
                    }else{
                        console.log(data_s[i])
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
                        if(typeof (detail) !== 'undefined') {
                            var sen = detail
                            sen = nlp.string.removePunctuations(sen)
                            var tok = wf.tokenise(sen);
                            var data = tok;
                            var b = []
                            len = data.length
                            for (var po = 1; po <= len / 2; po++) {
                                const window = windowSlider(data, {startIndex: 0, windowSize: po});
                                var t1 = arrayToSentence(window.current(), {
                                    separator: ' ',
                                    lastSeparator: ' '

                                });
                                if (t1.length < 85) {
                                    b.push(t1)
                                }
                                for (var jk = 1; jk <= len - po; jk++) {
                                    var t2 = arrayToSentence(window.right(), {
                                        separator: ' ',
                                        lastSeparator: ' '

                                    });
                                    if (t2.length < 85) {
                                        b.push(t2)
                                    }
                                }
                            }
                            var tr = {}

                            tfidf.addDocument(detail);
                            b.forEach(function (item) {
                                tfidf.tfidfs(item, function (i, measure) {
                                    tr[item] = measure;
                                });

                            })
                            var sor = sorto.byval(tr, parseFloat);
                            sor = sor.reverse()
                        }

                        var catg = data_s[i-1];
                        var pro_url = data_s[i];
                        console.log(catg);
                        console.log(asin);
                        console.log(title);
                        console.log(b.length)
                        prod.findOne({ASIN : asin})
                            .then(function (doc1) {
                                if (doc1 === null){
                                    item = {
                                        ASIN_     : asin,
                                        title_    : title,
                                        category_ : catg,
                                        cat_url   : 'https://www.amazon.com/gp/bestsellers/',
                                        pro_url   : pro_url,
                                        img_      : "https://www.amazon.com/gp/bestsellers/",
                                        detail_   : detail,
                                        freq_word_: sor
                                    }
                                    var data1 =  new prod(item);
                                    data1.save();

                                }else{
                                    prod.update({ASIN : asin},{
                                        title_    : title,
                                        img_      : "https://www.amazon.com/gp/bestsellers/",
                                        detail_   : detail,
                                        freq_word_: sor
                                    }, function(err,affected) {
                                        console.log('affected rows %d', affected);
                                    });
                                }
                            });
                        /*if (asin in main_obj[catg]["Product"]){
                            if(main_obj[catg]["Product"][asin]["Title"] === ''){

                                main_obj[catg]["Product"][asin]["Title"] = title;
                            }
                            if(main_obj[catg]["Product"][asin]["url"] === ''){

                                main_obj[catg]["Product"][asin]["url"] = pro_url;
                            }
                            if(b.length !== 0){
                                main_obj[catg]["Product"][asin]["detail"] = detail
                                main_obj[catg]["Product"][asin]["frequent word"] = sor;
                            }

                        }else{
                            main_obj[catg]["Product"][asin] = {}
                            main_obj[catg]["Product"][asin]["Title"] =''
                            main_obj[catg]["Product"][asin]["Title"] = title;
                            main_obj[catg]["Product"][asin]["url"] =''
                            main_obj[catg]["Product"][asin]["url"] = pro_url;
                            main_obj[catg]["Product"][asin]["img"] =''
                            main_obj[catg]["Product"][asin]["detail"] = ''
                            main_obj[catg]["Product"][asin]["detail"] = detail
                            main_obj[catg]["Product"][asin]["frequent word"] = '';
                            main_obj[catg]["Product"][asin]["frequent word"] = b;
                            main_obj[catg]["Product"][asin]["keyword"] = '';
                        }*/
                        /* fs.writeFileSync('E:/Tahir mamoo/project 1/test_scrapper/HTML/'+asin+ '.html', resp.body , function (err) {
                             if (err) return console.log(err);
                             //console.log('Hello World > helloworld.txt');
                         });*/
                    }
                }
                setTimeout(function () { step1(i+2) },500)

            });
        }else{

            console.log(main_obj)
            /*fs.writeFile('data.json', JSON.stringify(main_obj,null, 2) , 'utf-8', function (err) {
                if (err) return console.log(err);
                //console.log('Hello World > helloworld.txt');
            });*/
            console.log("function four completed");
            three()

        }

    }
    step1(1)

}
//Initializing
first(url1)
