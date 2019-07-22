const mongoose = require("mongoose");
const DeviceModel = mongoose.model('Device');

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