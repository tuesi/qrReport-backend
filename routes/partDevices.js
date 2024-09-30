const express = require('express');
const router = express.Router();
const PartDevice = require('../schemas/PartDevice');


router.patch('/part-devices', async (req, res) => {
    try {
        const { deviceId, deviceName, hasLowAmmount } = req.body;
        let partDevices = await PartDevice.findOne({ deviceMap: 'partDevices' });

        if (!partDevices) {
            // Create a new PartDevice if it doesn't exist
            partDevices = new PartDevice({
                deviceMap: 'partDevices',
                mapOfArrays: {}
            });
        }

        if (partDevices.mapOfArrays[deviceId]) {
            partDevices.mapOfArrays[deviceId] = partDevices.mapOfArrays[deviceId].map(() => {
                return {
                    deviceName: deviceName,
                    hasLowAmmount: hasLowAmmount
                };
            });
        } else {
            // If the deviceId doesn't exist, return an error
            return res.status(404).json({ message: 'Device not found in part devices' });
        }

        await partDevices.save();
        res.status(201).json(partDevices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/part-devices', async (req, res) => {
    try {
        const partDevices = await PartDevice.find();
        res.status(200).json(partDevices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
