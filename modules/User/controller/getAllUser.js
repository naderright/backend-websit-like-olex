const userModel = require("../../../DB/models/userModel");
const paginate = require("../../../servises/paginate");

const allUser = async (req, res) => {
    try {
        const {page,size} = req.query;
        const {skip,limit} = paginate(page,size);
        const users = await userModel.find({IsDeleted : false}).select("userName Profile_picture").limit(limit).skip(skip).populate([
            {
                path: 'products_user', match: { IsDeleted: false }, populate: [
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
                ]
            }
        ]);
        res.status(200).json({ message: 'Done', users });
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};



module.exports = allUser;