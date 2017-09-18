a = [11,12,13,14,15,16,17,18]

function first() {
    setTimeout(function() {
        a.forEach(function (t,p) {

            setTimeout(function() {
                console.log(p)
                if(p === 7){
                    console.log("first done")
                    second();
                }

            }, 3000*p,p);

        })

    }, 2000);
}
function second() {
    setTimeout(function() {
        console.log("second")
        third();
    }, 2000);

}
function third() {
    setTimeout(function() {
        console.log("third")
    }, 2000);
}
first();