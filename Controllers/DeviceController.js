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
    DeviceModel.findById(deviceId).then(function(device){
        const date = new Date();
    const formattedDate = date.toISOString();
    const msg = {
        to:"gonibix23@gmail.com",
        from: "HelloImAnEmail@happymail.com",
        subject: `${device.name} Triggered`,
        text: `Alert from device: ${deviceId} || Date: ${formattedDate}`,
        html: 
            `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
            </head>
            <style>
                    .card {
                      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                      transition: 0.3s;
                      width: 40%;
                    }
                    
                    .card:hover {
                      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                    }
                    
                    .container {
                      padding: 2px 16px;
                    }
            </style>
            <body>
                <form align="center">
                    <h2><b>Your device has been triggered</b></h2>
                    <h2><b>Name: ${device.name}</b></h2>
                    <h2><b>ID: ${deviceId}</b></h2>  
                    <div class="card">
                        <img src="https://media.alienwarearena.com/media/comboburst-1.png" alt="Sensor" style="width:300px" style="heigth:600px">
                    </div>
                </form>
            </body>
        </html>`
    };

    sgMail.send(msg).then(function(message){
        console.log(message);
        if(message){
            res.status(200).send("Email sent");
        }
    });
    })
    
};