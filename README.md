# VSTS Extension to trigger Azure IoT Hub Direct Methods
This VSTS extension triggers Azure IoT Hub Direct Methods. I wrote it primarly as an example how to trigger IoT Device Updates running "Windows 10 IoT Core" following the approach described [here]("https://github.com/ms-iot/iot-core-azure-dm-client"). Feel free to modify and adjust it.

## Installation
You can install the latest version directly from Visual Studio marketplace [here]("https://marketplace.visualstudio.com/items?itemName=DanielMeixner.IotHub-DirectMethod") into your Visual Studio Team Services account. It will appear as a build and release task in the "Utilites" category.


## Parameters
Here's how you use it. Specify the following values:
* Azure IoT Hub Connections string - you can find it in Azure portal
* Direct Method Name - the name of the direct method you want to trigger. It has to be implemented on the device of course. For application updates on Windows 10 IoT Core you can use microsoft.management.appInstall but make sure to follow the guidance [here]("https://github.com/ms-iot/iot-core-azure-dm-client/blob/master/docs/application-management.md").
* Json Payload - the payload depends on the method you're calling. For application updates on Windows 10 IoT Core take a look [here]("https://github.com/ms-iot/iot-core-azure-dm-client/blob/master/docs/application-management.md") again.
* Device Query - The default query is "Select * from devices" however you can specify some filters using device query language, eg. "select * from devices where deviceid='myRaspbi1'. You can also filter on device tags in the devicetwin. Pretty awesome. Check [here]("https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-query-language")for docs.
* Number of results - the numer of devices returned. Default is 1000.


## What it does
If you run this extension it will ...
1. read the parameters provided by you.
1. run a device query according to your query.
1. iterate over the result set 
1. trigger the direct method for this device
1. provide the payload for the method.



## Compile
If you want you can clone and compile yourself. 
*   You need gulp installed besides some other prereqs for creation of VSTS extensions. Check details for tfx-cli etc [here]("https://www.visualstudio.com/en-us/docs/integrate/extensions/develop/add-build-task#preparation-and-required-setup-for-this-tutorial").
Then run 
    >`` gulp build --num=1   ``

to create an appx. This will trigger a copy & build procedure. See limitation if errors occur!

## Limitations
* If a device is offline the method won't be triggered, however the task will not fail.
* The gulp procedure isn't perfect yet. I found I have to  manually ``npm restore`` in between. 
* This is the first public release. You'll find more limitations :-)




