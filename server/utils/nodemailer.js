/**
 * @description 发送邮件模块
 */

 const nodemailer = require('nodemailer'),
    {email: config} = require('../config')
    transporter = nodemailer.createTransport(config)

module.exports = function(mail) {
    return new Promise((resolve) => {
        transporter.sendMail(mail, function(error, info) {
            if (error) {
                console.log(error)
                return resolve(false)
            }
            resolve(true)
            console.log('mail sent:', info.response);
        });
    })
};