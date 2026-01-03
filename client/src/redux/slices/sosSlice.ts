import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { SOSRequest, ApiResponse } from '@/types';

interface SOSState {
  requests: SOSRequest[];
  currentRequest: SOSRequest | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SOSState = {
  requests: [],
  currentRequest: null,
  isLoading: false,
  error: null,
};

// Get all SOS requests
export const getSOSRequests = createAsyncThunk('sos/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<SOSRequest[]>>('/sos');
    return response.data.data!;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch SOS requests');
  }
});

// Create SOS request
export const createSOSRequest = createAsyncThunk(
  'sos/create',
  async (sosData: Partial<SOSRequest>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<SOSRequest>>('/sos', sosData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create SOS request');
    }
  }
);

// Update SOS request
export const updateSOSRequest = createAsyncThunk(
  'sos/update',
  async ({ id, data }: { id: string; data: Partial<SOSRequest> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<SOSRequest>>(`/sos/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update SOS request');
    }
  }
);

// Delete SOS request
export const deleteSOSRequest = createAsyncThunk(
  'sos/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/sos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete SOS request');
    }
  }
);

const sosSlice = createSlice({
  name: 'sos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get SOS requests
      .addCase(getSOSRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSOSRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(getSOSRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create SOS request
      .addCase(createSOSRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })
      // Update SOS request
      .addCase(updateSOSRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      // Delete SOS request
      .addCase(deleteSOSRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearError } = sosSlice.actions;
export default sosSlice.reducer;
