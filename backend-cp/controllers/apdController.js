const apdModel = require("../models/apdModel");

async function getContainers (req, res) {
  try {
    // ambil query param, default page=1, limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // ambil data + total count dari model
    const { data, total } = await apdModel.getAllContainer(limit, offset);

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
    res
      .status(500)
      .json({ success: false, message: "failed to fetch containers", error: err.message });
  }
}

async function getTodayCountPerHour(req, res) {
  try {
    const { date } = req.query; // ?date=2025-09-03
    const data = await apdModel.getCountPerHour(date);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to fetch count per hour",
      error: err.message,
    });
  }
}

async function getLastContainer (req, res) {
  try {
    const last = await apdModel.getLastContainer();
    res.status(200).json({ success: true, data: last });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch last container", error: err.message });
  }
}

async function getDailyStats(req, res) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    // tanggal hari ini & kemarin
    const todayDate = date;
    const yesterdayDate = new Date(new Date(date).getTime() - 86400000) // -1 hari
      .toISOString()
      .slice(0, 10);

    // ambil total & hourly
    const [todayTotal, todayHourly, yesterdayTotal, violationSummary] = await Promise.all([
      apdModel.getTotalDetection(todayDate),
      apdModel.getCountPerHour(todayDate),
      apdModel.getTotalDetection(yesterdayDate),
      apdModel.getViolationSummary(todayDate),
    ]);

    // hitung persentase
    let percentageChange = 0;
    let status = "same";

    if (yesterdayTotal === 0 && todayTotal === 0) {
      // dua-duanya nol → tidak ada perubahan
      percentageChange = 0;
      status = "same";
    } else if (yesterdayTotal === 0 && todayTotal > 0) {
      // kemarin 0, hari ini ada → naik tak terhingga
      percentageChange = 100;
      status = "increase";
    } else if (yesterdayTotal > 0) {
      percentageChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
      status = percentageChange > 0 ? "increase" : (percentageChange < 0 ? "decrease" : "same");
    }

    res.status(200).json({
      success: true,
      date: todayDate,
      hourly: todayHourly,
      yesterday: {
        date: yesterdayDate,
        total: yesterdayTotal,
      },
      violationSummary,
      totalChange: {
        total: todayTotal,
        percentage: percentageChange.toFixed(2) + "%",
        status, // "increase" | "decrease" | "same"
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

async function getViolationSummaryByCamera(req, res) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const summary = await apdModel.getViolationByCamera(date);

    res.status(200).json({
      success: true,
      date,
      summary, // { camera_id: { totals, percentages }, ... }
    });
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
  getViolationSummaryByCamera
};
