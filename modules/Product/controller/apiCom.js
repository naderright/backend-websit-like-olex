const commentModel = require("../../../DB/models/commentModel");
const productModel = require("../../../DB/models/productModel");
const { getIo } = require("../../../servises/socket");
const product = require("../Product.router");

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment_body } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            const comment = new commentModel({ comment_body, comment_By: req.user._id, Product_id: id });
            const savedComment = await comment.save();
            if (!savedComment) {
                res.status(400).json({ message: 'fail saved comment' });
            } else {
                await productModel.findByIdAndUpdate(id,{$push:{Comments:savedComment._id}});
                getIo().emit('reply', [comment]);
                res.status(201).json({ message: "success add comment" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id, commId } = req.params;
        const { comment_body } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            const comment = await commentModel.findById(commId);
            if (!comment || comment.comment_By.toString() != req.user._id.toString()) {
                res.status(400).json({ message: 'not allow some thing wrong for your request' });
            } else {
                await commentModel.findByIdAndUpdate(commId, { comment_body }, { new: true });
                res.status(200).json({ message: 'success update comment' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id, commId } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            const comment = await commentModel.findById(commId);
            if (!comment || comment.comment_By.toString() != req.user._id.toString()
                || product.CreatedBy.toString() != req.user._id.toString()) {
                res.status(400).json({ message: 'not allow some thing wrong for your request' });
            } else {
                await commentModel.findByIdAndDelete(commId, { new: true });
                res.status(200).json({ message: 'success delete comment' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const likeComment = async (req, res) => {
    try {
        const { id, commId } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: "not found product" });
        } else {
            await commentModel.findByIdAndUpdate(commId, { $push: { likes: req.user._id } });
            res.status(200).json({ message: 'success like comment' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const unlikeComment = async (req, res) => {
    try {
        const { id, commId } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: "not found product" });
        } else {
            await commentModel.findByIdAndUpdate(commId, { $pull: { likes: req.user._id } });
            res.status(200).json({ message: 'success unlike comment' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const Replies = async (req, res) => {
    try {
        const { id, commId } = req.params;
        const { comment_body } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: 'not found product' });
        } else {
            const comment = await commentModel.findOne({ Product_id: product._id, _id: commId });
            if (!comment) {
                res.status(404).json({ message: 'in valid comment' });
            } else {
                const newComment = new commentModel({ comment_body, comment_By: req.user._id, Product_id: id });
                const saveComment = newComment.save();
                await commentModel.findByIdAndUpdate(comment._id, { $push: { Replies: (await saveComment)._id } });
                res.status(201).json({ message: 'succses replies comment' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
}

module.exports = { addComment, updateComment, deleteComment, likeComment, unlikeComment, Replies }