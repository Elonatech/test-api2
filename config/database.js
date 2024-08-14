const mongoose = require('mongoose');
const { mongourl } = require('./key')


const connectMongodb = async () =>{
    try {
   await mongoose.connect(mongourl)
   console.log('MongoDB Connected')
    } catch (error) {
      console.log(error);
    }
  
  }
  
  module.exports = {connectMongodb}