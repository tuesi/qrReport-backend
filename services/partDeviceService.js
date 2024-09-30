const PartDevice = require('../schemas/PartDevice');

const setPartDevice = async (deviceData) => {

    try {
        let partDevices = await PartDevice.findOne({ deviceMap: 'partDevices' });

        if (!partDevices) {
            // Create a new PartDevice if it doesn't exist
            partDevices = new PartDevice({
                deviceMap: 'partDevices',
                mapOfArrays: {}
            });
        }

        if (!partDevices.mapOfArrays[deviceData.deviceId]) {
            partDevices.mapOfArrays[deviceData.deviceId] = [{ name: deviceData.name, hasLowAmmount: false }];
        } else {
            partDevices.mapOfArrays[deviceId] = partDevices.mapOfArrays[deviceId].map(() => {
                return {
                    deviceName: deviceName,
                    hasLowAmmount: false
                };
            });
        }

        await partDevices.save();
    } catch (error) {
        console.error(error);
    }
}

module.exports = setPartDevice;