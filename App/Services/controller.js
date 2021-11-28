const Services = require('./model');
const Packages = require('../Packages/model');

module.exports = {
    Create: async (req, res) => {
        try {
            let service = {};
            const packages = [];
            let newPackage = {};
            req.body.user = req.decoded._id;
            for (const pack of req.body.packages) {
                newPackage = await Packages.create(pack);
                packages.push(newPackage.id)
            }
            req.body.packages = packages;
            service = await Services.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a service',
                data: service
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
            let service = {};
            service = await Services.findOne({_id: id});
            if (!service) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such service.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: service
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
            let services = [];
            for (let package of req.body.packages) {
                await Packages.updateOne({_id: package._id}, {
                    $set: package
                })
            }
            await Services.updateOne({_id: id}, {
                $set: req.body
            });
            services = await Services.find({});
            return res.status(200).json({
                status: 'Successful',
                message: 'Service updated Successfully.',
                data: services
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
            let services = [];
            await Services.deleteOne({_id: id});
            services = await Services.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Service deleted Successfully.',
                data: services
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
            let services = [];
            services = await Services.find({});
            return res.status(200).json({
                status: 'Successful',
                data: services
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
            let services = [];
            services = await Services.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                data: services
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}