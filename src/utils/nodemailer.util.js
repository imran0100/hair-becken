const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'avinashCodekit@gmail.com',
        pass: 'iqwr vwjo rilh kqfg'
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'avinashCodekit@gmail.com',
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };






