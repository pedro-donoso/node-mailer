const nodemailer = require('nodemailer');

function envialo(to, subject, text) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'correopruebas765@gmail.com',
            pass: 'nodemailer'
        }
    })

    let myOptions = {
        from: 'correopruebas765@gmail.com',
        to: to,
        subject: subject,
        text: text,
    }

    transporter.sendMail(myOptions, (err, data) => {
        if (err) console.log(err);
        if (data) console.log(data);
    })
}

module.exports = envialo;