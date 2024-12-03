const PartDevice = require('../schemas/PartDevice');
const Device = require('../schemas/Device');

const setPartDevice = async (deviceData, amount, minAmount) => {
    try {
        let partDevices = await PartDevice.findOne({ deviceMap: 'partDevices' });

        if (!partDevices) {
            // Create a new PartDevice if it doesn't exist
            partDevices = new PartDevice({
                deviceMap: 'partDevices',
                mapOfArrays: new Map()
            });
        }

        const hasLowAmount = amount < minAmount;

        partDevices.mapOfArrays.set(deviceData.id,
            {
                name: deviceData.name,
                hasLowAmount
            }
        );

        await partDevices.save();
    } catch (error) {
        console.error(error);
    }
}

const updatePartDevice = async (deviceId, amount, minAmount) => {
    try {
        console.log(deviceId);
        const device = await Device.findOne({ _id: deviceId });
        if (!device) {
            console.error('Device not found');
            return;
        }

        console.log(device);

        let partDevices = await PartDevice.findOne({ deviceMap: 'partDevices' });
        if (!partDevices) {
            console.error('Part devices not found');
            return;
        }

        const hasLowAmount = amount < minAmount;

        if (!partDevices.mapOfArrays.has(deviceId)) {
            console.error('Device ID not found');
            return;
        }

        partDevices.mapOfArrays.set(deviceId,
            {
                name: device.name,
                hasLowAmount
            }
        );

        await partDevices.save();

    } catch (error) {
        console.error(error);
    }
}

module.exports = { setPartDevice, updatePartDevice };