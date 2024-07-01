const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");
const path = require("path");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const User = require("./models/User.js");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const backend = process.env.BACKEND_URL;

//=============={Facebook Pixel Info}==========================
const pixelId = process.env.FACEBOOK_PIXEL_ID; // Replace with your actual Pixel ID
const accessToken = process.env.FACEBOOK_PIXEL_ACCESS_TOKEN; // Replace with your actual access token

//================{Facebook App Info}===================================
const app_id = process.env.FACEBOOK_APP_ID;
const app_access_token = process.env.FACEBOOK_ACCESS_TOKEN;
//=======================================================================

//Step1: initial path

// const link1 =
//   "https://www.dmtgames.pro/?sub1=NPR&sub2=291735090&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";
// const link2 =
//   "https://www.dmtgames.pro/?sub1=NPR&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";
// const link3 =
//   "https://www.dmtgames.pro/?sub1=NPR&sub2=291735090&sub3=NPR&sub4=vidos1&sub5={{ad.id}}&sub6=method1&fbp=714981180129689&token=EAAEcIRgo4MIBO7Gb3oGV6rbcjXOiZBhplvcAeWAXc6Xfn0xZAv02XEts1RyAcV7zEbY6mbYBqPgjUKY6PWhRrRf0YWHkzBToto5Q6rSJ4RqDWg8u84mKzhC28AeZBv1EXYGfCj1NZBTNPTH7ejqdUtCZA7ZCIgvZAZBuGqEpySTJOCgz6aIQawJfcsQBRGiuTiPh7AZDZD";

// add advertiser_tracking_id to installed API call in unity app
app.get("/", async (req, res) => {
  //======{request objects}====================================
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { sub1, advertiser_tracking_id } = req.query;

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  //============{state variables}====================================

  let updatedLink = backend + requestURL;
  let facebookLink = "";

  //============{data iterations}====================================
  // Check if user email already exists
  const userExists = await User.findOne({ ipAddress: ip });
  const userTrackingIdExists = await User.findOne({
    advertiserTrackingId: advertiser_tracking_id,
  });

  //Activate App: fb_mobile_activate_app

  await checkFacebookAppActivationEvent();

  if (!userExists) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: updatedLink,
    });

    if (newUser) {
      facebookLink = updatedLink;
      console.log({ "New user created": newUser });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (
    advertiser_tracking_id &&
    userTrackingIdExists &&
    advertiser_tracking_id != userExists?.advertiserTrackingId
  ) {
    console.log("new user");

    const newUser = await User.create({
      ipAddress: ip,
      userLink: updatedLink,
      advertiserTrackingId: advertiser_tracking_id,
    });

    if (newUser) {
      facebookLink = updatedLink;
      console.log({
        "New user created with same ip but new advertiserId": newUser,
      });
      const appStoreLink = process.env.APP_STORE_LINK;
      console.log("app install in progress");
      return res.redirect(appStoreLink);
    }
  }

  if (advertiser_tracking_id && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });
      facebookLink = userExists.userLink;
    }
  } else if (userTrackingIdExists) {
    console.log("user exists");
    facebookLink = userTrackingIdExists.userLink;
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });
  } else {
    console.log("user exists");
    facebookLink = userExists?.userLink ? userExists?.userLink : backend;
    console.log("app launch successful");
    console.log({ marketerLink: facebookLink });
  }

  console.log("sending link");
  newLink = facebookLink;

  console.log({ redirectLink: newLink });

  res.json(newLink);
});

//set marketers link inside app

// office

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

app.get("/track_app_installs", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const { advertiser_tracking_id } = req.query;

  if (advertiser_tracking_id) {
    console.log({ advertiser_tracking_id });
  }

  const userExists = await User.findOne({ ipAddress: ip });

  //save advertiser_tracking_id to user database on first app launch
  if (userExists && !userExists.advertiserTrackingId) {
    userExists.advertiserTrackingId =
      advertiser_tracking_id || userExists.advertiserTrackingId;

    const updatedUser = await userExists.save();

    if (updatedUser) {
      console.log({ "User updated": updatedUser });
    }
  }
  console.log("checking installs");
  await createFacebookAppInstallEvent();
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
    console.log({ installedLink: facebookLink });
    // res.redirect(newLink);
    res.json(facebookLink);
  }
});

/**
 * 
 *
 The SKAdNetwork is specific to app attribution on iOS devices and is used in the context of app installs and post-install events, 
 primarily for tracking and attribution of ad-driven installs.
 */

//================={mobile app events using facebook app id credentials}========================================
async function checkFacebookAppActivationEvent() {
  const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

  const payload = {
    event: "CUSTOM_APP_EVENTS",
    advertiser_tracking_enabled: 1,
    application_tracking_enabled: 1,
    custom_events: [{ _eventName: "fb_mobile_activate_app" }],
    skadnetwork_attribution: {
      version: "2.2",
      source_app_id: app_id,
      conversion_value: 0, // Значение для установки приложения
    },
    user_data: { anon_id: "UNIQUE_USER_ID" },
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });

    if (response.data) {
      let result = response.data;

      console.log({ result });
      //{ result: { success: true } }
    }
    //====={New update}========================
  } catch (error) {
    // const err = error.response.data;
    console.log(error);
    console.error(error);
    // return { status: err.success, message: err.message };
    // res.json(err);
  }
}

