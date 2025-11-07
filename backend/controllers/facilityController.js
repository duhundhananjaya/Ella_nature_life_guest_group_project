import Facility from '../models/Facility.js';
import multer from 'multer';
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/uploads/icons")
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const addFacility = async (req, res) =>{
    try {
        const { facility_name,description } =req.body;

        const existingFacility = await Facility.findOne({facility_name});
        if(existingFacility){
            return res.status(400).json({success: false, message: 'Facility already exists'});
        }

        const newFacility = new Facility({
            image: req.file ? req.file.filename: "",
            facility_name,
            description
        });

        await newFacility.save();
        return res.status(201).json({ success: true, message: 'Facility added successfully'});
    } catch (error) {
        console.error('Error adding Facility', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { facility_name,description } = req.body;

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    if (req.file) {
      if (facility.image) {
        const oldImagePath = path.join('public', 'uploads', 'icons', facility.image);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
            });
          }
        });
      }
      facility.image = req.file.filename;
    }

    await facility.save();

    facility.facility_name = facility_name;
    facility.description = description;

    await facility.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Facility updated successfully' 
    });

  } catch (error) {
    console.error('Error updating facility:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error in updating facility' 
    });
  }
};

const getFacility = async (req, res) =>{
    try {
        const facilities = await Facility.find();
        return res.status(200).json({ success: true, facilities});
    } catch (error) {
        console.error('Error fetching facilities', error);
        return res.status(500).json({ success: true, message: 'Server error in getting facilities'});
    }
}

const deleteFacility = async (req, res) =>{
    try {
        const { id } = req.params;

        const existingFacility = await Facility.findById(id);
        if(!existingFacility){
            return res.status(404).json({success: false, message: 'Facility not found'});
        }

        await Facility.findByIdAndDelete(id); 
        return res.status(200).json({ success: true, message: 'Facility deleted successfully'});
    } catch (error) {
        console.error('Error deleting facility', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

export {addFacility, upload, getFacility, updateFacility, deleteFacility};