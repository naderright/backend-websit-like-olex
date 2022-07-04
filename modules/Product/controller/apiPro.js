const productModel = require("../../../DB/models/productModel");
const QRCode = require('qrcode');
const { getIo } = require("../../../servises/socket");
const userModel = require("../../../DB/models/userModel");

const addPro = async (req, res) => {
    try {
        const { product_title, Product_desc, Product_price } = req.body;

        QRCode.toDataURL(`productName:${product_title},productDescription : ${Product_desc}
    productPrice : ${Product_price}`, async function (err, url) {
            if (err) {
                res.status(400).json(err);
            } else {
                const product = new productModel({
                    product_title, Product_desc, Product_price,
                    CreatedBy: req.user._id, qr_code: url
                });
                const savePro = await product.save();
                if (!savePro) {
                    res.status(400).json({ message: 'not success save product' });
                } else {
                    await userModel.findByIdAndUpdate(req.user._id, { $push: { products_user: savePro._id } })
                    getIo().emit('reply', [product])
                    res.status(201).json({ message: 'success add product' });
                }
            }

        });
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }

};

const updatePro = async (req, res) => {
    try {
        const { Product_price } = req.body;
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            if (product.CreatedBy.toString() != req.user._id.toString()) {
                res.status(403).json({ message: 'not allow update product' });
            } else {
                QRCode.toDataURL(`productName:${product.product_title},productDescription : ${product.Product_desc}
                productPrice : ${Product_price}`, async function (err, url) {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        const qr_code = url;
                        await productModel.findByIdAndUpdate(product._id, { Product_price, qr_code }, { new: true });
                        res.status(200).json({ message: 'success update product price' });
                    }
                })

            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error })
    }
};

const deletePro = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            if (product.CreatedBy.toString() != req.user._id.toString() || req.user.role != "admin") {
                res.status(403).json({ message: 'not allow delete product' });
            } else {
                await productModel.findByIdAndDelete(product._id);
                res.status(200).json({ message: 'success delete product' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            if (product.CreatedBy.toString() != req.user._id.toString() || req.user.role != "admin") {
                res.status(403).json({ message: 'not allow delete product' });
            } else {
                await productModel.findByIdAndUpdate(product._id, { IsDeleted: true });
                res.status(200).json({ message: 'success soft delete product' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const hidePro = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            if (product.CreatedBy.toString() != req.user._id.toString()) {
                res.status(403).json({ message: 'not allow delete product' });
            } else {
                await productModel.findByIdAndUpdate(product._id, { Hidden: true });
                res.status(200).json({ message: 'success hidden product' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }

};

const likePro = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndUpdate(id, { $push: { Likes: req.user._id } });
        if (!product) {
            res.json(400).json({ message: 'not success operation' });
        } else {
            res.status(200).json({ message: 'success add like to product' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const unLikePro = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndUpdate(id, { $pull: { Likes: req.user._id } });
        if (!product) {
            res.json(400).json({ message: 'not success operation' });
        } else {
            res.status(200).json({ message: 'success remove like from product' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const addWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product || product.IsDeleted || product.Hidden) {
            res.status(400).json({ message: ' product not available' });
        } else {
            const user = await userModel.findById(req.user._id);
            if (product.Wishlists.includes(req.user._id) || user.WishList.includes(product._id)) {
                res.status(400).json({ message: 'product aready added to wishlist' });
            } else {
                await productModel.findByIdAndUpdate(product._id, { $push: { Wishlists: req.user._id } });
                await userModel.findByIdAndUpdate(req.user._id, { $push: { WishList: product._id } });
                res.status(200).json({ message: 'success add product to wishelist' });
            }

        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products =  await productModel.find({ IsDeleted: false })
            .select('product_title Product_desc Product_price');
        res.status(200).json({ message: 'done', products });
    } catch (error) {
        res.status(500).json({ message: 'catch err ', error });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const {idPro} = req.params;
        const product = await productModel.findById(idPro)
        .select('product_title Product_desc Product_price')
            .populate([
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
        res.status(200).json({ message: 'done', product });
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

module.exports = {
    addPro, updatePro, deletePro, softDelete,
    likePro, unLikePro, hidePro, addWishlist,
    getAllProduct, getSingleProduct
};