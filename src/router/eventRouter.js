const {Router}  = require("express");
const { eventAttendModel, eventModel } = require("../Module/eventModule");
var jwt = require('jsonwebtoken');
require("dotenv").config();
const eventRouter = Router();

eventRouter.get("/",async(req,res)=>{
    const all_events = await eventModel.find();
    res.json({...all_events})
    // console.log("working")
})

eventRouter.post('/create',async(req,res)=>{
    let status = 0;
    let message = "All fields Are required eventName,eventDate,token";
    let return_data = [];
    const{eventName,eventDate,token} = req.body;
    if(eventName && eventDate && token && eventName!='' && eventDate!='' && token!=''){
        try {
            var decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            if(decoded){
                message = 'authorized';
                const new_event = {
                    eventId: parseInt(Math.random() * 10000000),
                    eventName,
                    eventDate,
                    eventOwner:decoded.email
                }
                const data = await eventModel.create(new_event);
                return_data = data;
            }
        } catch (error) {
            message = 'Unauthorized token'
        }
    }
    res.json({ status: status, message: message, data: return_data });
})


eventRouter.post('/delete',async(req,res)=>{
    let status = 0;
    let message = "All fields Are required eventId,token";
    let return_data = [];
    const{eventId,token} = req.body;
    if(eventId && token && eventId!='' && token!=''){
        console.log(eventId)
        try {
            var decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            if(decoded){
                message="Wrong event ID or Maybe you are not authorized to delete this event"
                const check = await eventModel.findOneAndDelete({eventId:eventId,eventOwner:decoded.email})
                if(check!=null){
                    status = 1;
                    message="Event Deleted"
                }
            }
        } catch (error) {
            message = 'Unauthorized token'
        }
    }
    res.json({ status: status, message: message, data: return_data });
})


eventRouter.post('/register',async(req,res)=>{
    let status = 0;
    let message = "All fields Are required eventId,token";
    let return_data = [];
    const{eventId,token} = req.body;
    if(eventId && token && eventId!='' && token!=''){
        message = 'Event ID not available';
        const event_data = await eventModel.findOne({eventId:eventId});
        if(event_data!=null){
            try {
                var decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
                if(decoded){
                    message = 'Your are already in this event';
                    const check = await eventAttendModel.findOne({eventId:eventId,attendBy:decoded.email});;
                    if(check==null){
                        const data = await eventAttendModel.create({eventId,attendBy:decoded.email});
                        return_data = data;
                        message = 'Event Participated successfully';
                        status=1;
                    }
                }
            } catch (error) {
                message = 'Unauthorized token'
            }
            
        }
    }
    res.json({ status: status, message: message, data: return_data });
})



module.exports = {eventRouter}