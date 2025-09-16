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

module.exports = {
  getContainers,
  getLastContainer,
  getTodayCountPerHour
};
