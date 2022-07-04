const mongoose = require('mongoose');


const connectionDB = ()=>{
    return mongoose.connect(process.env.url_DB)
    .then(result=> console.log(`DB connect in URL :: ${process.env.url_DB}`))
    .catch(err=> console.log(`DB connection err `))
};


module.exports = connectionDB