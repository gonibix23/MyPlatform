const mongoose = require("mongoose");
const DeviceModel = mongoose.model('Device');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

require("dotenv").config({path: "../variables.env"});


module.exports.createDevice = function(req, res){
    const name = req.body.name;
    const type = req.body.type; 
    
    if(!name){
        res.status(400).send("Missing name");
    }

    const newDevice = new DeviceModel({
        name: name,
        type: type
    });
    newDevice.save().then(function(device){
        if(device){
            res.status(200).send('Device created');
        }
        else{
            res.status(400).send('Device creation failed');
        }
    });
};

module.exports.getDevices = function(req, res){
    DeviceModel.find({}).then(function(devices){
        res.json(devices);
    });
};

module.exports.getDevicesById = function(req, res){
    const deviceId = req.query.id;
    DeviceModel.findById(deviceId).then(function(device){
        if(device){
            res.json(device);
        }else{
            res.status(404).send("No device found with this id");
        }
    });
};

module.exports.updateDevice = function(req, res){
    const deviceId = req.body.deviceId;
    const newDeviceStatus = req.body.status;
    DeviceModel.findByIdAndUpdate(deviceId, {status:newDeviceStatus}).then(function(device){
        if(device){
            res.status(200).send("Device Updated Successfully");
        }else{
            res.status(404).send("No device found with this id");
        }
    });
}

module.exports.sendEmail = function(req, res){
    const deviceId = req.body.deviceId;
    const date = new Date();
    const formattedDate = date.toISOString();
    const msg = {
        to:"gonibix23@gmail.com",
        from: "HelloImAnEmail@happymail.com",
        subject: `Alert from device: ${deviceId} || Date: ${formattedDate}`,
        text: `Alert from device: ${deviceId} || Date: ${formattedDate}`,
        html: `<h1>Alert from device: ${deviceId} || Date: ${formattedDate}</h1>`,
    };

    sgMail.send(msg).then(function(message){
        console.log(message);
        if(message){
            res.status(200).send("Email sent");
        }
    });
};