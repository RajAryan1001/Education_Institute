const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Raj:Rajaryan@cluster0.crfzpz6.mongodb.net/education').then(()=>{
    
    console.log('connected');
}).catch((err)=>{
    console.log(err);
})