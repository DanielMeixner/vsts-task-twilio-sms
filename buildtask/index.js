'use strict';


var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var req = require("request");
var taaa = require('vsts-task-lib/task');
// var connectionString = process.argv[2];
// var iothuburl = process.argv[3];
// var authb64 = process.argv[4];


var connectionString = taaa.getInput('IotHubConnectionString');
var iothuburl = taaa.getInput('IotHubDeviceRequestUrl');
var authb64 = taaa.getInput('IoTHubAuthString');


var buf = Buffer.from(authb64, 'base64');
var auth = buf.toString('utf8');

    
console.log("connectionString:" + connectionString);
console.log("iothuburl:" + iothuburl);
console.log("decrypted Auth: " + auth);

      
console.log("LOG1");
var headers = {
    'Content-Type': 'application/json',
    'Authorization': auth
}
console.log("LOG2");

var options = {
    'url': iothuburl,
    'method': 'GET',
    'headers': headers

};
console.log("start device query LOG3");

var deviceList;


// query devices from iot hub
req(options, function (error, response, body) {
    console.log("inside device query Log3b");
    console.log(body);
    deviceList = JSON.parse(body);
});


console.log("LOG4");


var SendNotification = function (devId) {
    console.log(devId);
}
console.log("LOG5");

var serviceClient = Client.fromConnectionString(connectionString);
console.log("LOG6");

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}
console.log("LO7");

function receiveFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:')
        console.log(msg.getData().toString('utf-8'));
        process.exit();
    });
}
console.log("LOG8");



serviceClient.open(function (err) {

    console.log("LOG 9 open service client");
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Service client connected');

        serviceClient.getFeedbackReceiver(receiveFeedback);

        var message = new Message('Cloud to device message. From VSO.');
        message.ack = 'full';
        message.messageId = "My Message to all devices";
        console.log('Sending message: ' + message.getData());
        deviceList.forEach(function (element) {
            var id = element.deviceId;

            serviceClient.send(id, message, printResultFor('send'));
            console.log("Sent message to ... " + id);

        }, this);

        console.log("done");
        // Do NOT call this:  process.exit();
    }
})
