'use strict';

var taskslib = require('vsts-task-lib/task');
var iothub = require('azure-iothub');

var connectionString = taskslib.getInput('IotHubConnectionString');
var directMethodName = taskslib.getInput('DirectMethodName');
var messageToDevice = JSON.parse(taskslib.getInput('Message'));
var deviceQueryString = taskslib.getInput('DeviceQueryString');
var deviceResultNumber = taskslib.getInput('DeviceResultNumber');

var registry = iothub.Registry.fromConnectionString(connectionString);
var Client = iothub.Client;
var client = Client.fromConnectionString(connectionString);


//methodName: 'microsoft.management.appInstall',

 var methodParams = {
        methodName:directMethodName,
        payload: messageToDevice,
        timeoutInSeconds: 30
    };

var invokeDirectMethod = function ( inQueryString, inResultNr, mParams) {
    console.log("################################");
    console.log("Start activating direct methods  ...");
    console.log("connectionString found: " + connectionString);
    console.log("deviceQueryString found: " + queryString);
    console.log("Message found: " +JSON.stringify(messageToDevice));
    console.log("deviceResultNumber found: " + inResultNr);   


    // create query
    var queryString = "SELECT * FROM devices";
    var resultNr = 10;
    if (inQueryString != null) {
        queryString = inQueryString;
    }

    if (inResultNr != null) {
        resultNr = parseInt(inResultNr);
    }

    var query = registry.createQuery(queryString, resultNr);


    // run query, iterate over results
    query.nextAsTwin(function (err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {

            console.log("Found " + results.length + " for query : \'" + queryString + "\'.");
            if (results.length > 0) {
                var i = 0;
                console.log(results.map(function (twin) { return "(" + i++ + ") " + twin.deviceId }).join('\n'));

                // invoke direct methods
                results.map(function (twin) {
                    
                    console.log("Start invoking direct method for device with id " + twin.deviceId + " .");

                    // send direct method to devices
                    client.invokeDeviceMethod(twin.deviceId, mParams, function (err, result) {
                        if (err) {
                            console.error('Failed to invoke method \'' + mParams.methodName + '\' on device '+ twin.deviceId +' : ' + err.message);
                        } else {
                            console.log('Successfully invoked '+ mParams.methodName + ' on ' + twin.deviceId + ':');
                            console.log(JSON.stringify(result, null, 2));
                        }
                    });

                }
                )
            }
        }

    });
};


invokeDirectMethod( deviceQueryString, deviceResultNumber,methodParams);
