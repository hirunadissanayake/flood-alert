import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { Shelter, ApiResponse } from '@/types';

interface ShelterState {
  shelters: Shelter[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShelterState = {
  shelters: [],
  isLoading: false,
  error: null,
};

// Get all shelters
export const getShelters = createAsyncThunk('shelters/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<Shelter[]>>('/shelters');
    return response.data.data!;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch shelters');
  }
});

// Create shelter (admin only)
export const createShelter = createAsyncThunk(
  'shelters/create',
  async (shelterData: Partial<Shelter>, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Shelter>>('/shelters', shelterData);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create shelter');
    }
  }
);

// Update shelter (admin only)
export const updateShelter = createAsyncThunk(
  'shelters/update',
  async ({ id, data }: { id: string; data: Partial<Shelter> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<Shelter>>(`/shelters/${id}`, data);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shelter');
    }
  }
);

const shelterSlice = createSlice({
  name: 'shelters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get shelters
      .addCase(getShelters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShelters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shelters = action.payload;
      })
      .addCase(getShelters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create shelter
      .addCase(createShelter.fulfilled, (state, action) => {
        state.shelters.push(action.payload);
      })
      // Update shelter
      .addCase(updateShelter.fulfilled, (state, action) => {
        const index = state.shelters.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.shelters[index] = action.payload;
        }
      });
  },
});

export const { clearError } = shelterSlice.actions;
export default shelterSlice.reducer;
