import { Response } from 'express';
import FloodReport from '../models/FloodReport';
import { AuthRequest } from '../types';

// @desc    Create new flood report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const reportData: any = {
      userId: req.user?.id,
      ...req.body
    };

    // If image was uploaded, add the image URL
    if (req.file) {
      reportData.imageUrl = `/uploads/reports/${req.file.filename}`;
    }

    const report = await FloodReport.create(reportData);

    res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all flood reports
// @route   GET /api/reports
// @access  Public
export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status, waterLevel, limit = 100 } = req.query;
    
    let query: any = {};
    if (status) query.status = status;
    if (waterLevel) query.waterLevel = waterLevel;

    const reports = await FloodReport.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single flood report
// @route   GET /api/reports/:id
// @access  Public
export const getReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await FloodReport.findById(req.params.id).populate('userId', 'name email phoneNumber');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update flood report
// @route   PUT /api/reports/:id
// @access  Private/Admin
export const updateReport = async (req: AuthRequest, res: Response) => {
  try {
    let report = await FloodReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Check if user is admin or report owner
    if (req.user?.role !== 'admin' && report.userId.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this report' });
    }

    report = await FloodReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete flood report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await FloodReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Check if user is admin or report owner
    if (req.user?.role !== 'admin' && report.userId.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Verify flood report (Admin only)
// @route   PUT /api/reports/:id/verify
// @access  Private/Admin
export const verifyReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await FloodReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = 'verified';
    await report.save();

    res.json({ 
      success: true, 
      message: 'Report verified successfully',
      data: report 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get statistics for dashboard
// @route   GET /api/reports/stats
// @access  Private
export const getReportStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalReports = await FloodReport.countDocuments();
    const verifiedReports = await FloodReport.countDocuments({ status: 'verified' });
    const pendingReports = await FloodReport.countDocuments({ status: 'pending' });
    
    const severityCounts = {
      low: await FloodReport.countDocuments({ waterLevel: 'low' }),
      medium: await FloodReport.countDocuments({ waterLevel: 'medium' }),
      high: await FloodReport.countDocuments({ waterLevel: 'high' }),
      severe: await FloodReport.countDocuments({ waterLevel: 'severe' })
    };

    // Get today's reports
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReports = await FloodReport.countDocuments({ timestamp: { $gte: today } });

    res.json({ 
      success: true, 
      data: {
        totalReports,
        verifiedReports,
        pendingReports,
        todayReports,
        severityCounts
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
