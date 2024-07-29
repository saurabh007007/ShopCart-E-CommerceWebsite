import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllOrders , fetchOrderById ,updateOrderById , createProduct} from "./AdminAPI";

const initialState = {
  ordersList: [],
  status: "idle",
  error: null,
  orderDetails : {},
  totalOrders: 0
}

export const fetchAllOrdersAsync = createAsyncThunk(
  "user/fetchAllOrders",
  async ({filter,sort,page}) => {
    try {
      const response = await fetchAllOrders({sort,page});
      console.log('orders slice', { response });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchOrderByIdAsync = createAsyncThunk(
  "user/fetchOrderById",
  async ({ orderId }) => {
    // console.log("slice",{orderId})
    try {
      const response = await fetchOrderById(orderId);
      // console.log({ response });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateOrderByIdAsync = createAsyncThunk(
  "user/updateOrderById",
  async ({ orderId , updatedOrderDetails}) => {
    // console.log({orderId , updatedOrderDetails})
    try {
      const response = await updateOrderById({orderId , updatedOrderDetails});
      // console.log("slice update order" ,{ response });
      return ({data : response.data , updatedOrderDetails})
    } catch (error) {
      throw error;
    }
  }
);

export const createProductAsync = createAsyncThunk(
  "user/createProduct",
  async ({ product}) => {
    console.log("thunk",{product})
    try {
      const response = await createProduct(product);
      // console.log("slice update order" ,{ response });
      return ( response.data )
    } catch (error) {
      throw error;
    }
  }
);



const orderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all orders
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        // console.log("slice all orders ", { action });
        state.ordersList = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.status = "idle";
      })
      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        // console.log("slice all orders", { action });
        state.error = action.error.message;
        state.status = "idle";
      })

      // fetch order by id
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        // console.log("slice order by id ", { action });
        state.orderDetails = action.payload;
        state.status = "idle";
      })
      .addCase(fetchOrderByIdAsync.rejected, (state, action) => {
        // console.log("slice order by id", { action });
        state.error = action.error.message;
        state.status = "idle";
      })

      // update order by id
      .addCase(updateOrderByIdAsync.pending, (state) => {
        state.orderDetails = null // clear prev orders state
        state.status = "loading";
      })
      .addCase(updateOrderByIdAsync.fulfilled, (state, action) => {
        // console.log("slice update order by id ", { action });
        state.orderDetails = {...state.orderDetails , ...action.payload.updatedOrderDetails}
        state.status = "idle";
      })
      .addCase(updateOrderByIdAsync.rejected, (state, action) => {
        // console.log("slice update order by id", { action });
        state.error = action.error.message;
        state.status = "idle";
      })

      // create product
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const selectAllOrders = (state) => state.admin.ordersList;
export const selectOrderDetails = (state) => state.admin.orderDetails
export const selectTotalOrders = (state) => state.admin.totalOrders
export const selectAdminAPIStatus = (state) => state.admin.status

export default orderSlice.reducer;