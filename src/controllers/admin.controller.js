const User = require("../models/user.model")

const asyncHandler = require("../utils/asyncHandler")

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const AdminService = require("../services/admin.service")
const Category = require("../models/product.model")
const Payment = require("../models/payment.model")
const { paginate } = require("../utils/pagination.utils")
const Appointment = require("../models/Appointment.model")






const addAdmin = asyncHandler(async (req, res) => {
    try {
        const adminregister = await AdminService.addAdmin(req.body)
        return res.status(200).json(new ApiResponse(200, "Admin added succesffully", adminregister))

    } catch (error) {
        throw new ApiError(400, "Unable to add Admin", error.message)

    }

})


const createDoctor = asyncHandler(async (req, res) => {
    try {
        const resultDoctor = await AdminService.createDoctor(req.body)
        return res.status(200).json(new ApiResponse(200, "Doctor created succesffully and send credential"))

    } catch (error) {
        throw new ApiError(400, "Something error ", error.message)

    }

});
// const getallPatient = asyncHandler(async (req, res) => {
//     try {
//         const patients = await AdminService.getAllPatient()
//         return res.status(200).json(new ApiResponse(200, "Alll patient are ", patients))
//     } catch (error) {
//         throw new ApiError(400, "something wrong", error.message)
//     }
// })
const getallPatient = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, filterOption } = req.query;
        const data = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            filterOption: filterOption
        };

        const result = await AdminService.getAllPatient(data);

        return res.status(200).json(new ApiResponse(200, result, "Patents get successfully"))

    } catch (error) {
        throw new ApiError(400, "Something error", error.message)

    }
});
const getallDoctor = asyncHandler(async (req, res) => {
    try {
        const { page, limit, sortField, sortOrder } = req.query;

        const result = await AdminService.getAllDoctors(
            parseInt(page, 10),
            parseInt(limit, 10),
            sortField,
            sortOrder
        );
        return res.status(200).json(new ApiResponse(200, result, "doctors get successfully"))


    } catch (error) {
        throw new ApiError(400, "Something error", error.message)

    }
});

// const getallDoctor = asyncHandler(async (req, res) => {
//     try {
//         const doctors = await AdminService.getAllDoctors()
//         return res.status(200).json(new ApiResponse(200, "All doctors are ", doctors))

//     } catch (error) {
//         throw new ApiError(400, "something wrong", error.messag)

//     }


// })
// const getPendingAppointments = asyncHandler(async (req, res) => {
//     const pendingAppointments = await Appointment.find({ status: 'pending' });

//     res.status(200).json(new ApiResponse(201, pendingAppointments, "pending Appointment fetch succesfully")

//     );
// });


// const assignDoctorToAppointment = asyncHandler(async (req, res) => {
//     req.body.doctorId = req.doctorId
//     const { appointmentId } = req.body;
//     // const { userId } = req.body;

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//         throw new ApiError(400, error?.message, "Appointment not found");
//     }


//     const user = await User.findById(appointment.user);
//     if (!user) {
//         throw new ApiError(400, "User not found", "User associated with the appointment not found");
//     }

//     // Update appointment with assigned doctor
//     appointment.doctor = req.doctorId;
//     await appointment.save();

//     // Return user details along with success response
//     return res.status(200).json(new ApiResponse({
//         status: 200, user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,

//         },

//         message: "Appointment assigned successfully"

//     }));



// });

const deleteUser = asyncHandler(async (req, res) => {
    try {
        await AdminService.deleteuser(req)
        res.status(200).json(new ApiResponse(200, "User deleted successfully"))

    } catch (error) {
        throw new ApiError(400, "something error while deleting this user", error.message)
    }
})

// const getFilteredUsers = asyncHandler(async (req, res) => {
//     let { page = 1, limit = 10, searchQuery, serialNumber } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     // Build query conditions based on search and filter criteria
//     const query = {};
//     if (searchQuery) {
//         query.name = { $regex: `^${searchQuery}`, $options: 'i' }; // Case-insensitive regex search by name
//     } else if (serialNumber) {
//         query.serialNumber = serialNumber;
//     }


//     const totalUsers = await User.countDocuments(query);

//     // Paginate the results
//     const users = await User.find(query)
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .sort({ name: 1 }); // Sort by name alphabetically

//     const totalPages = Math.ceil(totalUsers / limit);

//     res.status(200).json(new ApiResponse({
//         success: true,
//         message: "Users fetched successfully",
//         data: {
//             users,
//             page,
//             totalPages,
//             totalUsers
//         }
//     }))

// });
const getTotalpatient = asyncHandler(async (req, res) => {
    try {
        const patientCount = await User.countDocuments({ role: 'patient' });
        return res.status(200).json(new ApiResponse(200, `Total count of patient:${patientCount}`))

    } catch (error) {
        throw new ApiError(400, "something went wrong", error.message)

    }

})




