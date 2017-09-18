var fs = require('fs');
var request = require('request-enhanced');
var cheerio = require('cheerio');

var express =  require('express');
var path = require('path');
var app = express();
var port = 8000;
UV_THREADPOOL_SIZE=128

/// Use this library always for request https://www.npmjs.com/package/request-enhanced

var url = "https://www.amazon.com/gp/bestsellers/";
request.get(url,function(err,body){
    if(err){

        console.log(err);
    }else{
        console.log('arsalan : ',typeof(body));
        var $ = cheerio.load(body);
        //id="zg_browseRoot"
        // var name = $('#zg_browseRoot a');
        //var nametext = name.attr('href');

        links = $('#zg_browseRoot a'); //jquery get all hyperlinks
        if (links.text() != ""){
            $(links).each(function(i, link) {
                //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                var cat_name = $(link).text();
                var cat_link = $(link).attr('href');
                request.get( cat_link,function(err1,body1) {
                    if (err1) {
                        //console.log(err1)
                        //console.log("error in" + '\n' + cat_name + '\n' + cat_link);
                    } else {
                        //console.log('successful');
                        var $ = cheerio.load(body1);
                        // console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                        //console.log(subl.html())
                        sublinks = $('#zg_browseRoot a');
                        sublink_check = $('.zg_browseUp a');
                        if (sublinks.text() != "" & sublink_check.text() != ""){
                            //console.log(sublinks.attr('href'))
                            $(sublinks).each(function(j, sublink) {
                                if(($(sublink).text()).indexOf('Any Department') == -1) {
                                    //console.log($(link).text() + ':\n  ' + $(sublink).text() + ':\n  ' + $(sublink).attr('href'));
                                    var sublink_name = $(sublink).text();
                                    var sublink_link = $(sublink).attr('href');
                                    var sublink_all = [];
                                    var count = 0;
                                    for(var l = 1; l < 6; l++){
                                        sublink_all.push(sublink_link +'#'+l.toString())
                                    };
                                    sublink_all.forEach(function(new_sublink){
                                        request.get(new_sublink, function (err2, body2) {
                                            if (err2) {
                                                //console.log(err2)
                                                console.log("error in" + '\n' + sublink_name + '\n' + new_sublink);
                                            } else {
                                                console.log('successful');
                                                var $ = cheerio.load(body2);
                                                nocat_links = $('#zg_centerListWrapper .zg_itemWrapper .a-link-normal');
                                                //console.log($(nocat_links).attr('href') + '\n');
                                                //console.log($.html())

                                                $(nocat_links).each(function (k, nocat_link) {
                                                    //no category  page ,product title and image
                                                    if (($(nocat_link).attr('href')).includes('product-reviews') == false) {
                                                        count = count + 1;
                                                        console.log($(link).text() + ':\n ' + $(link).attr('href') + '\n' +
                                                            $(sublink).text() + ':\n ' + $(sublink).attr('href') + '\n' +
                                                            $(nocat_link).find("img").attr('alt') + '\n' +
                                                            $(nocat_link).find("img").attr('src') + '\n' +
                                                            "https://www.amazon.com" + $(nocat_link).attr('href') +
                                                            '\n ' + count);
                                                    };



                                                });

                                            };

                                        });
                                    });

                                }////sublink if else ends here

                            });
                        }else{
                            //pantry
                            //console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                            var count = 0
                            var cat_name = $(link).text();
                            var cat_link = $(link).attr('href');
                            var cat_all_link = [];
                            for(var l = 1; l < 6; l++){
                                cat_all_link.push(cat_link +'#'+l.toString())
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
                                        //console.log($(nocat_links).attr('href') + '\n');
                                        //console.log($.html())

                                        $(nocat_links).each(function (k, nocat_link) {
                                            //no category  page ,product title and image
                                            if (($(nocat_link).attr('href')).includes('product-reviews') == false) {
                                                count = count + 1;
                                                console.log($(link).text() + ':\n ' + $(link).attr('href') + '\n' +
                                                    "no sub category" + "\n" + "no sub category url" +
                                                    $(nocat_link).find("img").attr('alt') + '\n' +
                                                    $(nocat_link).find("img").attr('src') + '\n' +
                                                    "https://www.amazon.com" + $(nocat_link).attr('href') +
                                                    '\n ' + count);

                                            }


                                        });

                                    };

                                });

                            });
                            ////////////////////////////////


                        }
                    }
                });

            });
            console.log("arsalan ahmed");
        }else{
            console.log("empty tag");
        }




    }
})
app.listen(port);
console.log('server is running on : ' + port)