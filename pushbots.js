var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    id:'5707d4cd4a9efae4f28b4568',
    secret:'2a783d812d36607a6de6a588866502b9'
});

    module.exports = function(data){
    console.log("Calling send function");
        console.log("Data received= :" + data.text);
    Pushbots.setMessage(data.text ,1);
    Pushbots.customFields({"article_id":"1234"});
    Pushbots.customNotificationTitle("Textor");
    Pushbots.sendByAlias(data.receiver);
    Pushbots.push(function(response){
        console.log(response);
    });
}

