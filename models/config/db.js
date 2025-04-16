const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Education').then(()=>{
    console.log('connected');
}).catch((err)=>{
    console.log(err);
})