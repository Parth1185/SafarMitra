  // routes/apiRoutes.js
import express from 'express';
import UserAgent from 'user-agents';
import Prettify from '../utils/prettify.js';
import * as cheerio from 'cheerio'; // cheerio usually works best with * as import
import axios from 'axios';
const prettify = new Prettify();
const router = express.Router();



  router.get("/getTrain", async (req, resp) => {
    const trainNo = req.query.trainNo;
    const URL_Train = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    try {
      const response = await fetch(URL_Train);
      const data = await response.text();
      const json = prettify.CheckTrain(data);
      resp.json(json);
    } catch (e) {
      resp.send(e.message);
    }
  });

  router.get("/betweenStations", async (req, resp) => {
    const from = req.query.from;
    const to = req.query.to;
    const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${from}&Station_To=${to}&DataSource=0&Language=0&Cache=true`;
    try {
      const userAgent = new UserAgent();
      const response = await fetch(URL_Trains, {
        method: "GET",
        headers: { "User-Agent": userAgent.toString() },
      });
      const data = await response.text();
      const json = prettify.BetweenStation(data);
      resp.json(json);
    } catch (error) {
      console.log(error.message);
      resp.status(500).json({ success: false, data: error.message });
    }
  });

  router.get("/getTrainOn", async (req, resp) => {
    const arr = [];
    const retval = {};
    const from = req.query.from;
    const to = req.query.to;
    const date = req.query.date;
    if (date == null) {
      retval["success"] = false;
      retval["time_stamp"] = Date.now();
      retval["data"] = "Please Add Specific Date";
      resp.json(retval);
      return;
    }
    const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${from}&Station_To=${to}&DataSource=0&Language=0&Cache=true`;
    try {
      const userAgent = new UserAgent();
      const response = await fetch(URL_Trains, {
        method: "GET",
        headers: { "User-Agent": userAgent.toString() },
      });
      const data = await response.text();
      const json = prettify.BetweenStation(data);
      if (!json["success"]) {
        resp.json(json);
        return;
      }
      // date expected as DD-MM-YYYY by this route
      const DD = date.split("-")[0];
      const MM = date.split("-")[1];
      const YYYY = date.split("-")[2];
      const day = prettify.getDayOnDate(DD, MM, YYYY);
      json["data"].forEach((ele, ind) => {
        if (ele["train_base"] && ele["train_base"]["running_days"] && ele["train_base"]["running_days"][day] == 1) arr.push(ele);
      });
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;
      resp.json(retval);
    } catch (err) {
      console.log(err);
      resp.status(500).json({ success: false, data: err.message });
    }
  });

 router.get("/getRoute", async (req, resp) => {
  const trainNo = req.query.trainNo;
  try {
    // First: Get train info
    let URL_Train = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    let response = await fetch(URL_Train);
    let data = await response.text();
    let trainInfo = prettify.CheckTrain(data); // This has train_no & train_name
    if (!trainInfo.success) {
      return resp.json(trainInfo);
    }

    // Second: Get route
    URL_Train = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${trainInfo.data.train_id}&Data2=0&Cache=true`;
    response = await fetch(URL_Train);
    data = await response.text();
    let routeData = prettify.GetRoute(data); // This has stations only
    if (!routeData.success) {
      return resp.json(routeData);
    }

    // Combine train info & route
    const finalData = {
      success: true,
      time_stamp: Date.now(),
      train_no: trainInfo.data.train_no,
      train_name: trainInfo.data.train_name,
      data: routeData.data
    };

    resp.json(finalData);
  } catch (err) {
    console.log(err.message);
    resp.status(500).json({ success: false, data: err.message });
  }
});


  router.get("/stationLive", async (req, resp) => {
    const code = req.query.code;
    try {
      let URL_Train = `https://erail.in/station-live/${code}?DataSource=0&Language=0&Cache=true`;
      let response = await fetch(URL_Train);
      let data = await response.text();
      const $ = cheerio.load(data)
      let json = prettify.LiveStation($);
      resp.send(json)
    } catch (err) {
      console.log(err.message);
      resp.status(500).send(err.message);
    }
  });



export { router };