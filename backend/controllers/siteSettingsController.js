import SiteSettings from '../models/SiteSettings.js';

const updateSiteSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, phone_number, email, fax_number, google_map_url } = req.body;

        const siteSettings = await SiteSettings.findById(id);

        siteSettings.address = address;
        siteSettings.phone_number = phone_number;
        siteSettings.email = email;
        siteSettings.fax_number = fax_number;
        siteSettings.google_map_url = google_map_url;

        await siteSettings.save();
        return res.status(200).json({ success: true, message: 'Site settings updated successfully' });
    } catch (error) {
        console.error('Error updating site settings', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

const getSiteSettings = async (req, res) => {
    try {
        const siteSettings = await SiteSettings.findOne();
        return res.status(200).json({ success: true, settings: siteSettings });
    } catch (error) {
        console.error('Error fetching site settings', error);
        return res.status(500).json({ success: false, message: 'Server error in getting site settings'});
    }
}

export {getSiteSettings, updateSiteSettings};