async function createFacebookAppInstallEvent() {
  //Install: fb_mobile_install

  const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

  const payload = {
    event: "CUSTOM_APP_EVENTS",
    advertiser_tracking_enabled: 1,
    application_tracking_enabled: 1,
    custom_events: [
      {
        _eventName: "fb_mobile_install",
      },
    ],
    skadnetwork_attribution: {
      version: "2.2",
      source_app_id: app_id,
      conversion_value: 0,
    },
    user_data: {
      anon_id: "UNIQUE_USER_ID",
    },
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });

    if (response.data) {
      let result = response.data;

      console.log({ result });
      //{ result: { success: true } }
    }
    //====={New update}========================
  } catch (error) {
    // const err = error.response.data;
    console.log(error);
    console.error(error);
    // return { status: err.success, message: err.message };
    // res.json(err);
  }
}

//================={website events using facebook pixel id credentials}========================================
//keitaro postback
//https://www.dmtgames.pro/create_facebook_purchase_event?fbclid={subid}&external_id={subid}&campaign_name={campaign_name}&campaign_id={campaign_id}&=true&visitor_code={visitor_code}&user_agent={user_agent}&ip={ip}&offer_id={offer_id}&os={os}&region={region}&city={city}&source={source}

// Helper function to hash data
function hashData(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

//https://www.dmtgames.pro/create_facebook_purchase_event?fbclid=user123&external_id=user123&value=10
//http://localhost:4000/create_facebook_purchase_event?fbclid=user123&external_id=user123&value=10
// Endpoint to receive purchase information from an external website using and create Facebook purchase event

app.get("/track_facebook_purchase_event", (req, res) => {
  const purchaseData = req.query; // using query strings
  console.log({ purchaseData });
  app.locals.purchaseData = purchaseData;
  console.log({ message: "Purchase information received" });
  //create_facebook_purchase_event
  createFacebookEvent("Purchase", purchaseData, req, res);
});

// Endpoint to receive lead information from an external website and create Facebook lead event
app.get("/track_facebook_lead_event", (req, res) => {
  const leadData = req.query; // using query strings
  console.log({ leadData });
  app.locals.leadData = leadData;
  console.log({ message: "Lead information received" });
  //create_facebook_lead_event
  createFacebookEvent("Lead", leadData, req, res);
});

//=========={Not mandatory}==========================================
// Endpoint to get purchase information
app.get("/get_purchase_info", (req, res) => {
  const purchaseData = app.locals.purchaseData;
  if (purchaseData) {
    res.status(200).json(purchaseData);
  } else {
    res.status(404).json({ message: "No purchase information available" });
  }
});

// Endpoint to get lead information
app.get("/get_lead_info", (req, res) => {
  const leadData = app.locals.leadData;
  if (leadData) {
    res.status(200).json(leadData);
  } else {
    res.status(404).json({ message: "No lead information available" });
  }
});

// Function to create Facebook event
async function createFacebookEvent(eventType, eventData, req, res) {
  console.log("creating Facebook Event in progress");
  const {
    fbclid,
    external_id,
    date,
    client_ip_address,
    client_user_agent,
    email,
    phone,
    first_name,
    last_name,
    city,
    state,
    zip_code,
    country,
    value,
    currency,
    source,
  } = eventData;
  const ip =
    client_ip_address ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const unixTimeNow = Math.floor(Date.now() / 1000);

  const min = 1;
  const max = 9999;
  let randomNumberFloat = Math.random() * (max - min) + min;
  const random = Math.round(randomNumberFloat);
  const payload = {
    data: [
      {
        event_name: eventType,
        event_time: date || unixTimeNow,
        action_source: "website",
        event_source_url: source || "https://av-gameprivacypolicy.site/app",
        user_data: {
          client_ip_address: client_ip_address || ip,
          client_user_agent: client_user_agent || req.headers["user-agent"],
          fbc: `fb.1.${date || unixTimeNow}.${fbclid ? fbclid : "abcdefg"}`,
          fbp: `fb.1.${date || unixTimeNow}.${random}`,
          fbclid: fbclid ? fbclid : null, // Include fbclid if available
          em: email ? hashData(email) : null,
          ph: phone ? hashData(phone) : null,
          fn: first_name ? hashData(first_name) : null,
          ln: last_name ? hashData(last_name) : null,
          ct: city ? hashData(city) : null,
          st: state ? hashData(state) : null,
          zp: zip_code ? hashData(zip_code) : null,
          country: country ? hashData(country) : null,
        },
        custom_data: {
          currency: currency || "USD",
          value: value || 0,
          external_id: external_id || "user123",
        },
      },
    ],
    access_token: accessToken,
  };

  console.log({ payload });
  console.log({ data: payload?.data ? payload.data : payload });
  console.log({
    user_data: payload.data[0]?.user_data ? payload.data[0].user_data : null,
  });

  // const url = `https://graph.facebook.com/v10.0/${pixelId}/events`;
  const url = `https://graph.facebook.com/${pixelId}/events`;

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data) {
      const result = response.data;
      console.log({ [`${eventType}_event_result`]: result });
      res.render("event", { eventType, eventData });
    }
  } catch (error) {
    console.log({ [`${eventType}_event_error`]: error });
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("Error request data:", error.request);
      res.status(500).json({ message: "No response received from Facebook" });
    } else {
      console.error("Error message:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

//=============={Keitaro events}============================================

app.get("/create_facebook_purchase_event", async (req, res) => {
  //Install: fb_mobile_install

  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { fbclid, sub_id_10, external_id, date, client_ip_address } = req.query;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  // const sub_id_10 = "";
  const unixTimeNow = Math.floor(Date.now() / 1000);
  console.log({ unixTimeNow });

  const min = 1;
  const max = 9999;
  let randomNumberFloat = Math.random() * (max - min) + min;

  const random = Math.round(randomNumberFloat);
  console.log({ random });

  // Function to generate random number

  if (unixTimeNow && random) {
    console.log({ processing: "calling facebook endpoint" });
    const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

    const payload = {
      event: "CUSTOM_APP_EVENTS",
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      advertiser_id: "1234",
      action_source: "website",
      event_time: date || unixTimeNow,
      event_source_url: "https://av-gameprivacypolicy.site/app",
      custom_events: [
        {
          _eventName: "fb_mobile_purchase",
          // _eventName: "Purchase", // Standard event name for purchases
          _valueToSum: 10,
          fb_currency: "USD",
        },
      ],
      skadnetwork_attribution: {
        version: "2.2",
        source_app_id: app_id,
        // conversion_value: 0,
        conversion_value: 1,
      },
      user_data: {
        external_id: external_id ? external_id.toString() : "user123",
        // client_ip_address: client_ip_address || ip,
        client_ip_address: client_ip_address || "192.168.1.1",
        client_user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // fbc: "fb.1.1625247600.abcdefg",
        // fbp: "fb.1.1625247600.1234",
        fbc: `fb.1.${date || unixTimeNow}.${sub_id_10 ? sub_id_10 : "abcdefg"}`,
        fbp: `fb.1.${date || unixTimeNow}.${random}`,
        fbclid: fbclid || null, // Include fbclid if available
      },
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;

        console.log({ FB_purchase_event_result: result });
        //{ result: { success: true } }
      }
      //====={New update}========================
    } catch (error) {
      // const err = error.response.data;
      console.log({ FB_purchase_event_error: error });
      // console.error(error);
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // No response received
        console.error("Error request data:", error.request);
      } else {
        // Something else happened
        console.error("Error message:", error.message);
      }
    }
  }
});

