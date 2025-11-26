import Feature from '../models/Feature.js';
import Room from '../models/Room.js';

const addFeature =async (req, res) =>{
    try {
        const { feature_name } =req.body;

        const existingFeature = await Feature.findOne({feature_name});
        if(existingFeature){
            return res.status(400).json({success: false, message: 'Feature already exists'});
        }


        const newFeature = new Feature({
            feature_name
        });

        await newFeature.save();
        return res.status(201).json({ success: true, message: 'Feature added successfully'});
    } catch (error) {
        console.error('Error adding Feature', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

const getFeature = async (req, res) =>{
    try {
        const features = await Feature.find();
        return res.status(200).json({ success: true, features});
    } catch (error) {
        console.error('Error fetching features', error);
        return res.status(500).json({ success: true, message: 'Server error in getting features'});
    }
}

const deleteFeature = async (req, res) =>{
    try {
        const { id } = req.params;

        const existingFeature = await Feature.findById(id);
        if(!existingFeature){
            return res.status(404).json({success: false, message: 'Feature already exists'});
        }

        const isAssigned = await Room.findOne({ features: id });

        if (isAssigned) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete. This feature is assigned to one or more rooms.'
            });
        }

        await Feature.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Feature deleted successfully'});
    } catch (error) {
        console.error('Error updating feature', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

export {addFeature, getFeature, deleteFeature};