const addProductToCategory = asyncHandler(async (req, res) => {
    const { categoryName, productName, productPrice, description } = req.body;

    try {

        let category = await Category.findOne({ name: categoryName });

        if (!category) {
            category = new Category({ name: categoryName, products: [] });
        }


        category.products.push({ name: productName, price: productPrice, description: description });


        await category.save();

        res.status(201).json({ message: 'Product added successfully.' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).json({ message: 'Something went wrong' });
    }
});
const deleteProductFromCategory = asyncHandler(async (req, res) => {
    const { categoryName, productName } = req.body;

    try {

        let category = await Category.findOne({ name: categoryName });

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }


        const productIndex = category.products.findIndex(product => product.name === productName);

        if (productIndex === -1) {
            throw new ApiError(404, 'Product not found in the category');
        }


        category.products.splice(productIndex, 1);


        await category.save();

        res.status(200).json(new ApiResponse(200, 'Product deleted successfully.'));
    } catch (error) {
        throw new ApiError(400, "Something wrong", error.message)

    }
});
const updateProductDetails = asyncHandler(async (req, res) => {
    const { categoryName, productName, newPrice, newDescription } = req.body;

    try {

        let category = await Category.findOne({ name: categoryName });

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }


        const product = category.products.find(product => product.name === productName);

        if (!product) {
            throw new ApiError(404, 'Product not found in the category');
        }


        if (newPrice !== undefined) {
            product.price = newPrice;
        }
        if (newDescription !== undefined) {
            product.description = newDescription;
        }


        await category.save();

        res.status(200).json(new ApiResponse(200, 'Product details updated successfully.'));
    } catch (error) {
        console.error('Error updating product details:', error);
        throw new ApiError(400, "Something went wrong", error.message)
    }
});


const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.body;

    try {

        const categories = await Category.find({ name: { $in: categoryName } }).populate('products');


        const productsByCategory = categories.map(category => {
            return {
                category: category.name,
                products: category.products
            };
        });

        res.status(200).json({ productsByCategory });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(400).json({ message: 'Something went wrong' });
    }
});
const updateAdminProfile = asyncHandler(async (req, res) => {
    try {
        await AdminService.updateAdmin(req);

        return res.status(200).json(new ApiResponse(200, "Profile updated successfully"));
    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message);
    }
})
const searchUsers = asyncHandler(async (req, res, next) => {
    try {
        const { searchQuery, page = 1, limit = 10 } = req.query;

        const result = await AdminService.searchUsers(
            searchQuery,
            parseInt(page, 10),
            parseInt(limit, 10)
        );

        return res.status(200).json(new ApiResponse(200, result, "result get successfully"));

    } catch (error) {
        next(error); // move next(error) to the catch block
        throw new ApiError(400, "something wrong", error.message)
    }
});
const searchdoctor = asyncHandler(async (req, res, next) => {
    try {
        const { searchQuery, page = 1, limit = 10 } = req.query;

        const result = await AdminService.searchDoctor(
            searchQuery,
            parseInt(page, 10),
            parseInt(limit, 10)
        );

        return res.status(200).json(new ApiResponse(200, result, "result get successfully"));

    } catch (error) {
        next(error);
        throw new ApiError(400, "something wrong", error.message)
    }
});
const blockUnblock = asyncHandler(async (req, res) => {
    try {
        const data = req.query;

        await AdminService.blockAndunblock(data)
        return res.status(200).json(new ApiResponse(200, "status changed succesffully"))

    } catch (error) {
        throw new ApiError(400, "Something wrong", error.message)

    }

})






const transactionData = asyncHandler(async (req, res) => {
    try {
        const { sortOption, page = 1, limit = 10 } = req.query;
        let sortCriteria = {};

        if (sortOption === 'ascending') {
            sortCriteria = { 'createdAt': 1 };
        } else if (sortOption === 'descending') {
            sortCriteria = { 'createdAt': -1 };
        }




        const paymentsQuery = Payment.find()
            .populate('userId', 'fullname')
            .select('fullname createdAt paymentStatus paymentMethod orderId')
            .collation({ locale: 'en', strength: 2 });

        if (sortOption) {
            paymentsQuery.sort(sortCriteria);
        }


        const payments = await paymentsQuery
            .skip((page - 1) * limit)
            .limit(limit);
        console.log("Fetched Payments:", payments);

        const formattedPayments = formatTransactionData(payments);
        const totalCount = await Payment.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const response = {
            data: formattedPayments,
            pagination: {
                totalRecords: totalCount,
                totalPages,
                currentPage: page,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            },
        };

        res.status(200).json(new ApiResponse(200, response, "Transaction data fetched successfully"));

    } catch (error) {
        console.error("Error fetching transaction data:", error);
        throw new ApiError(400, "Failed to fetch transaction data", error.message);
    }
});

const formatTransactionData = (payments) => {
    return payments.map(payment => ({
        paymentMethod: payment.paymentMethod,
        fullname: payment.userId ? payment.userId.fullname : 'N/A',
        paymentStatus: payment.paymentStatus,
        orderId: payment.orderId,
        paymentId: payment._id,
        createdAt: new Date(payment.createdAt).toISOString()
    }));
};







