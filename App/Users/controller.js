const UsersModel = require('./model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const environment = require('dotenv');

environment.config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    Create: async (req, res) => {
        try {
            let {
                userName,
                email
            } = req.body;
            let token = "", user = {};
            let existingAccount = await UsersModel.findOne({ email: email });
            if (existingAccount) {
                return res.status(409).json({
                    status: "Error",
                    errEmail: "Email already taken."
                });
            }
            existingAccount = await UsersModel.findOne({ userName: userName });
            if (existingAccount) {
                return res.status(409).json({
                    status: "Error",
                    errUserName: "Username already taken."
                });
            }
            user = await UsersModel.create(req.body);
            token = jwt.sign({ _id: user.id.toString() },
                process.env.TOKEN_SECRET,
                { expiresIn: "7 days" }
            );
            await UsersModel.updateOne({ _id: user.id }, {
                token: token
            });
            user = await UsersModel.findOne({ _id: user.id }, { password: 0, verificationCode: 0 });

            let message = '';
            message = '<div style="border-radius: 8px; background-color: #fff; padding: 20px 30px; text-align: center; box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.16); margin: 10px;">'
            message += '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Welcome to E-PRELOVED CATERING!</h2><br>';
            message += `<h3><b>Dear ${user.name}!</b></h3><br>` +
                `<p style="text-align: left;">We at E-Preloved Catering are so glad to have you on board. We create alliance of market groups. Feel free to place any query.</p>`;
            message += '<br><p style="text-align: left;"><b>Regards:</b></p><br><p>E-PRELOVED CATERING</p><br>';
            message += '</div>'

            const msg = {
                to: email,
                from: process.env.SENDER_EMAIL,
                subject: `E-PRELOVED CATERING: Welcome ${user.name}`,
                text: message,
                html: message
            };
            await sgMail.send(msg);
            return res.status(200).json({
                status: "Successful!",
                message: "Successfully Registered as a Client",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    Login: async (req, res) => {
        try {
            let { email, password } = req.body;
            email = email.toLowerCase();
            let user = await UsersModel.findOne({ email: email });
            if (!user) {
                return res.status(409).json({
                    status: "Error",
                    errEmail: "Invalid Email/Password"
                });
            }
            else {
                let isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return res.status(409).json({
                        status: "Error",
                        errPassword: "Invalid Email/Password"
                    });
                }
                else {
                    token = jwt.sign({ _id: user.id.toString() },
                        process.env.TOKEN_SECRET,
                        { expiresIn: "7 days" }
                    );
                    await UsersModel.updateOne({ _id: user.id }, {
                        token: token,
                        authType: 'simple'
                    });
                    user.token = token;
                    user.password = undefined;
                    return res.status(200).json({
                        status: "Successful",
                        message: "Successfully Logged In",
                        data: user
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    Update: async (req, res) => {
        try {
            let id = req.params.id;
            let user = {};

            user = await UsersModel.updateOne({ _id: id }, {
                $set: req.body
            });
            if (user.ok === 1) {
                user = await UsersModel.findOne({ _id: id }, { password: 0 });
                return res.status(200).json({
                    status: "Updated",
                    message: "Successfully Updated your Account Information",
                    data: user
                });
            }
            else {
                return res.status(409).json({
                    status: "Failed",
                    message: "Something went wrong"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    Remove: async (req, res) => {
        try {
            let id = req.params.id;
            let removeuser = await UsersModel.remove({ _id: id });
            if (removeuser.ok === 1) {
                return res.status(200).json({
                    status: "Deleted",
                    message: "Successfully deleted user account"
                });
            }
            else {
                return res.status(409).json({
                    status: "Failed",
                    message: "Failed to Delete. Try Again!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    List: async (req, res) => {
        try {
            const type = req.query.type === 'undefined' ? '' : req.query.type;
            let users = [];
            if (type) {
                users = await UsersModel.find({
                    role: type
                }, {
                    password: 0
                });
            }
            else {
                users = await UsersModel.find({}, { password: 0 });
            }
            if (users.length === 0) {
                return res.status(403).json({
                    status: "Failed",
                    message: "There are no users registered yet!"
                });
            }
            else {
                return res.status(200).json({
                    status: "Successfull",
                    data: users
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    View: async (req, res) => {
        try {
            let id = req.params.id;
            let user = {};
            user = await UsersModel.findOne({ _id: id }, { password: 0 });
            return res.status(200).json({
                status: "Successful",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    Verify: async (req, res) => {
        try {
            const verificationCode = req.body.verificationCode;
            const id = req.decoded._id;
            const user = await UsersModel.findOne({ _id: id }, { password: 0 });
            if (!user) {
                return res.status(403).json({
                    status: "Failed",
                    message: "Account not Found"
                });
            }
            else {
                if (verificationCode === user.verificationCode) {
                    await UsersModel.updateOne({ _id: id }, {
                        verified: "Yes",
                        verificationCode: null
                    })
                    return res.status(200).json({
                        status: "Successfull",
                        message: "Account Verified"
                    });
                }
                else {
                    return res.status(403).json({
                        status: "Failed",
                        errorVerificationCode: "Incorrect Code"
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const existingAccount = await UsersModel.findOne({ email: email }, { password: 0 });
            if (!existingAccount) {
                return res.status(403).json({
                    status: "Failed",
                    errEmail: "No such email exist"
                });
            }
            else {
                const verificationCode = jwt.sign({ _id: existingAccount._id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "12 hours" }
                );
                await UsersModel.updateOne({ _id: existingAccount._id }, {
                    changePasswordCode: verificationCode
                });
                const user = await UsersModel.findOne({ _id: existingAccount._id }, { password: 0 });
                let message = '';
                message = '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Forgot Password Portal</h2><br>';
                message += `<h3><b>Dear ${user.name}!</b></h3><br>` +
                    `<p>Welcome to TEXENN Change Password Portal. Kindly click down to set up your new password within 12 hours otherwise send a new link for registering: ${email}</p>`;
                message += `<a style="background-color: #636cff; padding: 10px 20px; color: white; border: none; border-radius: 8px;" href="${process.env.BASE_URL}/#/changepassword?email=${email}&token=${user.changePasswordCode}" target="_blank">Set Credentials</a>` +
                    '<br><p><b>Regards:</b></p><br><p>TEXENN</p><br>';
                const msg = {
                    to: user.email,
                    from: process.env.SENDER_EMAIL,
                    subject: `TEXENN: Forgot Password`,
                    text: message,
                    html: message
                };
                await sgMail.send(msg);
                return res.status(200).json({
                    status: "Successfull",
                    message: "Change Password link has been sent to your email. Use the the link to change Password."
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    changePassword: async (req, res) => {
        try {
            let { email, password } = req.body;
            const newPassword = bcrypt.hashSync(password, 10);
            const user = await UsersModel.findOne({ email: email }, { password: 0 });
            if (!user) {
                return res.status(403).json({
                    status: "Failed",
                    errEmail: "No such account registered"
                });
            }
            else {
                await UsersModel.updateOne({ email: email }, {
                    password: newPassword
                });
                return res.status(200).json({
                    status: "Successfull",
                    message: "Successfully Updated Password. Login with new Password"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const id = req.params.id;
            const {
                oldPassword,
                newPassword
            } = req.body;
            let user = await UsersModel.findOne({ _id: id });
            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                return res.status(403).json({
                    status: "Failed",
                    errOldPassword: "Incorrect password"
                });
            }
            const password = bcrypt.hashSync(newPassword, 10);
            await UsersModel.updateOne({ _id: id }, {
                password: password
            });
            user = await UsersModel.findOne({ _id: id }, { password: 0 });
            return res.status(200).json({
                status: "Successfull",
                message: "Your new password have been set.",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    UploadAvatar: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(500).json({
                    status: "Failed",
                    message: "Failed to upload you profile image. Try again."
                });
            }
            await UsersModel.updateOne({ _id: req.decoded._id }, {
                avatar: req.file.location
            });
            const user = await UsersModel.findOne({ _id: req.decoded._id }, { password: 0 });
            return res.status(200).json({
                status: "Successful",
                message: "Successfully uploaded your profile image",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Successful",
                message: error.message
            });
        }
    },
    updatePasswordByLink: async (req, res) => {
        try {
            let token = req.params.token;
            const {
                email,
                password
            } = req.body;
            let user = await UsersModel.findOne({ email: email }, { password: 0 });
            if (!user) {
                return res.status(403).json({
                    status: "Failed",
                    message: "No such User exist"
                });
            }
            if (user.token === token) {
                await UsersModel.updateOne({ email: email }, {
                    password: bcrypt.hashSync(password, 10)
                });
                let newToken = jwt.sign({ _id: user.id.toString() },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "7 days" }
                );
                await UsersModel.updateOne({ _id: user.id }, {
                    token: newToken
                });
                user = await UsersModel.findOne({ email: email }, { password: 0 });
                return res.status(200).json({
                    status: "Successful",
                    message: "Successfully Registered",
                    data: user
                });
            } else {
                return res.status(403).json({
                    status: "Failed",
                    message: "Request not authorized"
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    socialLogin: async (req, res) => {
        try {
            const { email } = req.body;
            let token = '';
            let user = {};
            const existingUser = await UsersModel.findOne({ email: email }, { password: 0 });
            if (existingUser) {
                user = existingUser
            } else {
                user = await UsersModel.create(req.body);
                let message = '';
                message = '<div style="border-radius: 8px; background-color: #fff; padding: 20px 30px; text-align: center; box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.16); margin: 10px;">'
                message += '<h2 style="font-weight: 700; text-decoration: underline; text-align:center">Welcome to Texenn!</h2><br>';
                message += `<h3><b>Dear ${user.name}!</b></h3><br>` +
                    `<p style="text-align: left;">We at Texenn are so glad to have you on board. We create alliance of market groups. Feel free to place any query.</p>`;
                message += '<br><p style="text-align: left;"><b>Regards:</b></p><br><p>TEXENN</p><br>';
                message += '</div>'
                
                const msg = {
                    to: user.email,
                    from: process.env.SENDER_EMAIL,
                    subject: `TEXENN: Welcome ${user.name}`,
                    text: message,
                    html: message
                };
                await sgMail.send(msg);
            }
            token = jwt.sign({ _id: user.id.toString() },
                process.env.TOKEN_SECRET,
                { expiresIn: "7 days" }
            );
            await UsersModel.update({ _id: user.id }, {
                token: token,
                authType: req.body.authType
            });
            user.token = token;
            user.password = undefined;
            return res.status(200).json({
                status: "Successful",
                message: "Successfully Logged In",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    updatePersonalInfo: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await UsersModel.findOneAndUpdate({ _id: id }, {
                $set: req.body
            });
            if (!user.personalInfo) {
                user = await UsersModel.findOneAndUpdate({ _id: id }, {
                    $set: {
                        profileCompleted: (user.profileCompleted + 25),
                        personalInfo: true
                    }
                });
            }
            return res.status(200).json({
                status: "Successful",
                message: "Updated personal info successfully",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    updateProfesionalInfo: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await UsersModel.findOneAndUpdate({ _id: id }, {
                $set: req.body
            });
            if (!user.professionalInfo) {
                user = await UsersModel.findOneAndUpdate({ _id: id }, {
                    $set: {
                        profileCompleted: (user.profileCompleted + 25),
                        professionalInfo: true
                    }
                });
            }
            return res.status(200).json({
                status: "Successful",
                message: "Updated personal info successfully",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    updateLinkedAccounts: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await UsersModel.findOneAndUpdate({_id: id}, {
                $set: req.body
            });
            if (!user.linkedAccounts) {
                user = await UsersModel.findOneAndUpdate({_id: id}, {
                    $set: {
                        profileCompleted: (user.profileCompleted + 25),
                        linkedAccounts: true
                    }
                });
            }
            return res.status(200).json({
                status: "Successful",
                message: "Updated personal info successfully",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    updateAccountSecurity: async (req, res) => {
        try {
            let id = req.params.id;
            let user = await UsersModel.findOneAndUpdate({_id: id}, {
                $set: req.body
            });
            if (!user.accountSecurity) {
                user = await UsersModel.findOneAndUpdate({_id: id}, {
                    $set: {
                        profileCompleted: (user.profileCompleted + 25),
                        accountSecurity: true
                    }
                });
            }
            return res.status(200).json({
                status: "Successful",
                message: "Updated personal info successfully",
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    },
    SwitchProfile: async (req, res) => {
        try {
            const id = req.decoded._id;
            let user = await UsersModel.findOne({_id: id},{password: 0});
            if (user.role === 'Buyer') {
                await UsersModel.updateOne({_id: id}, {
                    $set: {
                        role: 'Seller'
                    }
                })
            } else {
                await UsersModel.updateOne({_id: id}, {
                    $set: {
                        role: 'Buyer'
                    }
                })
            }
            user = await UsersModel.findOne({_id: id},{password: 0});
            return res.status(200).json({
                status: 'Successful',
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}