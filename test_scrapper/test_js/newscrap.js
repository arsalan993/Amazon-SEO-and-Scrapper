var cheerio = require('cheerio');
var req = require('req-fast');
var fs  = require('fs')
///Scrapping all categories
//integrate in  app_test.js
url = "https://www.amazon.com/Energizer-Controller-Rechargeable-Wireless-Controllers-Charging/dp/B00EADTVLW/"
req({url : url}, function(err, resp){
    if(err){
        console.log(err)
    }else{
        if((resp.body).includes("sure you're not a robot") === true){
            console.log("Robot error")
        }else{
           /////code here
            var $ = cheerio.load(resp.body);

            //Title
            T = $('#productTitle');
            console.log($(T).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
            //About the Product
            ATP = $('#feature-bullets');
            console.log($(ATP).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
            //Product Description
            PD = $("#productDescription")
            console.log($(PD).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
            //From Manufacturer
            FM = $("#aplus")
            console.log($(FM).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))
            //Features
            PF = $("#feature-bullets-btf")
            console.log($(PF).text().replace(/[\n\t\r+]/g, "").replace(/\s+/g, ' '))




        }
    }
});