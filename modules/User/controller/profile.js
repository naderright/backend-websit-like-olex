const userModel = require("../../../DB/models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const productModel = require("../../../DB/models/productModel");

const updateEmail = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'in valid account' });
        } else {
            if (user.Email == req.body.Email) {
                res.status(400).json({ message: 'this is same email' });
            } else {
                await userModel.findByIdAndUpdate(user._id, { Email: req.body.Email }, { new: true });
                const token = jwt.sign({ id: user._id }, process.env.tokenEmail, { expiresIn: 5 * 60 });
                const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`;
                const message = `<a href =${URL}>please click here to confirm Email </a>`;
                sendEmail(saveUser.Email, message);
                res.status(200).json({ message: 'success update email' });
            }

        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error })
    }

};

const updatePass = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (oldPassword == newPassword) {
            res.status(400).json({ message: 'oldPassword and newPassword the same not accept' });
        } else {
            const user = await userModel.findById(req.user._id);
            if (!await bcrypt.compare(oldPassword, user.Password)) {
                res.status(400).json({ message: 'in valid password' });
            } else {
                const hashPass = await bcrypt.hash(newPassword, parseInt(process.env.saltRound));
                await userModel.findByIdAndUpdate(user._id, { Password: hashPass }, { new: true });
                res.status(200).json({ message: 'success update Password' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }

};

const deleteProf = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'in valid account ' });
        } else {
            await userModel.findByIdAndDelete(req.user._id, { new: true });
            res.status(200).json({
                message: 'success delete profile'
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};


const profilePic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: 'in valid format' });
        } else {
            const imgURL = `${req.finalDestination}/${req.filename}`;
            await userModel.findByIdAndUpdate(req.user._id, { Profile_picture: imgURL }, { new: true });
            res.status(200).json({ message: 'success update profile picture' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};


const coverPic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: 'in valid format' });
        } else {
            const imageUrl = [];
            req.files.map(file => {
                imageUrl.push(`${req.finalDestination}/${req.filename}`);
            })
            await userModel.findByIdAndUpdate(req.user._id, { Cover_pictures: imageUrl }, { new: true });
            res.status(200).json({ message: 'success update cover pictures' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('userName Email Profile_picture').populate([
            { path: 'WishList', select: ' product_title Product_desc Product_price' }
        ]);

        res.status(200).json({ message: 'done', user });
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const getSinglPRoduct = async (req, res) => {
    try {
        const { idPro } = req.params;

        if (!req.user.WishList.includes(idPro)) {
            res.status(403).json({ message: 'not allow wishlist not contain product' });
        } else {
            const product = await productModel.findById(idPro)
                .select('product_title Product_desc Product_price').populate([
                    {
                        path: 'Comments', select: 'comment_body', populate: [
                            { path: 'comment_By', select: 'userName Profile_picture' },
                            { path: 'likes', select: "userName Profile_picture" },
                            {
                                path: 'Replies', select: 'comment_body', populate: [
                                    { path: 'comment_By', select: 'userName Profile_picture' },
                                    { path: 'likes', select: "userName Profile_picture" },
                                    {
                                        path: 'Replies', select: 'comment_body', populate: [
                                            { path: 'comment_By', select: 'userName Profile_picture' },
                                            { path: 'likes', select: "userName Profile_picture" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]);
            res.status(200).json({ message: 'done', product })
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }

};

const wishlistRmove = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product || !product.Wishlists.includes(req.user._id)) {
            res.status(400).json({ message: 'product not available' });
        } else {
            await userModel.findByIdAndUpdate(req.user._id, { $pull: { WishList: product._id } });
            await productModel.findByIdAndUpdate(product._id, { $pull: { Wishlists: req.user._id } });
            res.status(200).json({ message: 'success remove product from your wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

module.exports = {
    deleteProf, profilePic, coverPic, updateEmail,
    updatePass, wishlistRmove, getWishlist, getSinglPRoduct
};