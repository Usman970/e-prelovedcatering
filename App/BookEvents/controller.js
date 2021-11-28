const BookEvents = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let bookEvent = {};
            bookEvent = await BookEvents.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully booked this event.'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Read: async (req, res) => {
        try {
            const id = req.params.id;
            let bookEvent = {};
            bookEvent = await BookEvents.findOne({_id: id});
            if (!bookEvent) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such BookEvents.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: bookEvent
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Update: async (req, res) => {
        try {
            const id = req.params.id;
            let bookEvent = {};
            await BookEvents.updateOne({_id: id}, {
                $set: req.body
            });
            bookEvent = await BookEvents.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Booked Event updated Successfully.',
                data: bookEvent
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Delete: async (req, res) => {
        try {
            const id = req.params.id;
            let bookEvents = [];
            await BookEvents.deleteOne({_id: id});
            bookEvents = await BookEvents.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'bookEvent deleted Successfully.',
                data: bookEvents
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    List: async (req, res) => {
        try {
            let bookEvents = [];
            bookEvents = await BookEvents.find({});
            return res.status(200).json({
                status: 'Successful',
                data: bookEvents
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    ListByUser: async (req, res) => {
        try {
            let bookEvents = [];
            bookEvents = await BookEvents.find({
                $or: [
                    { user: req.decoded._id },
                    { seller: req.decoded._id }
                ]
            });
            return res.status(200).json({
                status: 'Successful',
                data: bookEvents
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}