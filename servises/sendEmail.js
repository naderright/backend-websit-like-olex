const nodeoutlook = require('nodejs-nodemailer-outlook')
function sendEmail(dest, message,attachment) {
    if (!attachment) {
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.outlok,
                pass: process.env.passOutlok
            },
            from: process.env.outlok,
            to: dest,
            subject: 'Hey you, awesome!',
            html: message,
            text: 'This is text version!',
            // attachments: [
            //     {
            //         filename: 'text1.txt',
            //         content: 'hello world!'
            //     }
            // ],
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        }
        );
    } else {
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.outlok,
                pass: process.env.passOutlok
            },
            from: process.env.outlok,
            to: dest,
            subject: 'Hey you, awesome!',
            // html: message,
            text: 'This is text version!',
            attachments: [
                {
                    filename: 'the day products.pdf',
                    path: attachment
                }
            ],
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        }
        );
    }
   
}

module.exports = sendEmail