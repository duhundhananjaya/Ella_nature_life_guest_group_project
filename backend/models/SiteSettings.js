import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fax_number: {
    type: String,
    default: ""
  },
  google_map_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const SiteSettings = mongoose.model("SiteSettings", settingsSchema);
export default SiteSettings;