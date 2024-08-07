const dotenv = require("dotenv").config();
const https = require("https"); // new
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const { getCountryCode } = require("./countryCodes.js");
const { createPurchaseEvent } = require("./controllers/purchaseControllers.js");
const { createLeadEvent } = require("./controllers/leadControllers.js");
const { registerUser } = require("./controllers/userControllers.js");
const leadRoutes = require("./routes/lead.js");
const purchaseRoutes = require("./routes/purchase.js");
const userRoutes = require("./routes/user.js");

const User = require("./models/User.js");
const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "http://127.0.0.1:5173",
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://127.0.0.1:3000",
//       "http://localhost:5000",
//       "http://127.0.0.1:5000",
//       "exp://192.168.1.49:8081",
//       "192.168.1.49:8081",
//       process.env.FRONTEND_URL,
//       process.env.BACKEND_URL,
//       "*",
//     ],
//     credentials: true,
//   })
// );

//references
//puppeteer and onrender config with docker: https://www.youtube.com/watch?v=6cm6G78ZDmM&t=320s
// Error Middleware
app.use(errorHandler);

// Middleware to extract the IP address
app.use((req, res, next) => {
  const clientIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  req.clientIp = clientIp;

  next();
});

// -momery unleaked---------
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const backend = process.env.BACKEND_URL;
const defaultRequestURL = process.env.DEFAULT_REQUEST_URL;

// Connect to DB and start server

// Helper function to hash data
//Step1: initial path

//=================={Routes}===============================================
app.use("/lead", leadRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/user", userRoutes);

function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

//==============================={Main calls}================================================
// add advertiser_tracking_id to installed API call in unity app

//second call after registration
//http://localhost:4000/?advertiser_tracking_id=91C52919-58B8-451E-9B20-CBDE97795AD2&appsflyer_id=1722955262650-0365541
app.get("/", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub_id_1, advertiser_tracking_id, appsflyer_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{state variables}====================================
  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });
  const newUserPath = sub_id_1 ? requestURL : defaultRequestURL;
  const newUserURL = backend + newUserPath;
  //backend

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      // userLink: sub_id_1 ? requestURL : defaultRequestURL,
      userLink: newUserURL,
    });

    if (newUser) {
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  // if (
  //   advertiser_tracking_id &&
  //   userTrackingIdExists &&
  //   advertiser_tracking_id != userExists?.advertiserTrackingId
  // ) {
  //   console.log("new user");

  //   const newUser = await User.create({
  //     ipAddress: ip,
  //     userLink: defaultRequestURL,
  //     advertiserTrackingId: advertiser_tracking_id,
  //   });

  //   if (newUser) {
  //     console.log({
  //       "New user created with same ip but new advertiserId": newUser,
  //     });
  //     const appStoreLink = process.env.APP_STORE_LINK;
  //     console.log("app install in progress");
  //     return res.redirect(appStoreLink);
  //   }
  // }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;
    userExists.appsflyer_id = appsflyer_id || userExists.appsflyer_id;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log("added user advertiser id");
      console.log({ "User updated": updatedUser });
      console.log("sending link");
      const newLink = updatedUser?.userLink;
      console.log({ redirectLink: newLink });
      res.json(newLink);
    }
  } else if (userTrackingIdExists) {
    console.log("user exists with advertiser id");

    console.log("sending link");

    const newLink = userTrackingIdExists?.userLink;

    console.log({ linkWithAdvertiserId: newLink });

    res.json(newLink);
  } else {
    console.log("old user exists");
    console.log("app launch successful");

    console.log("sending link");
    const newLink = userExists?.userLink;

    console.log({ oldUserRedirectLink: newLink });

    res.json(newLink);
  }
});

//====================={user registration}===================================================
//   "https://www.wingsofflimits.pro/register/?sub1=NPR&sub2=291735090";
app.get("/register", registerUser);

//====================={keitaro postback}===================================================

//https://www.wingsofflimits.pro/create_facebook_purchase_event?fbclid={subid}&external_id={subid}&campaign_name={campaign_name}&campaign_id={campaign_id}&=true&visitor_code={visitor_code}&user_agent={user_agent}&ip={ip}&offer_id={offer_id}&os={os}&region={region}&city={city}&source={source}

app.get("/create_facebook_purchase_event", createPurchaseEvent);
//https://www.wingsofflimits.pro/create_facebook_leads_event?fbclid={subid}&external_id={subid}&campaign_name={campaign_name}&campaign_id={campaign_id}&=true&visitor_code={visitor_code}&user_agent={user_agent}&ip={ip}&offer_id={offer_id}&os={os}&region={region}&city={city}&source={source}
app.get("/create_facebook_leads_event", createLeadEvent);

