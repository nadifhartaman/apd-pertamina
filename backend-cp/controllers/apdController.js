const apdModel = require("../models/apdModel");

async function getContainers (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const rawLimit = parseInt(req.query.limit);
    const limit = rawLimit > 0 ? rawLimit : 10; // Default to 10 if limit is 0 or invalid
    const offset = (page - 1) * limit;

    const { type, startDate, endDate, id_camera } = req.query;

    const startTime = Date.now();
    
    const { data, total } = await apdModel.getAllContainer(limit, offset, type, startDate, endDate, id_camera);
    
    const duration = Date.now() - startTime;

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
    console.error('❌ Error:', err.message);
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

    // Auto-generate date range for week if not provided
    let finalStartDate = startDate;
    let finalEndDate = endDate;
    if (type === 'week' && !startDate && !endDate) {
      const today = new Date(todayDate);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      finalStartDate = weekAgo.toISOString().slice(0, 10);
      finalEndDate = todayDate;
    }


    const [todayTotal, todayHourly, yesterdayTotal, violationSummary] = await Promise.all([
      apdModel.getTotalDetection(todayDate, type, finalStartDate, finalEndDate, id_camera),
      apdModel.getCountPerHour(null, type, finalStartDate, finalEndDate, id_camera),
      apdModel.getTotalDetection(yesterdayDate, 'yesterday', null, null, id_camera),
      apdModel.getViolationSummary(todayDate, type, finalStartDate, finalEndDate, id_camera),
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

async function cleanupOldData(req, res) {
  try {
    const result = await apdModel.deleteOldData();
    res.status(200).json({
      success: true,
      message: `Deleted ${result.affectedRows} old records.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to cleanup old data",
      error: err.message,
    });
  }
}

module.exports = {
  cleanupOldData,
  getContainers,
  getLastContainer,
  getTodayCountPerHour,
  getDailyStats,
  getViolationSummaryByCamera,
  getCountPerWeek
};
