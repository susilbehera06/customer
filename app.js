import express, { Router } from "express";
import { Customer } from "./customer.model.js";

const app = express();
const router = Router();

//Controller
const createCustomer = async (req, res) => {
    try{
        const { first_name, last_name, city, company } = req.body;

        //validation
        if(!first_name || !last_name || !city || !company){
            return res.status(500)
                      .json({
                            success: false,
                            message: "Please provide required fields"
                      })
        }

        //check existing customer
        const existingCity = await Customer.findOne({ city });
        const existingCompany = await Customer.findOne({ company });

        //validation
        if(!existingCity || !existingCompany){
            return res.status(400)
                      .json({
                        success: false,
                        message: "City and company must already exist"
                      })
        }

        const customer = await Customer.create({
            first_name, 
            last_name, 
            city, 
            company
        })

        return res.status(201)
                  .json({
                    success: true,
                    message: "Customer created successfully",
                    data: customer
                  })
    }catch(error){
        console.log(error)
        return res
               .status(500)
               .json({
                    success: false,
                    message: "Something went wrong",
                    error
               })
    }
}

const getCities = async (req, res) => {
    try {
        const cities = await Customer.aggregate([
            {
                $group: {
                    _id: "$city",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } // Optional: Sort cities alphabetically
            }
        ]);

        return res.status(201)
                  .json({
                    success: true,
                    message: "Cities information",
                    data: cities
                  })
    } catch (error) {
        console.log(error)
        return res
               .status(500)
               .json({
                    success: false,
                    message: "Something went wrong",
                    error
               })
    }
}

const costumerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(400)
                      .json({
                        success: false,
                        message: "Customer not found"
                      })
        }

        return res.status(201)
                  .json({
                    success: true,
                    message: "Single customer information",
                    data: customer
                  })
    } catch(error) {
        console.log(error)
        return res
               .status(500)
               .json({
                    success: false,
                    message: "Something went wrong",
                    error
               })
    }
}

const searchCustomer = async (req, res) => {
    try{
        const { first_name, last_name, city, page = 1, limit = 10 } = req.query;

        const query = {};
        if (first_name) query.first_name = { $regex: first_name, $options: 'i' };
        if (last_name) query.last_name = { $regex: last_name, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const customers = await Customer.find(query)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        const totalCount = await Customer.countDocuments(query);

        return res.status(201)
                  .json({
                    success: true,
                    message: "Searched customer information",
                    data: customers,
                    totalCount,
                    page: pageNumber,
                    limit: pageSize,
                    totalPages: Math.ceil(totalCount / pageSize)
                  })
    }catch (error) {
        console.log(error)
        return res
               .status(500)
               .json({
                    success: false,
                    message: "Something went wrong",
                    error
               })
    }
}

//Route
router.route("/create-customer").post(createCustomer)
router.route("/cities/unique").get(getCities)
router.route("/customer/:id").get(costumerById)
router.route("/search").get(searchCustomer)


//middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use("/api/v1", router)

export default app;