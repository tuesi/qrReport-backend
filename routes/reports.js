const express = require('express');
const router = express.Router();
const Report = require('../schemas/Report');
const mongoose = require('mongoose');


router.post('/reports', async (req, res) => {
    try {
        const { deviceId, name, notes, message, location, dateCompleted, completed, imageName, createdBy } = req.body;
        const newReport = new Report({
            deviceId,
            name,
            notes,
            message,
            location,
            imageName,
            createdBy,
            completed,
            dateCompleted,
            created: new Date()
        });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const lastCreatedDate = req.query.lastCreatedDate;

        const query = lastCreatedDate
            ? { created: { $lt: new Date(lastCreatedDate) } }
            : {};

        const reports = await Report.find(query).sort({ completed: 1, created: -1 }).limit(limit);
        if (reports.length > 0) {
            res.status(200).json(reports);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/reports/:reportId', async (req, res) => {
    try {
        const { reportId } = req.params;

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { $set: { completed: true, dateCompleted: new Date() } },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
