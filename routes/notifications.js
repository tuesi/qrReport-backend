const express = require('express');
const router = express.Router();
const Notification = require('../schemas/Notification');


router.post('/token', async (req, res) => {
    try {
        const { token } = req.body;

        let notificationDoc = await Notification.findOne({});

        if (!notificationDoc) {
            // Create the document if it doesn't exist
            notificationDoc = new Notification({
                tokens: [token]
            });
        } else {
            // Check if the token already exists in the array
            if (!notificationDoc.tokens.includes(token)) {
                // Add the new token to the array
                notificationDoc.tokens.push(token);
            } else {
                return res.status(409).json({ message: 'Token already exists' });
            }
        }

        // Save the updated document
        await notificationDoc.save();
        res.status(201).json(notificationDoc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
