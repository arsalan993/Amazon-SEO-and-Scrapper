var scraper = require('product-scraper');
var fs = require('fs');

var request = require('request-enhanced');
var cheerio = require('cheerio');
var requesto= require('request');
var needle = require('needle');
var express =  require('express');
var path = require('path');
var app = express();
var AmazonProducts = require('crawl-amazon-products');

var string = fs.readFileSync("product_url.txt",'utf8');

string = string.split("\n");
console.log(string.length)

//.length = string.length + 1; //max index + 1
var content = [];
var count = 0
var newobj = {}
function step(i){
if ( i < string.length) {



        var item = string[i];

        var url1 = string[i];
        asin = url1.split('/')[5];

       // console.log(url1)
        url1 = url1.trim("\n");
        url1 = url1.trim()
        console.log(url1)
         // console.log(string[203])

  //  if (item.trim('\n') === "Prime Pantry") {
        AmazonProducts.getProductDetail({
            url: url1
        }, function (err, productDetail) {

            if (err) {

           } else {


                temp = productDetail["details"]['parentASIN'];
                //cat = productDetail["details"]["categories"]
                if ((temp !== undefined)) {
                    newobj[temp] = productDetail["features"] + productDetail["name"]

                }
                console.log(count, i)
                count = count + 1


           }

            step(i+2)

        //    }




        })


   // }
}else{
    console.log("finished all")
    console.log(newobj)
    console.log(Object.keys(newobj).length)
}

}


step(1)

