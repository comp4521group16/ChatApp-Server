var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    id:'5707d4cd4a9efae4f28b4568',
    secret:'2a783d812d36607a6de6a588866502b9'
});

exports.send = function(data){
    console.log("Calling send function");
    console.log("Data received= :" + data);
    if(data.isPhoto=== "true"){
        console.log("Pushing Photo Message");
        Pushbots.setMessage(data.image ,1);
        Pushbots.customFields({"receiver": data.receiver, "sender": data.sender, "content": data.image, "isPhoto": data.isPhoto});
    }else{
        console.log("Pushing Text Message");
        Pushbots.setMessage(data.text ,1);
        Pushbots.customFields({"receiver": data.receiver, "sender": data.sender, "content": data.text, "isPhoto": data.isPhoto});
    }
   // Pushbots.nextActivity("com.example.kalongip.chatapp.SocketActivity");
    Pushbots.customNotificationTitle("Textor");
    Pushbots.sendByAlias(data.receiver);
    Pushbots.push(function(response){
        console.log(response);
    });
}

