const nodemailer = require('nodemailer');

const baseUrl = process.env.APP_BASE_URL;

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

const sendBalanceEmailAsync = (amountPLN) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        mailOptions.subject = `[${date.toLocaleString("pl-PL")}] Stan konta ${amountPLN} PLN`;
        mailOptions.html = `<a href="${baseUrl}/send-email-with-balance/">Send me current balance</p>`
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject();
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    })
}

const sendSuccessEmail = (amountPLN, balancePLN) => {
    const date = new Date();
    mailOptions.subject = `[${date.toLocaleString("pl-PL")}] Uzupelniono konto o ${amountPLN} PLN, Stan konta: ${amountPLN + balancePLN}`;

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
    mailOptions.html = `<a href="${baseUrl}/send-email-with-balance/">Send me current balance</p>`

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
    sendBalanceEmailAsync,
    sendStartMessage,
    sendErrorEmail
};

module.exports = emailService;