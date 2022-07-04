const productModel = require('./DB/models/productModel');
const sendEmail = require('./servises/sendEmail');
const { createInvoice } = require('./servises/pdf.js')
const schedule = require('node-schedule');
const path = require('path');
const userModel = require('./DB/models/userModel');

const sendPDF = async () => {

    const moment = require('moment');
    const todays = moment().add('days').toISOString().split('T')[0];
    const products = await productModel.find({});
    const productsDay = products.filter((product) => {
        const product_createdAt = product.createdAt.toISOString().split('T')[0];
        return product_createdAt == todays;
    });
    const invoicePro = productsDay.map(product => {
        const items = {
            product_title: product.product_title,
            Product_desc: product.Product_desc,
            Product_price: product.Product_price,

        }

        return items
    });

    const invoice = {
        shipping: {
            name: "Nader mohamed",
            address: "1234 Main Street",
            city: "cairo",
            state: "CA",
            country: "egypt",
            postal_code: 94111
        },
        items: invoicePro,
        productsCount: invoicePro.length,
        paid: 0,
        invoice_nr: 147830
    };
    createInvoice(invoice, path.join(__dirname, './uploads/PDF/invoice.pdf'));

    schedule.scheduleJob('58 58 22 * * *', async function () {
        const admin = await userModel.findOne({ role: 'admin' });
        const email = admin.Email;
        sendEmail(email, "hi", path.join(__dirname, './uploads/PDF/invoice.pdf'))
    });
};

module.exports = sendPDF;