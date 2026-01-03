import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { FloodReport, ApiResponse } from '@/types';

interface ReportState {
  reports: FloodReport[];
  currentReport: FloodReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,
};

// Get all reports
export const getReports = createAsyncThunk('reports/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<FloodReport[]>>('/reports');
    return response.data.data!;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
  }
});

// Create report
export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData: Partial<FloodReport> & { imageFile?: File | null }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append location data
      if (reportData.location) {
        formData.append('location[lat]', reportData.location.lat.toString());
        formData.append('location[lng]', reportData.location.lng.toString());
        formData.append('location[address]', reportData.location.address || '');
      }
      
      // Append other fields
      if (reportData.waterLevel) formData.append('waterLevel', reportData.waterLevel);
      if (reportData.description) formData.append('description', reportData.description);
      
      // Append image file if present
      if (reportData.imageFile) {
        formData.append('image', reportData.imageFile);
      }

      const response = await api.post<ApiResponse<FloodReport>>('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create report');
    }
  }
);

// Update report
export const updateReport = createAsyncThunk(
  'reports/update',
  async ({ id, data }: { id: string; data: Partial<FloodReport> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<FloodReport>>(`/reports/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update report');
    }
  }
);

// Delete report
export const deleteReport = createAsyncThunk('reports/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/reports/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete report');
  }
});

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get reports
      .addCase(getReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create report
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
      })
      // Update report
      .addCase(updateReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      // Delete report
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;
