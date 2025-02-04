const express = require('express');
const router = express.Router();
const Device = require('../schemas/Device');


router.post('/devices', async (req, res) => {
    try {
        const { name, notes, imageName } = req.body;
        const newDevice = new Device({
            name,
            notes,
            imageName,
            created: new Date()
        });
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/devices', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const lastCreatedDate = req.query.lastCreatedDate;

        const query = lastCreatedDate
            ? { created: { $lt: new Date(lastCreatedDate) } }
            : {};

        const devices = await Device.find(query).sort({ created: -1 }).limit(limit);
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/devices/byId', async (req, res) => {
    try {
        const { deviceId } = req.query;
        const device = await Device.findOne({ _id: deviceId });
        if (!device) {
            res.status(400).json({ message: 'Device not found' });
        }
        res.status(201).json(device);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/devices/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const updateData = req.body;

        const updateDevice = await Device.findByIdAndUpdate(deviceId, updateData, { new: true, runValidators: true });

        if (!updateDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.status(200).json(updateDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/devices/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;

        const deletedDevice = await Device.findByIdAndDelete(deviceId);

        if (!deletedDevice) {
            res.status(400).json({ message: 'Device not found' });
        }

        res.json({ message: "Device deleted successfully", deletedDevice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
