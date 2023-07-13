const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "michal.s.limeacademy@gmail.com",
        pass: "gmh1Y8HZPRqn2VFy",
    }
});

const mailOptions = {
    from: 'MichalBNB <michal.s.limeacademy@gmail.com>',
    to: 'michal.s.pub@gmail.com',
};

const sendBalanceEmail = (amount) => {
    const date = new Date();
    mailOptions.subject = `[${date.toLocaleString("pl-PL")}] Stan konta ${amount} USD`;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendSuccessEmail = (amount, balance) => {
    const date = new Date();
    mailOptions.subject = `[${date.toLocaleString("pl-PL")}] Uzupelniono konto o ${amount} USD, Stan konta: ${amount + balance}`;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendStartMessage = () => {
    const date = new Date();
    mailOptions.subject = `[${date.toLocaleString("pl-PL")}] MySite Backend started working`;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendErrorEmail = (message) => {
    const date = new Date();
    mailOptions.subject = `[${date.toLocaleString("pl-PL")}] Error! ${message}`;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const emailService = {
    sendSuccessEmail,
    sendBalanceEmail,
    sendStartMessage,
    sendErrorEmail
};

module.exports = emailService;