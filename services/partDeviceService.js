const PartDevice = require('../schemas/PartDevice');

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

module.exports = setPartDevice;