const express = require('express');
const path = require('path');
const connectionDB = require('./DB/connectionDB');
require('dotenv').config();
const router = require('./modules/Router.js');''
const app = express();
const cors = require('cors');
const { initIO } = require('./servises/socket');
const userModel = require('./DB/models/userModel');
const sendPDF = require('./sendPDF');


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use('/api/v1/auth', router.auth);
app.use('/api/v1/user', router.user);
app.use('/api/v1/product', router.product);



sendPDF()
connectionDB()
const server = app.listen(process.env.port, () => {
    console.log('server running in port ' + process.env.port);
});


const io = initIO(server);


io.on('connection', (socket) => {

    socket.on("updateSocketID", async (data) => {
        await userModel.findByIdAndUpdate(data, { socketID: socket.id })
    })
    // console.log(socket.id);
});