const Invoice = require("../models/invoice.model");x


exports.createInvoice = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const invoice = new Invoice({
        restaurant: req.body.restaurant,
        date: req.body.date,
        amount: Number(req.body.amount),
        imagePath: url + '/images/' + req.file.filename
    });
    invoice.save()
        .then(createdInvoice => {
            res.status(201).json({
                message: 'Invoice added successfully!',
                post: {
                    ...createdInvoice,
                    id: createdInvoice._id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating an invoice failed!'
            });
        });
};

exports.getInvoices = (req, res, next) => {
    Invoice.find()
        .then(fetchedInvoices => {
            res.status(200).json({
                message: 'Invoices fetched successfully!',
                invoices: fetchedInvoices
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching invoices failed!'
            });
        });
};

exports.getInvoice = (req, res, next) => {
    Invoice.findOne({_id: req.params.id})
        .then(fetchedInvoice => {
            if(fetchedInvoice) {
                res.status(200).json(fetchedInvoice)
            } else {
                res.status(404).json({message: 'Invoice not found!'});
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching invoice failed!'
            });
        });
};

exports.updateInvoice = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const invoice = new Invoice({
        _id: req.body.id,
        restaurant: req.body.restaurant,
        date: req.body.date,
        amount: Number(req.body.amount),
        imagePath: imagePath
    });
    Invoice.updateOne({_id: req.params.id}, invoice)
        .then(result => {
            res.status(200).json({message: 'Invoice updated successfully!'});
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update an invoice!"
            });
        });
};

exports.deleteInvoice = (req, res, next) => {
    Invoice.deleteOne({_id: req.params.id})
        .then(result =>{
            res.status(200).json({message: 'Invoice deleted successfully!'});
            /*
            if(result.n > 0){
                res.status(200).json({message: 'Invoice deleted successfully!'});
            } else {
                res.status(401).json({message: 'Not authorized!'});
            }

            */
        })
        .catch(error => {
            res.status(500).json({
                message: 'Deleting invoice failed!'
            });
        });
};