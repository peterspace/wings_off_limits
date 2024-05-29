const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      "*",
    ],
    credentials: true,
  })
);

// -momery unleaked---------
app.set("trust proxy", 1);

//Step1: initial path
app.get("/", (req, res) => {
  const { installed } = req.query;

  // go to appstore to install app if not already installed
  if (installed != "true") {
    const appStoreLink = process.env.APP_STORE_LINK;

    res.redirect(appStoreLink);
  }

  console.log("app redirect successful");

  const facebookLink = process.env.FACEBOOK_FULL_LINK;

  const newLink = facebookLink + `&installed=${installed}`;

  res.json(newLink);
});

//set marketers link inside app

//AASA file path//https://www.dmtgames.pro/.well-known/apple-app-site-association
//associated domain: applinks:www.dmtgames.pro
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
// because in the associated domain, we may not have th full path, but only the root domain https://www.dmtgames.pro

app.get("/game", (req, res) => {
  const facebookLink = process.env.FACEBOOK_FULL_LINK;
  const installed = "true";
  const newLink = facebookLink + `&installed=${installed}`;
  console.log(newLink);
  res.json(newLink);
});

app.get("/installed", (req, res) => {
  const facebookLink = process.env.FACEBOOK_FULL_LINK;
  const installed = "true";
  const newLink = facebookLink + `&installed=${installed}`;
  console.log(newLink);
  res.redirect(newLink);
});

app.get("/track_app_installs", async (req, res) => {
  const { advertiser_tracking_id } = req.query;
  console.log("checking installs");

  const app_id = process.env.FACEBOOK_APP_ID;
  const app_access_token = process.env.FACEBOOK_ACCESS_TOKEN;

  if (advertiser_tracking_id) {
    console.log({ advertiser_tracking_id });
    try {
      const response = await axios.post(
        `https://graph.facebook.com/${app_id}/activities?event=MOBILE_APP_INSTALL&event_name=MOBILE_APP_INSTALL&application_tracking_enabled=1&advertiser_tracking_enabled=1&advertiser_id=${advertiser_tracking_id}&access_token=${app_access_token}`
      );

      if (response.data) {
        let result = response.data;
        console.log({ result });
      }
    } catch (error) {
      console.log(error);
    }
  }
  // const advertiser_tracking_id = ""
});

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

