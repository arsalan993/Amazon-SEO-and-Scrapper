var fs = require('fs');
var request = require('request-enhanced');
var cheerio = require('cheerio');

UV_THREADPOOL_SIZE=128
var fcount = 0;
var obj = {};
var obj1 = {};

/// Use this library always for request https://www.npmjs.com/package/request-enhanced
fs.writeFileSync('product_url.txt', "" , function (err) {
    if (err) return console.log(err);
    //console.log('Hello World > helloworld.txt');
});
var url = "https://www.amazon.com/gp/bestsellers/";
request.get(url,function(err,body){
    if(err){
        console.log(err);
    }else{
        console.log('successful');
        var $ = cheerio.load(body);


        links = $('#zg_browseRoot a'); //jquery get all hyperlinks

        if (links.text() != ""){
            $(links).each(function(i, link) {

               // if(fcount == $(links).length){

               // }
                //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                var cat_name = $(link).text();

                var cat_link = $(link).attr('href');

                request.get( cat_link,function(err1,body1) {
                    if (err1) {
                        //console.log(err1)
                        console.log("error in" + '\n' + cat_name + '\n' + cat_link);
                    } else {
                        //console.log('successful');
                        var $ = cheerio.load(body1);

                            var count = 0


                        fcount = fcount + 1;

                            var cat_name = $(link).text();
                            var cat_link = $(link).attr('href');
                            var cat_all_link = [];
                             obj[$(link).text()]={}
                             obj1["link"] = $(link).attr('href');
                             obj[$(link).text()] = {}
                             obj[$(link).text()]["link"]=$(link).attr('href');
                             var obj2 = {};
                             obj2["Product"] = {}
                             obj[$(link).text()]["Product"] = {};


                            for(var l = 1; l < 6; l++){
                                cat_all_link.push(cat_link +'/ref=zg_bs_pg_'+ l.toString() + '?_encoding=UTF8&pg='+ l.toString())
                            }

                            cat_all_link.forEach(function(new_link){
                                request.get(new_link, function (err2, body2) {
                                    if (err2) {
                                        //console.log(err2)
                                        console.log("error in" + '\n' +  cat_name  + '\n' + new_link );
                                    } else {
                                        console.log('successful');
                                        var $ = cheerio.load(body2);
                                        nocat_links = $('#zg_centerListWrapper .zg_itemWrapper .a-link-normal');
                                        var count2 = 0

                                        $(nocat_links).each(function (k, nocat_link) {
                                            //no category  page ,product title and image
                                            count2 = count2 +1;

                                            if (($(nocat_link).attr('href')).includes('product-reviews') == false) {
                                                pro_link = 'https://www.amazon.com' + ($(nocat_link).attr('href'));
                                                var path = 'product_url.txt';

                                                // open the file in writing mode, adding a callback function where we do the actual writing
                                               fs.appendFile(path,$(link).text() + '\n' +pro_link + '\n' , encoding='utf8',function(err){
                                                    if(err){
                                                        console.error(err);
                                                    }else{
                                                                                                    //  console.log('Appended!');
                                                    }

                                                });

                                                var asin = ( "https://www.amazon.com" + $(nocat_link).attr('href')).split('/')[5];
                                                console.log(asin)
                                                obj[$(link).text()]["Product"][asin]={}
                                                obj[$(link).text()]["Product"][asin]["Title"]= $(nocat_link).find("img").attr('alt');
                                                obj[$(link).text()]["Product"][asin]["url"]= "https://www.amazon.com" + $(nocat_link).attr('href') ;
                                                obj[$(link).text()]["Product"][asin]["img"]= $(nocat_link).find("img").attr('src');
                                                obj[$(link).text()]["Product"][asin]["feature"]=$(nocat_link).find("img").attr('alt');
                                                obj[$(link).text()]["Product"][asin]["keyword"]='';
                                                ///////////////////file end writing

                                                count = count + 1;

                                                //testarr.push($(link).text())

                                                /*console.log($(link).text() + ':\n ' + $(link).attr('href') + '\n' +
                                                    $(nocat_link).find("img").attr('alt') + '\n' +
                                                    $(nocat_link).find("img").attr('src') + '\n' +
                                                    "https://www.amazon.com" + $(nocat_link).attr('href') + '\n ' +
                                                    + count + obj + ' value of fcount : ',fcount + '\n' );*/



                                            }
                                            console.log(count,fcount, count2, $(nocat_links).length)
                                            if((fcount == $(links).length) & (count2) == $(nocat_links).length & (count  == 100)){
                                                console.log("All task done and completed")


                                               // console.log(obj)

                                                fs.writeFile('data.json', JSON.stringify(obj,null, 2) , 'utf-8', function (err) {
                                                    if (err) return console.log(err);
                                                    //console.log('Hello World > helloworld.txt');
                                                });

                                            }
                                        });
                                        ////////////////////////////////////////

                                    }


                                });

                            });
                            ////////////////////////////////



                    }
                });

            });

        }else{
            console.log("empty tag");
        }




    }

})

