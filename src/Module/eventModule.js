const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
    eventId:{
        type:Number,
        required:true,
        unique:true,
    },
    eventName:{
        type:String,
        required:true,
    },
    eventOwner:{
        type:String,
        ref:'users',
        required:true
    },
    eventDate:{
        type:Date,
        required:true
    }
})

const eventModel = model('events',eventSchema);




const event_attand_schema = new Schema({
    eventId:{
        type:Number,
        ref:'events',
        required:true
    },
    attendBy:{
        type:String,
        ref:'users',
        required:true
    }
})

const eventAttendModel = model('event_attend',event_attand_schema);

module.exports = {eventModel,eventAttendModel}