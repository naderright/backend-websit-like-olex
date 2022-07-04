const userModel = require("../../../DB/models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require("../../../servises/sendEmail");

const signup = async (req, res) => {
    try {
        const { userName, Email, Password } = req.body;
        const user = new userModel({ userName, Email, Password });
        const saveUser = await user.save();
        const token = jwt.sign({ id: saveUser._id }, process.env.tokenEmail, { expiresIn: 5 * 60 });
        const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`;
        const message = `<a href =${URL}>please click here to confirm Email </a>`;
        sendEmail(saveUser.Email, message);
        res.status(201).json({ message: 'success signup' });
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.tokenEmail);
        if (!decoded) {
            res.status(400).json({ message: 'in-valid decoded token' });
        } else {
            const user = await userModel.findById(decoded.id);
            if (!user) {
                res.status(400).json({ message: 'in valid account user' });
            } else {
                await userModel.findByIdAndUpdate(user._id, { Confirmed: true });
                res.status(200).json({ message: 'confirmed success please login' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const signin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await userModel.findOne({ Email });
        if (!user || user.Blocked || user.IsDeleted) {
            res.status(403).json({ message: 'in valid user' })
        } else {
            if (!user.Confirmed) {
                res.status(400).json({ message: 'check your message to confirm  ' });
            } else {
                const match = await bcrypt.compare(Password, user.Password);
                if (!match) {
                    res.status(404).json({ message: 'in valid account details' });
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.jwt_secret);
                    res.status(200).json({ message: 'success login', token });
                };
            };
        };
    } catch (error) {
        res.status(500).json({ message: 'catch err', error })
    }
};

const sendCode = async (req, res) => {
    try {
        const { Email } = req.body;
        const user = await userModel.findOne({ Email });
        if (!user) {
            res.status(404).json({ message: 'in valid user account' });
        } else {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
            const message = `<p>use this code to update password ${code} <p/>`;
            await userModel.findByIdAndUpdate(user._id, { code: code });
            sendEmail(user.Email, message);
            res.status(200).json({ message: 'success send code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch err', error });
    }
};

const forgotPass = async(req,res)=>{
    try {
        const {Email,code,newPassword} = req.body;
        const user = await userModel.findOne({Email});
        if (!user) {
           res.status(403).json({message:'in valid account'});
        } else {
           if (user.code.toString() != code.toString()) {
               res.status(409).json({message:'code is not correct'});
           } else {
               const hashPass = await bcrypt.hash(newPassword,parseInt(process.env.saltRound));
               await userModel.findByIdAndUpdate(user._id,{Password:hashPass,code:''},{new:true});
               res.status(200).json({message:'success save New Password'});
           }
        }
    } catch (error) {
        res.status(500).json({message:"catch err",error});
    }
};

module.exports = { signup, confirmEmail, signin, sendCode,forgotPass }