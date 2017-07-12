'use strict';

var taskslib = require('vsts-task-lib/task');

var twilioAccountSID = taskslib.getInput('twilioAccountSID');
var twilioAuthToken = taskslib.getInput('twilioAuthToken');
var message = taskslib.getInput('message');
var toNumber = taskslib.getInput('toNumber');
var fromNumber = taskslib.getInput('fromNumber');



//require the Twilio module and create a REST client 
var client = require('twilio')(twilioAccountSID, twilioAuthToken); 
 
client.messages.create({ 
    to: toNumber, 
    from: fromNumber, 
    body: message, 
}, function(err, message) { 
    console.log(message.sid); 
});


