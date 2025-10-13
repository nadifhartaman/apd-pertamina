const apdModel = require("../models/apdModel");

async function getContainers (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    console.log(limit)
    const offset = (page - 1) * limit;

    const { type, startDate, endDate, id_camera } = req.query;

    const { data, total } = await apdModel.getAllContainer(limit, offset, type, startDate, endDate, id_camera);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch containers",
      error: err.message,
    });
  }
}


// controller
async function getTodayCountPerHour (req, res) {
  try {
    const { date, type = 'today', startDate, endDate, id_camera } = req.query;
    const data = await apdModel.getCountPerHour(date, type, startDate, endDate, id_camera);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to fetch count per hour",
      error: err.message,
    });
  }
}

async function getCountPerWeek(req, res) {
  try {
    const { date, type = 'month', startDate, endDate, id_camera } = req.query;
    const data = await apdModel.getCountPerWeek(date, type, startDate, endDate, id_camera);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to fetch count per week",
      error: err.message,
    });
  }
}



async function getLastContainer (req, res) {
  try {
    const { type = 'today', startDate, endDate, id_camera } = req.query;
    const last = await apdModel.getLastContainer(type, startDate, endDate, id_camera);
    res.status(200).json({ success: true, data: last });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to fetch last container",
      error: err.message,
    });
  }
}

async function getDailyStats (req, res) {
  try {
    const { date, type, startDate, endDate, id_camera } = req.query;

    const todayDate = date || new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date(new Date(todayDate).getTime() - 86400000)
      .toISOString()
      .slice(0, 10);

    const [todayTotal, todayHourly, yesterdayTotal, violationSummary] = await Promise.all([
      apdModel.getTotalDetection(todayDate, type, startDate, endDate, id_camera),
      apdModel.getCountPerHour(todayDate, type, startDate, endDate, id_camera),
      apdModel.getTotalDetection(yesterdayDate, id_camera),
      apdModel.getViolationSummary(todayDate, type, startDate, endDate, id_camera),
    ]);

    let percentageChange = 0;
    let status = "same";

    if (yesterdayTotal === 0 && todayTotal === 0) {
      percentageChange = 0;
      status = "same";
    } else if (yesterdayTotal === 0 && todayTotal > 0) {
      percentageChange = 100;
      status = "increase";
    } else if (yesterdayTotal > 0) {
      percentageChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
      status = percentageChange > 0 ? "increase" : percentageChange < 0 ? "decrease" : "same";
    }

    res.status(200).json({
      success: true,
      date: todayDate,
      hourly: todayHourly,
      yesterday: { date: yesterdayDate, total: yesterdayTotal },
      violationSummary,
      totalChange: {
        total: todayTotal,
        percentage: percentageChange.toFixed(2) + "%",
        status,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily stats",
      error: err.message,
    });
  }
}

async function getViolationSummaryByCamera (req, res) {
  try {
    const { date, type, startDate, endDate, id_camera } = req.query;
    const summary = await apdModel.getViolationByCamera(date, type, startDate, endDate, id_camera);
    res.status(200).json({ success: true, date, summary });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch violation summary per camera",
      error: err.message,
    });
  }
}

module.exports = {
  getContainers,
  getLastContainer,
  getTodayCountPerHour,
  getDailyStats,
  getViolationSummaryByCamera,
  getCountPerWeek
};
