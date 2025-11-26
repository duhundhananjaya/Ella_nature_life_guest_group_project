import Client from '../models/Client.js';

const getClients = async (req, res) =>{
    try {
        const clients = await Client.find();
        return res.status(200).json({ success: true, clients});
    } catch (error) {
        console.error('Error fetching clients', error);
        return res.status(500).json({ success: true, message: 'Server error in getting clients'});
    }
}

export { getClients};