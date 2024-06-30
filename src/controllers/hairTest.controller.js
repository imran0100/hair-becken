const HairTest = require('../models/hairTest.model.js');
const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');
const constant = require('../constant.js')
const { uploadImageToCloudinary } = require("../utils/upload.utils.js");
// Controller to create a new hair test entry for the logged-in user
// const createHairTestForUser = asyncHandler(async (req, res) => {
//     try {
//         //Fetching user token User_id
//         const { user } = req
//         const loginUser = await User.findById(user._id);

//         if (!loginUser) {
//             throw new ApiError(404, "User not found");
//         }

//         const { personal, nutritional, lifestyle, stress, hairAndScalpAssessment } = req.body;
//         const filter = { userId: user._id };
//         const update = {
//             // userId: user._id,

//         };
//         if (personal !== undefined) update['personal'] = personal;
//         if (nutritional !== undefined) update['nutritional'] = nutritional;
//         if (lifestyle !== undefined) update['lifestyle'] = lifestyle;
//         if (stress !== undefined) update['stress'] = stress;
//         if (hairAndScalpAssessment !== undefined) update['hairAndScalpAssessment'] = hairAndScalpAssessment;

//         const options = {
//             upsert: true
//         };

//         const createHairAssessment = await HairTest.updateOne(filter, update, options);

//         return res.status(201).json(new ApiResponse(201, createHairAssessment, "Success"));
//     } catch (error) {
//         console.log("error======", error);
//         throw new ApiError(500, "Internal server error");
//     }
// });
// const createHairTestForUser = asyncHandler(async (req, res) => {
//     try {
//         // Create a new hair test document with the data from the request body
//         const newHairTest = await HairTest.create(req.body);

//         // Log the request body and the created document for debugging
//         console.log("Request body:", req.body);
//         console.log("New hair test document:", newHairTest);

//         // Return a success response with the created document
//         return res.status(201).json({
//             success: true,
//             data: newHairTest,
//             message: "Successfully created"
//         });
//     } catch (error) {
//         // Handle errors
//         console.error("Error creating hair test:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create hair test"
//         });
//     }
// });
const createHairTestForUser = asyncHandler(async (req, res) => {
    try {

        const newHairTest = await HairTest.create(req.body);


        return res.status(201).json({
            success: true,
            data: newHairTest,
            message: "Successfully created"
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create hair test" });
    }
});



// Controller to update hair test steps
const updateHairTestStep = asyncHandler(async (req, res) => {
    const { step } = req.params;
    const stepNumber = parseInt(step);

    try {
        const hairTestId = req.params.id;
        const updateData = req.body;
        if (!updateData) {
            throw new ApiError(400, 'Update data is required');
        }

        // Find the hair test by ID
        const hairTest = await HairTest.findById(hairTestId);
        if (!hairTest) {
            throw new ApiError(400, "Hair test not found");
        }

        // Update the corresponding step data
        switch (stepNumber) {
            case 1:
                hairTest.personalProfile = updateData.personalProfile;
                break;
            case 2:
                hairTest.nutritional = updateData.nutritional;
                break;
            case 3:
                hairTest.lifeStyle = updateData.lifeStyle;
                break;
            case 4:
                hairTest.stressManagement = updateData.stressManagement;
                break;
            case 5:
                hairTest.hairAndScalpAssessment = updateData.hairAndScalpAssessment;
                break;
            default:
                throw new ApiError(400, 'Invalid step number');
        }

        // Increment step number
        hairTest[Object.keys(hairTest)[stepNumber - 1]].step = stepNumber;

        await hairTest.save();

        return res.status(200).json(new ApiResponse(200, hairTest, "Success"));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal server error");
    }
});
const getHairTestDetail = asyncHandler(async (req, res) => {

    try {
        const { user } = req
        const userIdString = user._id.toString();


        const hairTest = await HairTest.findOne({ userId: userIdString })
        // const hairTest = await HairTest.find()

        if (!hairTest) {
            return res.status(404).json({ message: 'Hair test details not found for the user' });
        }

        res.status(200).json({ hairTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})



const uploadImage = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        const imageUrl = await uploadImageToCloudinary(req.file);
        res.status(200).json({ imageUrl });
        console.log("......image url", imageUrl)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports = { createHairTestForUser, updateHairTestStep, uploadImage, getHairTestDetail };
