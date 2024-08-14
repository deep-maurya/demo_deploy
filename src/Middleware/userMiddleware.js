
const { get_user_data } = require("../utils");


const validate = (req,res,next)=>{
    //console.log("validate middleware");
    const { name, email } = req.body;
    if(name=='' || email==''){
        res.json({messege:"Data is not correct"})
    } 
    const data = get_user_data();
    const emails = data.map((d,index)=>{
        return d.email;
    })
    if(emails.includes(email)){
        res.json({messege:"email is already used"})
    } else {
        next();
    }
    
}

const update_validate = (req,res,next) =>{
    const {id,name,email} = req.body;
    if(id && name && email && id!='' && name!='' && email!=''){
        //res.send("ok")
        console.log(id)
        const data = get_user_data();
        const ids = data.map((d,index)=>{
            return d.id;
        })
        //console.log(ids)
        console.log(ids.includes(id))
        if(ids.includes(id)){
            const emails = data.map((d,index)=>{
                return d.email;
            })
            if(emails.includes(email)){
                res.json({messege:"email is already used"})
            } else {
                
                next();
            }
            
        } else {
            res.json({messege:"Invalid ID"})
        }
    } else {
        res.json({messege:"pull all fileds with data (id,name,email)"})
    }
}

const delete_validate = (req,res,next) =>{
    const {id} = req.params;
    if(id && id!=''){
        const data = get_user_data();
        const ids = data.map((d,index)=>{
            return d.id;
        })
        if(ids.includes(id)){
            next();
        } else {
            res.json({messege:"Invalid ID"})
        }
    } else {
        res.json({messege:"fill all fileds with data (id)"})
    }
}


module.exports = {update_validate,validate,delete_validate}