const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'Authentication failed! No user for this email address!'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if(!result){
                return res.status(401).json({
                    message: 'Authentication failed! Password wrong!'
                });
            }
            const token = jsonWebToken.sign({email: fetchedUser.email, userId: fetchedUser._id},
                'HereShouldBeASecretMessage!',
                {expiresIn: '1h'});
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                userName: fetchedUser.firstname,
                isAdmin: fetchedUser.isAdmin
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials!',
                error: err
            });
        });
}

exports.userSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            const user = new User({
                firstname: req.body.firstname,
                surname: req.body.surname,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: Boolean(req.body.isAdmin)
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created successfully!',
                        result: result
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!',
                    });
                });
        });
}

exports.isUserAdmin = (req, res, next) => {
    User.findOne({_id: req.params.id})
        .then(fetchedUser => {
            if(fetchedUser) {
                res.status(200).json({
                    isAdmin: fetchedUser.isAdmin,
                    userName: fetchedUser.firstname
                })
            } else {
                res.status(404).json({message: 'User not found!'});
            }
        });
}