var mongoose = require('mongoose');

var conn1 = mongoose.connect('mongodb://localhost/my_database');
var conn2 = mongoose.connect('mongodb://localhost/my_database2');
var Schema = mongoose.Schema;
    //ObjectId = Schema.ObjectId;




var BlogPost = new Schema({
    author    : String,
    title     : String,
    body      : String,
    prof      : String,
    address   : Object


});

var director = new Schema({
    name : String

});
var user = conn1.model('user',BlogPost);
var user2 = conn2.model('user2',director);
var item = {
    name : "arsalan"

}
var data2 =  new user2(item);
data2.save();

/*user.update(
    {author: 'rizwana'},
    {$set: {body: "white"}}
);*/
var c = [{"city":"rwp"}]
console.log(c)
user.update({author : "rehan"},{
    address : c
}, function(err,affected) {
    console.log('affected rows %d', affected);
});
var fin = []
var pv= []
/*user.find({author: 'rizwaadasna'})
    .then(function (doc1) {
       // console.log(doc1)
        pv = doc1.map(value => value.title);
        console.log("pv =",pv)
        });*/

/*user.remove({title : "programmer"},function (err,rem) {
    //console.log("remove ",rem)

})*/
var a  = "city";
var query = {};
var criteria = "address." + a;
query[criteria] = { $exists: true, $ne: [] } ;
user.find()
    .then(function (doc1) {
            if(doc1 === null){
                console.log("emty")
            }else{
                console.log(doc1)
            }
    });

//A = {}
//A["arsalan"] = mongoose.Schema.ObjectId;
    //console.log(A)