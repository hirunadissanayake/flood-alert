import { Response } from 'express';
import Comment from '../models/Comment';
import FloodReport from '../models/FloodReport';
import { AuthRequest } from '../types';

// @desc    Get comments for a report
// @route   GET /api/comments/:reportId
// @access  Public
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;

    const comments = await Comment.find({ reportId })
      .populate('userId', 'name')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching comments',
      error: error.message 
    });
  }
};

// @desc    Add comment to a report
// @route   POST /api/comments/:reportId
// @access  Private
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { reportId } = req.params;
    const { text } = req.body;

    // Check if report exists
    const report = await FloodReport.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Flood report not found'
      });
    }

    const comment = await Comment.create({
      reportId,
      userId: req.user?.id,
      text
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding comment',
      error: error.message 
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:commentId
// @access  Private (only comment owner)
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name');

    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating comment',
      error: error.message 
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:commentId
// @access  Private (only comment owner or admin)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting comment',
      error: error.message 
    });
  }
};
