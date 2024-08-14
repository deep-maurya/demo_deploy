const mongoose = require('mongoose');
const DBConnect = async(url) =>{
    try {
        let conn = await mongoose.connect(url);
        console.log("Database connection confirm")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {DBConnect}
