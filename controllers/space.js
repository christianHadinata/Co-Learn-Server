import * as spaceService from "../services/space.js";

export const getAllSpaces = async (req, res) => {

    try {
        const result = await spaceService.getAllSpaces();

        if (!result) {
            return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


export const getSingleSpace = async (req, res) => {

    try {
        //request parameter id space yang terpilih
        const { learning_space_id } = req.params;

        // panggil service
        const result = await spaceService.getSingleSpace(learning_space_id);
        if (!result) {
            return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};