import { Response } from 'express';
import mongoose from 'mongoose';
import SOSRequest from '../models/SOSRequest';
import { AuthRequest } from '../types';

// @desc    Create new SOS request
// @route   POST /api/sos
// @access  Private
export const createSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    const sosRequest = await SOSRequest.create({
      userId: req.user?.id,
      ...req.body
    });

    res.status(201).json({ success: true, data: sosRequest });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all SOS requests
// @route   GET /api/sos
// @access  Private/Admin
export const getSOSRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type } = req.query;
    
    let query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // Regular users can only see their own requests
    if (req.user?.role !== 'admin') {
      query.userId = req.user?.id;
    }

    const sosRequests = await SOSRequest.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedVolunteer', 'name email phoneNumber')
      .sort({ timestamp: -1 });

    res.json({ success: true, count: sosRequests.length, data: sosRequests });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single SOS request
// @route   GET /api/sos/:id
// @access  Private
export const getSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    const sosRequest = await SOSRequest.findById(req.params.id)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedVolunteer', 'name email phoneNumber');
    
    if (!sosRequest) {
      return res.status(404).json({ success: false, message: 'SOS request not found' });
    }

    // Check authorization
    if (req.user?.role !== 'admin' && sosRequest.userId.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.json({ success: true, data: sosRequest });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update SOS request
// @route   PUT /api/sos/:id
// @access  Private/Admin
export const updateSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    let sosRequest = await SOSRequest.findById(req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ success: false, message: 'SOS request not found' });
    }

    // Admin can update any, users can only update their own
    if (req.user?.role !== 'admin' && sosRequest.userId.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    sosRequest = await SOSRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: sosRequest });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete SOS request
// @route   DELETE /api/sos/:id
// @access  Private/Admin
export const deleteSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    const sosRequest = await SOSRequest.findById(req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ success: false, message: 'SOS request not found' });
    }

    if (req.user?.role !== 'admin' && sosRequest.userId.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
    }

    await sosRequest.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Accept SOS request (Admin/Volunteer)
// @route   PUT /api/sos/:id/accept
// @access  Private/Admin
export const acceptSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    const sosRequest = await SOSRequest.findById(req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ success: false, message: 'SOS request not found' });
    }

    if (sosRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'This request has already been processed' 
      });
    }

    sosRequest.status = 'accepted';
    sosRequest.assignedVolunteer = new mongoose.Types.ObjectId(req.user?.id);
    await sosRequest.save();

    const updatedRequest = await SOSRequest.findById(sosRequest._id)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedVolunteer', 'name email phoneNumber');

    res.json({ 
      success: true, 
      message: 'SOS request accepted',
      data: updatedRequest 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Complete SOS request (Admin/Assigned Volunteer)
// @route   PUT /api/sos/:id/complete
// @access  Private/Admin
export const completeSOSRequest = async (req: AuthRequest, res: Response) => {
  try {
    const sosRequest = await SOSRequest.findById(req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ success: false, message: 'SOS request not found' });
    }

    if (sosRequest.status !== 'accepted') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only accepted requests can be marked as completed' 
      });
    }

    // Check if user is admin or assigned volunteer
    if (req.user?.role !== 'admin' && sosRequest.assignedVolunteer?.toString() !== req.user?.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the assigned volunteer or admin can complete this request' 
      });
    }

    sosRequest.status = 'completed';
    await sosRequest.save();

    const updatedRequest = await SOSRequest.findById(sosRequest._id)
      .populate('userId', 'name email phoneNumber')
      .populate('assignedVolunteer', 'name email phoneNumber');

    res.json({ 
      success: true, 
      message: 'SOS request marked as completed',
      data: updatedRequest 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get SOS statistics
// @route   GET /api/sos/stats
// @access  Private/Admin
export const getSOSStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalRequests = await SOSRequest.countDocuments();
    const pendingRequests = await SOSRequest.countDocuments({ status: 'pending' });
    const acceptedRequests = await SOSRequest.countDocuments({ status: 'accepted' });
    const completedRequests = await SOSRequest.countDocuments({ status: 'completed' });
    
    const typeCounts = {
      rescue: await SOSRequest.countDocuments({ type: 'rescue' }),
      food: await SOSRequest.countDocuments({ type: 'food' }),
      medicine: await SOSRequest.countDocuments({ type: 'medicine' }),
      evacuation: await SOSRequest.countDocuments({ type: 'evacuation' })
    };

    // Get today's requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRequests = await SOSRequest.countDocuments({ timestamp: { $gte: today } });

    res.json({ 
      success: true, 
      data: {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        completedRequests,
        todayRequests,
        typeCounts
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
