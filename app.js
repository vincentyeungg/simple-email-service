const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(process.env.PORT || process.env.DEV_PORT, () => {
    console.log("Server started successfully");
});

app.post('/api/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    var mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: subject,
        html: `<p>My name is ${name}</p>
                <p>Email me back at ${email}</p>
                <p>${message}</p>`
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            res.send({ error: error });
        } else {
            res.send({ message: "Message sent successfully." });
        }
        smtpTransport.close();
    });

});