app.get("/create_facebook_leads_event", async (req, res) => {
  //Install: fb_mobile_install

  const requestURL = req.originalUrl; // This will include query parameters, if any
  const { fbclid, sub_id_10, external_id, date, client_ip_address } = req.query;

  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  console.log({ userIPAddress: ip });
  console.log({ requestURL });
  console.log({ Query: req.query });

  // const sub_id_10 = "";
  const unixTimeNow = Math.floor(Date.now() / 1000);

  const min = 1;
  const max = 9999;
  let random = Math.random() * (max - min) + min;

  // Function to generate random number

  if (unixTimeNow && random) {
    const url = `https://graph.facebook.com/${app_id}/activities?access_token=${app_access_token}`;

    const payload = {
      event: "CUSTOM_APP_EVENTS",
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      advertiser_id: "1234",
      action_source: "website",
      event_time: date || unixTimeNow,
      event_source_url: "https://av-gameprivacypolicy.site/app",
      custom_events: [
        {
          // _eventName: "fb_mobile_purchase",
          _eventName: "Lead", // Standard event name for leads
          _valueToSum: 0,
          fb_currency: "USD",
        },
      ],
      skadnetwork_attribution: {
        version: "2.2",
        source_app_id: app_id,
        // conversion_value: 0,
        conversion_value: 1,
      },
      user_data: {
        external_id: external_id ? external_id.toString() : "user123",
        client_ip_address: client_ip_address || ip,
        client_user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // fbc: "fb.1.1625247600.abcdefg",
        // fbp: "fb.1.1625247600.1234",
        fbc: `fb.1.${date || unixTimeNow}.${sub_id_10 ? sub_id_10 : "abcdefg"}`,
        fbp: `fb.1.${date || unixTimeNow}.${random}`,
        fbclid: fbclid || null, // Include fbclid if available
      },
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, payload, { headers: headers });

      if (response.data) {
        let result = response.data;

        console.log({ FB_purchase_event_result: result });
        //{ result: { success: true } }
      }
      //====={New update}========================
    } catch (error) {
      // const err = error.response.data;
      console.log({ FB_purchase_event_error: error });
      console.error(error);
      // return { status: err.success, message: err.message };
      // res.json(err);
    }
  }
});

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server;
  })
  .catch((err) => console.log(err));
