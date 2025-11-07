import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
    image: {type: String},
    facility_name: {type: String},
    description: {type: String},
    created_at: {type: Date, default: Date.now}
})

const Facility = mongoose.model("Facility", facilitySchema);
export default Facility;