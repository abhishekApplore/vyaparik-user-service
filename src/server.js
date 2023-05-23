const { GRPCServer } = require("./grpc/grpcServer");
const logger = require("./helpers/logger");
const storeModel = require("./models/store.model");

const razorpay = require("razorpay");
const axios = require("axios");
const { default: mongoose } = require("mongoose");

try {
  const { PORT, NODE_ENV, PROJECT_NAME, ORIGIN } = require("./config/");
  const express = require("express");
  const cors = require("cors");
  const app = express();
  const Response = require("./Response");
  const morgan = require("morgan");
  const hpp = require("hpp");
  const helmet = require("helmet");
  const compression = require("compression");

  // Seeders
  const UserRoleSeeder = require("./seeders/userRoles.seeder");

  const router = require("./routes/index");

  // Main Functions

  // contains all the function to run when server starts

  onServerStart();

  // Initialize Middlewares
  initializeMiddlewares();

  // Initialize All Routes
  initializeRoutes();

  initializeErrorHandler();

  // Other Functions for Middlewares and Routes
  function initializeMiddlewares() {
    app.use(cors({ origin: ORIGIN }));
    app.use(hpp()); // for preventing paramter polution
    app.use(helmet()); // add security headers for extra safety
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // only non production middlewares
    if (NODE_ENV != "production") {
      // Log requests
      app.use(morgan("dev"));
    }
  }

  function initializeRoutes() {
    // API ROUTE should contain all APIs.
    app.use("/api", router);

    // Default Routes and Status Response Route
    app.get("/", (req, res) => {
      res.status(200).send("Server is Live. Version : 1.0");
    });

    app.get("/status", (req, res) => {
      return Response(res).status(200).body("Server is Live.").send();
    });
  }

  async function initializeSeeders() {
    console.log("-------------------SEED-LOGS------------------");
    await UserRoleSeeder();
    console.log("----------------------------------------------");
  }

  function initializeErrorHandler() {
    const errorMiddleware = (error, req, res, next) => {
      try {
        const status = error.status || 500;
        const message = error.message || "Something went wrong";
        logger.error(
          `[${req.method}] ${req.path} >> StatusCode:: ${status}, Stack Trace: ${error.stack}`
        );
        Response(res).status(status).error(message).send();
      } catch (error) {
        next(error);
      }
    };

    app.use(errorMiddleware);
  }

  app.listen(PORT, async () => {
    logger.info("Server is Listening at PORT " + PORT + ", Version: 1.0");

    // const razorpayInstance = new razorpay({
    //   key_id: "rzp_test_Ec7n7SnaoOsjka",
    //   key_secret: "SrxGAis5TlaMumON9lOaghy2",
    // });

    // try {
    //   const contact = await axios({
    //     url:
    //       "https://rzp_test_Ec7n7SnaoOsjka:SrxGAis5TlaMumON9lOaghy2@api.razorpay.com/v1/fund_accounts/fa_LsQfzSWn1oQagd",
    //     method: "GET",
    //     data: {
    //       fund_account_id: "fa_LsQfzSWn1oQagd",
    //       account_number: "765432123456789",
    //       amount: 1,
    //       currency: "INR",
    //       mode: "IMPS",
    //       purpose: "refund",
    //       queue_if_low_balance: true,
    //     },
    //   });

    //   console.log(contact);
    // } catch (eror) {
    //   console.log(eror.response);
    // }

    // const stores = await storeModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "bankacconts",
    //       localField: "bankAccount",
    //       foreignField: "_id",
    //       as: "bankAccount",
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       name: 1,
    //       mobile: 1,
    //       bankAccount: { $first: "$bankAccount" },
    //     },
    //   },
    // ]);
    // try {
    //   for await (let store of stores) {
    //     const contact = await axios({
    //       url:
    //         "https://rzp_test_Ec7n7SnaoOsjka:SrxGAis5TlaMumON9lOaghy2@api.razorpay.com/v1/contacts",
    //       method: "POST",
    //       data: {
    //         name: store.name.toLowerCase(),
    //         contact: store.mobile,
    //       },
    //     });
    //     const fund = await axios({
    //       url:
    //         "https://rzp_test_Ec7n7SnaoOsjka:SrxGAis5TlaMumON9lOaghy2@api.razorpay.com/v1/fund_accounts",
    //       method: "POST",
    //       data: {
    //         contact_id: contact.data.id,
    //         account_type: "bank_account",
    //         bank_account: {
    //           name: store.bankAccount.accountHolderName,
    //           ifsc: "HDFC0000053",
    //           account_number: "765432123456789",
    //         },
    //       },
    //     });
    //     await storeModel.findOneAndUpdate(
    //       {
    //         _id: mongoose.Types.ObjectId(store._id),
    //       },
    //       {
    //         razorpayContactId: contact?.data?.id,
    //         razorpayFundAccountId: fund.data.id,
    //       }
    //     );
    //   }
    //   console.log("DOne");
    // } catch (err) {
    //   console.log(err.response);
    // }
  });

  function onServerStart() {
    GRPCServer.start();
    // this function runs everytime server restarts
    console.log(PROJECT_NAME + " Server Started");
    initializeSeeders(); // start seeding
  }
} catch (error) {
  console.log(error);
  logger.fatal(error.message);
}
