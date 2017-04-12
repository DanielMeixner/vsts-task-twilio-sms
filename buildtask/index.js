'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var req = require("request");
var taaa = require('vsts-task-lib/task');

var connectionString = taaa.getInput('IotHubConnectionString');
var iothuburl = taaa.getInput('IotHubDeviceRequestUrl');
var authb64 = taaa.getInput('IoTHubAuthString');
var cloudToDeviceMsg = taaa.getInput('MessageContent');
var messageId =taaa.getInput('MessageId');

var buf = Buffer.from(authb64, 'base64');
var auth = buf.toString('utf8');

console.log("connectionString:" + connectionString);
console.log("iothuburl:" + iothuburl);
console.log("decrypted Auth: " + auth);

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

var deviceList;
var nrOfDevices = 0;
var nrOfMsgsTriggered = 0;

// query devices from iot hub
req(options, function (error, response, body) {
    console.log("inside device query Log3b");
    console.log(body);
    deviceList = JSON.parse(body);
    nrOfDevices = deviceList.length;
    console.log("Found " + nrOfDevices + " devices.");
});

var SendNotification = function (devId) {
    console.log(devId);
}

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) {
            console.log(op + ' error: ' + err.toString());
            if (nrOfDevices == ++nrOfMsgsTriggered) {
                console.log("Exiting gracefully after delivery.");
                process.exit();
            }
        }
        if (res) {
            console.log(op + ' status: ' + res.constructor.name);
            if (nrOfDevices == ++nrOfMsgsTriggered) {
                console.log("Exiting gracefully after delivery.");
                process.exit();
            }
        }
    };
}

function receiveFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:')
        console.log(msg.getData().toString('utf-8'));
    });
}

serviceClient.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Service client connected');

        serviceClient.getFeedbackReceiver(receiveFeedback);
        var message = new Message(cloudToDeviceMsg);
        message.ack = 'full';
        message.messageId = messageId;
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
