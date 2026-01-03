import { Response } from 'express';
import Shelter from '../models/Shelter';
import { AuthRequest } from '../types';

// @desc    Create new shelter
// @route   POST /api/shelters
// @access  Private/Admin
export const createShelter = async (req: AuthRequest, res: Response) => {
  try {
    const shelter = await Shelter.create(req.body);
    res.status(201).json({ success: true, data: shelter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all shelters
// @route   GET /api/shelters
// @access  Public
export const getShelters = async (req: AuthRequest, res: Response) => {
  try {
    const { isActive } = req.query;
    
    let query: any = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const shelters = await Shelter.find(query).sort({ name: 1 });

    res.json({ success: true, count: shelters.length, data: shelters });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single shelter
// @route   GET /api/shelters/:id
// @access  Public
export const getShelter = async (req: AuthRequest, res: Response) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    res.json({ success: true, data: shelter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update shelter
// @route   PUT /api/shelters/:id
// @access  Private/Admin
export const updateShelter = async (req: AuthRequest, res: Response) => {
  try {
    let shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: shelter });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete shelter
// @route   DELETE /api/shelters/:id
// @access  Private/Admin
export const deleteShelter = async (req: AuthRequest, res: Response) => {
  try {
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    await shelter.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update shelter occupancy
// @route   PUT /api/shelters/:id/occupancy
// @access  Private/Admin
export const updateOccupancy = async (req: AuthRequest, res: Response) => {
  try {
    const { currentOccupancy } = req.body;
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    if (currentOccupancy > shelter.capacity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Occupancy cannot exceed shelter capacity' 
      });
    }

    shelter.currentOccupancy = currentOccupancy;
    await shelter.save();

    res.json({ 
      success: true, 
      message: 'Occupancy updated successfully',
      data: shelter 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get shelter statistics
// @route   GET /api/shelters/stats
// @access  Private
export const getShelterStats = async (req: AuthRequest, res: Response) => {
  try {
    const shelters = await Shelter.find({ isActive: true });
    
    const totalShelters = shelters.length;
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
    const totalOccupied = shelters.reduce((sum, s) => sum + s.currentOccupancy, 0);
    const availableSpace = totalCapacity - totalOccupied;
    
    const fullShelters = shelters.filter(s => s.currentOccupancy >= s.capacity).length;
    const nearlyfullShelters = shelters.filter(s => 
      s.currentOccupancy >= s.capacity * 0.8 && s.currentOccupancy < s.capacity
    ).length;

    res.json({ 
      success: true, 
      data: {
        totalShelters,
        totalCapacity,
        totalOccupied,
        availableSpace,
        occupancyRate: ((totalOccupied / totalCapacity) * 100).toFixed(1),
        fullShelters,
        nearlyFullShelters: nearlyfullShelters
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
