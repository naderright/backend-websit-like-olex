const userModel = require("../../../DB/models/userModel");

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            res.status(404).json({ message: 'not foud user' });
        } else {
            await userModel.findByIdAndDelete(user._id, { new: true });
            res.status(200).json({ message: 'success delete user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            res.status(404).json({ message: 'in valid acount user' });
        } else {
            await userModel.findByIdAndUpdate(user._id, { IsDeleted: true });
            res.status(200).json({ message: 'success soft delete user by admin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const BlockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            res.status(404).json({ message: 'in valid acount user' });
        } else {
            await userModel.findByIdAndUpdate(user._id, { Blocked: true });
            res.status(200).json({ message: 'success blocked user by admin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};


module.exports = { deleteUser, softDelete,BlockUser };