const express = require('express');
const router = express.Router();
const Part = require('../schemas/Part');
const setPartDevice = require('../services/partDeviceService');


router.post('/parts', async (req, res) => {
    try {
        const { partData, deviceData } = req.body;
        const { name, notes, location, imageName, deviceId, amount, minAmount } = partData;
        const newPart = new Part({
            name,
            notes,
            location,
            imageName,
            deviceId,
            amount,
            minAmount,
            created: new Date()
        });
        await newPart.save();

        //Create part device for part list
        await setPartDevice(deviceData, amount, minAmount);

        res.status(201).json(newPart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/parts/:partId', async (req, res) => {
    try {
        const { partId } = req.params;
        const { partData, deviceData } = req.body;

        const updatePart = await Part.findByIdAndUpdate(partId, partData, { new: true, runValidators: true });

        if (!updatePart) {
            return res.status(404).json({ message: 'Part not found' });
        } else {
            //Update part device for part list
            await setPartDevice(deviceData, partData.amount, partData.minAmount);
            //Return updated part
            res.status(200).json(updatePart);
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/parts/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log(deviceId);
        const parts = await Part.find({ deviceId: deviceId });
        console.log(parts);
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;