const softDeleteTransaction = asyncHandler(async (req, res) => {
    try {
        const { paymentId } = req.params;
        console.log("Received paymentId:", paymentId);
        // const paymentId = req.params.paymentId;
        // console.log(">..........", paymentId)



        const payment = await Payment.findById({ _id: "660ff8f2cf66422144b3e87a" });
        // console.log("..................", payment)

        if (!payment) {
            throw new ApiError(404, "Payment not found");
        }


        payment.status = false;
        await payment.save();

        res.status(200).json(new ApiResponse(200, {}, " Transaction  deleted successfully"));

    } catch (error) {
        console.error("Error soft deleting payment:", error);
        throw new ApiError(400, "Failed to soft delete payment", error.message);
    }
});










//     try {
//         const { sortOption, page = 1, limit = 10 } = req.query;

//         let sortCriteria = {};

//         if (sortOption === 'alphabetically') {
//             sortCriteria = { 'fullname': 1 };
//         } else if (sortOption === 'date') {
//             sortCriteria = { 'createdAt': -1 };
//         }

//         const payments = await Payment.aggregate([
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$user',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $addFields: {
//                     fullname: '$user.fullname'
//                 }
//             },
//             {
//                 $sort: sortCriteria
//             },
//             {
//                 $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
//             },
//             {
//                 $limit: parseInt(limit, 10)
//             },
//             {
//                 $project: {
//                     'user': 0
//                 }
//             }
//         ]);

//         const formattedPayments = formatTransactionData(payments);
//         const totalCount = await Payment.countDocuments();

//         const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

//         const response = {
//             data: formattedPayments,
//             pagination: {
//                 totalRecords: totalCount,
//                 totalPages,
//                 currentPage: parseInt(page, 10),
//                 nextPage: parseInt(page, 10) < totalPages ? parseInt(page, 10) + 1 : null,
//                 prevPage: parseInt(page, 10) > 1 ? parseInt(page, 10) - 1 : null,
//             },
//         };

//         res.status(200).json(new ApiResponse(200, response, "Transaction data fetched successfully"));

//     } catch (error) {
//         console.error("Error fetching transaction data:", error);
//         throw new ApiError(400, "Failed to fetch transaction data", error.message);
//     }
// });







// const transactionData = asyncHandler(async (req, res) => {
//     try {
//         // Extract query parameters
//         const { sortOption, page = 1, limit = 10 } = req.query;

//         // Define sort options
//         let sortCriteria = {};
//         if (sortOption === 'alphabetically') {
//             sortCriteria = { 'fullname': 1 }; // Sort by fullname in ascending order
//         } else if (sortOption === 'date') {
//             sortCriteria = { 'createdAt': -1 }; // Sort by createdAt in descending order
//         }

//         // Define query for pagination
//         const query = {};

//         // Fetch transactions with pagination and sorting
//         const { data, totalPages, currentPage, totalItems, itemsPerPage } = await paginate(
//             Payment,
//             query,
//             parseInt(page, 10),
//             parseInt(limit, 10),
//             sortCriteria
//         );

//         // Format transactions
//         const formattedPayments = formatTransactionData(data);

//         // Prepare response
//         const response = {
//             data: formattedPayments,
//             pagination: {
//                 totalRecords: totalItems,
//                 totalPages,
//                 currentPage,
//                 nextPage: currentPage < totalPages ? currentPage + 1 : null,
//                 prevPage: currentPage > 1 ? currentPage - 1 : null,
//             },
//         };

//         // Send response
//         res.status(200).json(new ApiResponse(200, response, "Transaction data fetched successfully"));

//     } catch (error) {
//         console.error("Error fetching transaction data:", error);
//         throw new ApiError(400, "Failed to fetch transaction data", error.message);
//     }
// });


const getBookedAppointment = asyncHandler(async (req, res) => {
    try {
        const data = await Appointment.find({ status: { $in: ['booked', 'assigned', 'completed'] } })
            .populate('userId', 'fullname')
            .select('fullname _id appointmentDate timeSlot status orderId paymentStatus, amount');
        return res.status(200).json(new ApiResponse(200, data, "Booked Appointment get succesffully"))

    } catch (error) {
        throw new ApiError(400, "Unable to get Appointment", error.message)

    }


})

const assignDoctorToAppointment = asyncHandler(async (req, res) => {
    try {
        const { appointmentId, doctorId } = req.body;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { doctorId: doctorId, status: 'assigned' },
            { new: true }
        );

        if (!updatedAppointment) {
            throw new ApiError(404, 'Appointment not found');
        }

        return res.status(200).json(new ApiResponse(200, updatedAppointment, 'Appointment assigned successfully'));
    } catch (error) {
        throw new ApiError(400, 'Failed to assign appointment', error.message);
    }
});






module.exports = {
    createDoctor,
    getallPatient,
    getallDoctor,
    deleteUser, getTotalpatient,
    addProductToCategory,
    getProductsByCategory,
    addAdmin,
    updateAdminProfile,
    searchUsers,
    searchdoctor,
    blockUnblock,
    deleteProductFromCategory,
    updateProductDetails,
    transactionData,
    softDeleteTransaction,
    getBookedAppointment,
    assignDoctorToAppointment
};
