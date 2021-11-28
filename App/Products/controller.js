const Products = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let product = {};
            req.body.user = req.decoded._id;
            product = await Products.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a product',
                data: product
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
            let product = {};
            product = await Products.findOne({_id: id});
            if (!product) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such product.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: product
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
            let products = [];
            await Products.updateOne({_id: id}, {
                $set: req.body
            });
            products = await Products.find({});
            return res.status(200).json({
                status: 'Successful',
                message: 'product updated Successfully.',
                data: products
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
            let products = [];
            await Products.deleteOne({_id: id});
            products = await Products.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'product deleted Successfully.',
                data: products
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
            let products = [];
            products = await Products.find({});
            return res.status(200).json({
                status: 'Successful',
                data: products
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
            let products = [];
            products = await Products.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                data: products
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}