const express = require('express');
const router = express.Router();
const PartDevice = require('../schemas/PartDevice');

router.get('/part-devices', async (req, res) => {
    try {
        const partDevices = await PartDevice.findOne();
        res.status(200).json(partDevices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
