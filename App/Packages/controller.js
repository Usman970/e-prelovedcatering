const Packages = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let package = {};
            req.body.user = req.decoded._id;
            package = await Packages.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a package',
                data: package
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
            let package = {};
            package = await Packages.findOne({_id: id});
            if (!package) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such package.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: package
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
            let package = {};
            await Packages.updateOne({_id: id}, {
                $set: req.body
            });
            package = await Packages.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Package updated Successfully.',
                data: package
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
            let packages = [];
            await Packages.deleteOne({_id: id});
            packages = await Packages.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Package deleted Successfully.',
                data: packages
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
            let packages = [];
            packages = await Packages.find({});
            return res.status(200).json({
                status: 'Successful',
                data: packages
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
            let packages = [];
            packages = await Packages.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                data: packages
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}