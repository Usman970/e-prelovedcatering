const Categories = require('./model');

module.exports = {
    Create: async (req, res) => {
        try {
            let category = {};
            req.body.user = req.decoded._id;
            category = await Categories.create(req.body);
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully added a category',
                data: category
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
            let category = {};
            category = await Categories.findOne({_id: id});
            if (!category) {
                return res.status(200).json({
                    status: 'Failed',
                    message: 'No such category.'
                });
            } else {
                return res.status(200).json({
                    status: 'Successful',
                    data: category
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
            let category = {};
            await Categories.updateOne({_id: id}, {
                $set: req.body
            });
            category = await Categories.findOne({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Category updated Successfully.',
                data: category
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
            let categories = [];
            await Categories.deleteOne({_id: id});
            categories = await Categories.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Category deleted Successfully.',
                data: categories
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
            let categories = [];
            categories = await Categories.find({});
            return res.status(200).json({
                status: 'Successful',
                data: categories
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
            let categories = [];
            categories = await Categories.find({user: req.decoded._id});
            return res.status(200).json({
                status: 'Successful',
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}