import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import FloodReport from '../models/FloodReport';
import SOSRequest from '../models/SOSRequest';
import Shelter from '../models/Shelter';

// @desc    Get comprehensive admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const safeUsers = await User.countDocuments({ isSafe: true });
    const unsafeUsers = await User.countDocuments({ isSafe: false });

    // Flood report statistics
    const totalReports = await FloodReport.countDocuments();
    const verifiedReports = await FloodReport.countDocuments({ status: 'verified' });
    const pendingReports = await FloodReport.countDocuments({ status: 'pending' });
    const reportsBySeverity = {
      low: await FloodReport.countDocuments({ waterLevel: 'low' }),
      medium: await FloodReport.countDocuments({ waterLevel: 'medium' }),
      high: await FloodReport.countDocuments({ waterLevel: 'high' }),
      severe: await FloodReport.countDocuments({ waterLevel: 'severe' })
    };

    // SOS request statistics
    const totalSOSRequests = await SOSRequest.countDocuments();
    const pendingSOSRequests = await SOSRequest.countDocuments({ status: 'pending' });
    const acceptedSOSRequests = await SOSRequest.countDocuments({ status: 'accepted' });
    const completedSOSRequests = await SOSRequest.countDocuments({ status: 'completed' });
    const sosByType = {
      rescue: await SOSRequest.countDocuments({ type: 'rescue' }),
      food: await SOSRequest.countDocuments({ type: 'food' }),
      medicine: await SOSRequest.countDocuments({ type: 'medicine' }),
      evacuation: await SOSRequest.countDocuments({ type: 'evacuation' })
    };

    // Shelter statistics
    const totalShelters = await Shelter.countDocuments();
    const activeShelters = await Shelter.countDocuments({ isActive: true });
    const shelters = await Shelter.find();
    const totalCapacity = shelters.reduce((sum, shelter) => sum + shelter.capacity, 0);
    const totalOccupancy = shelters.reduce((sum, shelter) => sum + shelter.currentOccupancy, 0);

    // Today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReports = await FloodReport.countDocuments({ timestamp: { $gte: today } });
    const todaySOSRequests = await SOSRequest.countDocuments({ timestamp: { $gte: today } });
    const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });

    // Weekly trend (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const reportsLastWeek = await FloodReport.countDocuments({ timestamp: { $gte: weekAgo } });
    const sosRequestsLastWeek = await SOSRequest.countDocuments({ timestamp: { $gte: weekAgo } });
    
    // Reports by day for the last 7 days
    const reportsByDay = await FloodReport.aggregate([
      {
        $match: { timestamp: { $gte: weekAgo } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: regularUsers,
          safe: safeUsers,
          unsafe: unsafeUsers,
          newToday: todayUsers
        },
        reports: {
          total: totalReports,
          verified: verifiedReports,
          pending: pendingReports,
          bySeverity: reportsBySeverity,
          today: todayReports,
          lastWeek: reportsLastWeek,
          byDay: reportsByDay
        },
        sosRequests: {
          total: totalSOSRequests,
          pending: pendingSOSRequests,
          accepted: acceptedSOSRequests,
          completed: completedSOSRequests,
          byType: sosByType,
          today: todaySOSRequests,
          lastWeek: sosRequestsLastWeek
        },
        shelters: {
          total: totalShelters,
          active: activeShelters,
          totalCapacity,
          totalOccupancy,
          availableSpace: totalCapacity - totalOccupancy
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get recent activities for admin dashboard
// @route   GET /api/admin/activities
// @access  Private/Admin
export const getRecentActivities = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    // Get recent reports
    const recentReports = await FloodReport.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit);

    // Get recent SOS requests
    const recentSOSRequests = await SOSRequest.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit);

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        recentReports,
        recentSOSRequests,
        recentUsers
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Bulk verify flood reports
// @route   POST /api/admin/reports/bulk-verify
// @access  Private/Admin
export const bulkVerifyReports = async (req: AuthRequest, res: Response) => {
  try {
    const { reportIds } = req.body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of report IDs' 
      });
    }

    const result = await FloodReport.updateMany(
      { _id: { $in: reportIds } },
      { status: 'verified' }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} reports verified successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Bulk delete flood reports
// @route   DELETE /api/admin/reports/bulk-delete
// @access  Private/Admin
export const bulkDeleteReports = async (req: AuthRequest, res: Response) => {
  try {
    const { reportIds } = req.body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of report IDs' 
      });
    }

    const result = await FloodReport.deleteMany({ _id: { $in: reportIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} reports deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
