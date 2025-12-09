const cameraApdModel = require("../models/cameraApdModel");

async function getCameras(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const cameras = await cameraApdModel.getAllCamera(page, limit);

    res.status(200).json({
      success: true,
      ...cameras,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cameras",
      error: err.message,
    });
  }
}

async function getCamerasPublic(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const cameras = await cameraApdModel.getAllCamera(page, limit);

    // Ambil hanya rtsp_url dan channel
    const data = cameras.data.map(cam => ({
      id: cam.id,
      name: cam.name,
      rtsp_url: cam.rtsp_url,
      channel: cam.channel
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cameras",
      error: err.message,
    });
  }
}

async function getByCamera(req, res) {
  try {
    const { id } = req.params;
    const camera = await cameraApdModel.getCameraById(id);

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: `Camera with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: camera,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch camera",
      error: err.message,
    });
  }
}


async function addCamera(req, res) {
  try {
    const { 
      name, 
      location, 
      description,  
      rtsp_url, 
      status, 
      resolution, 
      channel 
    } = req.body;

    if (!name || !location || !rtsp_url || !status) {
      return res.status(400).json({
        success: false,
        message: "name, location, rtsp_url, and status are required",
      });
    }

    const newCamera = await cameraApdModel.createCamera(
      name,
      location,
      description,
      rtsp_url,
      status,
      resolution,
      channel
    );

    res.status(201).json({
      success: true,
      message: "Camera created successfully",
      data: newCamera,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create camera",
      error: err.message,
    });
  }
}

async function editCamera(req, res) {
  try {
    const { id } = req.params;
    const { 
      name, 
      location, 
      description, 
      ip_address, 
      rtsp_url, 
      status, 
      resolution, 
      channel 
    } = req.body;

    const updatedCamera = await cameraApdModel.updateCamera(
      id,
      name,
      location,
      description,
      ip_address,
      rtsp_url,
      status,
      resolution,
      channel
    );

    if (!updatedCamera) {
      return res.status(404).json({
        success: false,
        message: `Camera with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update camera",
      error: err.message,
    });
  }
}

async function removeCamera(req, res) {
  try {
    const { id } = req.params;
    const result = await cameraApdModel.deleteCamera(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Camera with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Camera deleted successfully",
      data: { id },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete camera",
      error: err.message,
    });
  }
}

module.exports = { getCameras, getByCamera, addCamera, editCamera, removeCamera, getCamerasPublic };
