const Events = require('./model');
const Packages = require('../Packages/model');

module.exports = {
    Create: async (req, res) => {
        try {
            let event = {};
            const packages = [];
            let newPackage = {};
            req.body.user = req.decoded._id;
            for (const pack of req.body.packages) {
                newPackage = await Packages.create(pack);
                packages.push(newPackage.id)
            }
            req.body.packages = packages;
            event = await Events.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a events',
                data: event
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
            let events = {};
            events = await Events.findOne({_id: id});
            if (!events) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such events.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: events
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
            let events = [];
            await Events.updateOne({_id: id}, {
                $set: req.body
            });
            for (let package of req.body.packages) {
                await Packages.updateOne({_id: package._id}, {
                    $set: package
                })
            }
            events = await Events.find({});
            return res.status(200).json({
                status: 'Successful',
                message: 'Event updated Successfully.',
                data: events
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
            let eventss = [];
            await Events.deleteOne({_id: id});
            eventss = await Events.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Event deleted Successfully.',
                data: eventss
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
            let eventss = [];
            eventss = await Events.find({});
            return res.status(200).json({
                status: 'Successful',
                data: eventss
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
            let eventss = [];
            eventss = await Events.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                data: eventss
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}