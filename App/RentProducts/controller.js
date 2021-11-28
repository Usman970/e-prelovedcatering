const RentProducts = require('./model');
const Products = require('../Products/model');

module.exports = {
    Create: async (req, res) => {
        try {
            let rentProduct = {};
            rentProduct = await RentProducts.create(req.body);
            await Products.updateOne({_id: req.body.product}, {
                $set: {
                    status: 'Unavailable'
                }
            });
            const product = await Products.findOne({_id: req.body.product});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully rented this product out.',
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
            let rentProduct = {};
            rentProduct = await RentProducts.findOne({_id: id});
            if (!rentProduct) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such RentProducts.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: rentProduct
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
            let rentProduct = {};
            await RentProducts.updateOne({_id: id}, {
                $set: req.body
            });
            rentProduct = await RentProducts.findOne({_id: id});
            await Products.updateOne({_id: rentProduct.product.id}, {
                $set: {
                    status: 'Available'
                }
            });
            const rentProducts = await RentProducts.find({seller: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'rentProduct updated Successfully.',
                data: rentProducts
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
            let rentProducts = [];
            await RentProducts.deleteOne({_id: id});
            rentProducts = await RentProducts.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'rentProduct deleted Successfully.',
                data: rentProducts
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
            let rentProducts = [];
            rentProducts = await RentProducts.find({});
            return res.status(200).json({
                status: 'Successful',
                data: rentProducts
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
            let rentProducts = [];
            rentProducts = await RentProducts.find({
                $or: [
                    { user: req.decoded._id },
                    { seller: req.decoded._id }
                ]
            });
            return res.status(200).json({
                status: 'Successful',
                data: rentProducts
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}