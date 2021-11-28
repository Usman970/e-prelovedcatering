const jwt = require('jsonwebtoken');
const environment = require('dotenv');
// const crypto = require('crypto');
// const adminModel = require('../App/Admin/model');
environment.config;

const UsersModel = require('../App/Users/model');

const authenticateToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        const user = await UsersModel.findOne({_id: req.decoded._id}, { password: 0 });
        if (!user) {
          return res.status(401).json({
            status: "Failed",
            message: "Account does't exist"
          });
        } else {
          next();
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

const decryptToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        next();
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    next();
    // if (!req.body.userEmail && !req.body.userName){
    //   return res.json({
    //     success: false,
    //     errUserInfo: "Yes",
    //     status: "Failed",
    //     message: 'Fill out your information in order to keep the track of you request.'
    //   });
    // }
  }
};

// const webhookVerification = async (req, res, next) => {
//   const hmac = req.headers['x-shopify-hmac-sha256'];
//   // const body =  await getRawBody(req);

//   const hash = crypto
//     .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
//     .update(req.rawBody, 'utf8', 'hex')
//     .digest('base64')

//     if (hash === hmac) {
//       next();
//     } else {
//       // No match! This request didn't originate from Shopify
//       console.log('Danger! Not from Shopify!')
//       res.sendStatus(403)
//     }
// };

// const adminAuthentication = async ( req, res, next ) => {
//   const token = req.session.token;
//   if ( !token ) {
//     res.redirect('/');
//   }
//   else {
//     const adminExist = await adminModel.findOne({token: token});
//     if ( !adminExist ) {
//       res.redirect('/');
//     }
//     else {
//       next();
//     }
//   }
// }
const decryptPasswordToken = async (req, res, next) => {
  const { verificationCode } = req.body;
  if (verificationCode) {
    jwt.verify(verificationCode, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          errCode: 'Request verification is not valid or is Expired'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Not authorized, try visiting again from the link in email.'
    });
  }
}
const permissions = function (permission) {
  return async function (req, res, next) {
    const user = await UsersModel.findOne({_id: req.decoded._id}, { password: 0 });
    if (!user) {
      return res.status(403).json({
        status: "Failed",
        message: "Account does't exist"
      });
    } else {
      if (permission === 'Add User') {
        if (user.role.permissions.indexOf('Add User') === -1 && user.role.permissions.indexOf('Add Moderator') === -1) {
          return res.status(404).json({
            status: "Failed",
            message: "Not authorized for the request."
          });
        }
      }
      if (permission === 'Remove User') {
        if (user.role.permissions.indexOf('Remove User') === -1 && user.role.permissions.indexOf('Remove Moderator') === -1) {
          return res.status(404).json({
            status: "Failed",
            message: "Not authorized for the request."
          });
        }
      }
      if (user.role.permissions.indexOf(permission) === -1) {
        return res.status(404).json({
          status: "Failed",
          message: "Not authorized for the request."
        });
      }
      next();
    }
  }
}

module.exports = {
    authenticateToken,
    // decryptToken,
    // decryptPasswordToken,
    // permissions
}
