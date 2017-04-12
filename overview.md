# IoT Hub Trigger Task
Use this task to trigger your instance of Azure IoT Hub to send messages to devices.

## What you have to specify
1. Connections string
2. The rest api to query the devices.
3. The auth key to access IoT Hub.
4. An Id for the message.
5. The message.

## Known issues with G_VERSION
- Auth key has to be Base 64 encoded. (I experienced some troubles in passing in an un-encoded string so this is a temporary workaround)
- Your message should be plain text without fancy characters. (Not sure yet what exactly fancy means, you can do some experiments if you want, but be warned. This will be addressed in future versions )

You can find all the necessary keys in Azure portal.

This is an open source project which can be found [here](https://github.com/DanielMeixner/vsts-task-iothub). (https://github.com/DanielMeixner/vsts-task-iothub) 

The idea behind is to use Visual Studio Team Services in "DevOps for IoT" or "DevOps for Devices" scenarios as described in my blogpost [here](https://blogs.msdn.microsoft.com/dmx/2017/01/26/devops-for-iot-part-1/). 
(https://blogs.msdn.microsoft.com/dmx/2017/01/26/devops-for-iot-part-1/)


