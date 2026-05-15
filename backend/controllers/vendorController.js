const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotEnv=require('dotenv');

dotEnv.config();

const secretKey = process.env.JWT_SECRET;

const vendorRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check existing email
        const existingVendor = await Vendor.findOne({ email });

        if (existingVendor) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save vendor
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();

        // ✅ SUCCESS RESPONSE
        return res.status(201).json({
            message: "Vendor registered successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message   // ❗ NO quotes
        });
    }
};

const vendorLogin = async(req, res)=>{
        const {email, password} =req.body;
        try{
        const vendor = await Vendor.findOne({email});
    if(!vendor || !(await bcrypt.compare(password, vendor.password))){
        return res.status(401).json({error:"Invalid username or password"})
    }
  const token = jwt.sign(
   { vendorId: vendor._id },
   process.env.JWT_SECRET
)


    res.status(200).json({success: "Login successful",token })
   console.log(email,"this is token ",token);
 } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: "Internal server error"
    });
}
};

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    } catch (error) {
console.log(error);
res.status(500).json({error:"Internal server error"});
    }
}

const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;

    try{
const vendor=await Vendor.findById(vendorId).populate('firm');
if(!vendor){
    return res.status(404).json({error: "Vendor not found"})
}
res.status(200).json({vendor})
    }catch (error) {

    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById};