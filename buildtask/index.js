'use strict';

var taskslib = require('vsts-task-lib/task');
var iothub = require('azure-iothub');

var connectionString = taskslib.getInput('IotHubConnectionString');
var twinPatch = taskslib.getInput('DeviceTwinPatchString');
var deviceQueryString = taskslib.getInput('DeviceQueryString');
var deviceResultNumber = taskslib.getInput('DeviceResultNumber');

var registry = iothub.Registry.fromConnectionString(connectionString);

// sample patch
// var twinPatch = {
//     tags: {
//         myprop: {
//             subprop: "hello",
//             other: "world",
//             num: 1
//         }
//     }
// };


var updateDeviceTwinsWithPatch = function (patch, inQueryString, inResultNr) {
    console.log("################################");
    console.log("Start working on device twins ...");
    console.log("connectionString found: " + connectionString);
    console.log("deviceQueryString found: " + queryString);
    console.log("twinPatch found: " + patch);
    console.log("deviceResultNumber found: " + inResultNr);


    // create query
    var queryString = "SELECT * FROM devices";
    var resultNr = 1000;
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
                console.log(results.map(function (twin) { return "(" + i++ + ")" + twin.deviceId }).join('\n'));

                // update all found twins
                results.map(function (twin) {
                    twin.update(patch, function (err) { });
                    console.log("Updated device twin for device with id " + twin.deviceId + " .");
                }
                )
            }
        }

    });
};


updateDeviceTwinsWithPatch(twinPatch, deviceQueryString, deviceResultNumber);