//test events
//https://www.wingsofflimits.pro/create_facebook_purchase_event?fbclid=37cionlfj9cd&external_id=37cionlfj9cd&campaign_name=iOS+46%2F+Wings+Off+Limits+%2F+Оффер&campaign_id={campaign_id}&=true&visitor_code={visitor_code}&user_agent={user_agent}&ip={ip}&offer_id={offer_id}&os={os}&region={region}&city={city}&source={source}

//====================={Apple postback}===================================================

//AASA file path//https://www.wingsofflimits.pro/.well-known/apple-app-site-association
//associated domain: applinks:www.wingsofflimits.pro
//Step2: automtically by apple
// automatic download link for AASA file done by apple from the associated domain list created in xcode only after the app has been installed on the device
app.get("/.well-known/apple-app-site-association", (req, res) => {
  // Serve the AASA file
  // default part if no query params
  // Set the appropriate Content-Type header
  res.setHeader("Content-Type", "application/json");
  res.sendFile(__dirname + "/apple-app-site-association.json");
});

//step3: on app launch
// call this on initializing app to fetch back the original link that is needed for tracking user
// because in the associated domain, we may not have th full path, but only the root domain https://www.wingsofflimits.pro

app.get("/track_app_installs", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const { advertiser_tracking_id, appsflyer_id } = req.query;

  if (advertiser_tracking_id) {
    console.log({ advertiser_tracking_id });
  }

  const userExists = await User.findOne({ ipAddress: ip });

  //save advertiser_tracking_id to user database on first app launch
  if (userExists && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;
    userExists.appsflyer_id = appsflyer_id || userExists.appsflyer_id;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });
    }
  }

  console.log("checking installs");
});

// fetch all users
app.get("/all_users", async (req, res) => {
  const allUsers = await User.find();

  if (allUsers) {
    console.log({ allUsers });
    res.status(200).json(allUsers);
  }
});

//=================={temporary usage}======================
app.get("/installed", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  const userExists = await User.findOne({ ipAddress: ip });

  // if only advertiser tracking id exists
  if (userExists) {
    console.log("only ip exists");
    const facebookLink = userExists.userLink;
    // let facebookLink = backend + defaultRequestURL;

    console.log({ installedLink: facebookLink });
    // res.redirect(newLink);
    res.json(facebookLink);
  }
});

//============{Apps flyer events}============================================

async function getUserByAdvertiserId(advertsier_id) {
  // const advertsier_id = advertiser_tracking_id;
  const userExist = await User.find({
    advertiserTrackingId: advertsier_id,
  });

  if (!userExist[0]) {
    console.log("user does not exist");
  }

  if (userExist[0]) {
    console.log({ userExist });
  }
}

// getUserByAdvertiserId(advertiser_tracking_id)

async function getUserByIPAddress(ip) {
  // const ip_address = custom_ip;
  const userExist = await User.find({
    ipAddress: ip,
  });

  if (!userExist[0]) {
    console.log("user does not exist");
  }

  if (userExist[0]) {
    console.log({ userExist });
    return userExist[0];
  }
}

// getUserByIPAddress(custom_ip)

//==================={testing purchase call from server}================================

async function sendPurchaseOnServer() {
  const url = `${backend}/create_facebook_purchase_event?fbclid=123&external_id=user125`;

  try {
    const response = await axios.get(url);
    // if (response.data) {
    //   console.log({ response: response.data });
    // }
  } catch (error) {
    console.log({ error });
  }
}

async function fetchCountryCode() {
  // Example usage:
  // const countryName = "United States";
  const countryName = "Pakistan";
  const countryCode = getCountryCode(countryName);
  let hashedCountryCode = null;

  if (countryCode) {
    console.log(`Normalized format: ${countryCode}`);
    hashedCountryCode = hashData(countryCode);
    console.log(`Hashed format: ${hashedCountryCode}`);
  } else {
    console.log("Country not found");
  }
}

// sendPurchaseOnServer();

async function sendLeadOnServer() {
  const url = `${backend}/create_facebook_leads_event?fbclid=123&external_id=user125`;

  try {
    const response = await axios.get(url);
    // if (response.data) {
    //   console.log({ response: response.data });
    // }
  } catch (error) {
    console.log({ error });
  }
}

// sendLeadOnServer();

// Endpoint to create Facebook lead event
app.get("/facebook_event_notification", async (req, res) => {
  const { event } = req.query;

  if (event) {
    console.log({ fB_event: event });
  }
});

//====={server}===========================================
const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
