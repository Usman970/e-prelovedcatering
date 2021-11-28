const OrderServices = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let orderService = {};
            orderService = await OrderServices.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully ordered this service.'
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
            let orderService = {};
            orderService = await OrderServices.findOne({_id: id});
            if (!orderService) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such OrderServices.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: orderService
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
            let orderService = {};
            await OrderServices.updateOne({_id: id}, {
                $set: req.body
            });
            orderService = await OrderServices.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'orderService updated Successfully.',
                data: orderService
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
            let orderServices = [];
            await OrderServices.deleteOne({_id: id});
            orderServices = await OrderServices.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'orderService deleted Successfully.',
                data: orderServices
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
            let orderServices = [];
            orderServices = await OrderServices.find({});
            return res.status(200).json({
                status: 'Successful',
                data: orderServices
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
            let orderServices = [];
            orderServices = await OrderServices.find({
                $or: [
                    { user: req.decoded._id },
                    { seller: req.decoded._id }
                ]
            });
            return res.status(200).json({
                status: 'Successful',
                data: orderServices
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}