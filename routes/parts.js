const express = require('express');
const router = express.Router();
const Part = require('../schemas/Part');
const { setPartDevice, updatePartDevice } = require('../services/partDeviceService');


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

router.patch('/parts', async (req, res) => {
    try {
        const { partId, partData, deviceId } = req.body;

        const updatePart = await Part.findByIdAndUpdate(partId, partData, { new: true, runValidators: true });

        if (!updatePart) {
            return res.status(404).json({ message: 'Part not found' });
        } else {
            //Update part device for part list
            await updatePartDevice(deviceId, partData.amount, partData.minAmount);
            //Return updated part
            res.status(200).json(updatePart);
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/parts', async (req, res) => {
    try {
        const { deviceId, lastCreatedDate } = req.query;

        limit = parseInt(req.query.limit) || 4;

        const query = lastCreatedDate
            ? { deviceId: deviceId, created: { $lt: new Date(lastCreatedDate) } }
            : { deviceId: deviceId };

        const parts = await Part.find(query).sort({ created: -1 }).limit(limit);
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/parts/:partId', async (req, res) => {
    try {
        const { partId } = req.params;

        const deletedPart = await Part.findByIdAndDelete(partId);

        if (!deletedPart) {
            res.status(400).json({ message: 'Part not found' });
        }

        res.json({ message: "Part deleted successfully", deletedPart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;