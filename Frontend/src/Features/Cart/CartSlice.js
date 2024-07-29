import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllCartItems, addItemToCart , reduceCartItemQuantity, removeCartItem} from "./CartAPI";

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

export const fetchAllCartItemsAsync = createAsyncThunk(
  "cart/fetchAllCartItems",
  async () => {
    try {
      const response = await fetchAllCartItems();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addItemToCartAsync = createAsyncThunk(
  "cart/addItemToCartAsync",
  async ({ productDetails }) => {
    try {
      console.log("called 1..");
      const response = await addItemToCart(productDetails);
      console.log({ response , productDetails});
      return {data : response.data , productDetails};
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
);

export const reduceCartItemQuantityAsync = createAsyncThunk(
    "cart/reduceCartItemQuantityAsync",
    async ({ productDetails }) => {
      try {
        const response = await reduceCartItemQuantity(productDetails);
        console.log({ response , productDetails});
        return {data : response.data , productDetails};
      } catch (error) {
        console.log({ error });
        throw error;
      }
    }
  );

export const removeCartItemAsync = createAsyncThunk(
    "cart/removeCartItemAsync",
    async({productDetails}) => {
        try{
            const response = await removeCartItem(productDetails)
            console.log("thunk",{response})
            return {data : response.data , productDetails};

        }catch(error){
            console.log({ error });
            throw error;
        }
    }
)

// export const addQuantityAsync = createAsyncThunk(
//     "cart/addQuantityAsync",
//     async({productId})=>{
//         try{
//             console.log("called 2..")
//             const response = await addCartItemQuantity(productId)
//             console.log({response})
//             return response.data
//         }catch(error){
//             console.log({error})
//             throw(error)
//         }
//     }
// )

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // to fetcites
      .addCase(fetchAllCartItemsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCartItemsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // console.log({action})
        state.cartItems = action.payload;
      })
      .addCase(fetchAllCartItemsAsync.rejected, (state, action) => {
        state.status = "idle";
        // console.log({action})
        state.error = action.error.message;
      })

      // to add items to cart
      .addCase(addItemToCartAsync.pending, (state) => {
        console.log("fdjfsojfosjdofjsodfjos");
        state.status = "loading";
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {

        const { productDetails} = action.payload;
        const { productId, color, size ,quantity , colorCode } = productDetails;
        const existingProduct = state.cartItems.find(
          (item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
        );
        if (existingProduct) {
            if(existingProduct.quantity < 5){
          existingProduct.quantity += productDetails.quantity
        }
        } else {
          state.cartItems.push({
            product: productId, quantity, size, color, colorCode
          });
        }
        state.status = "idle";
      })
      .addCase(addItemToCartAsync.rejected, (state, action) => {
        state.status = "idle";
        console.log({ action });
        state.error = action.error.message;
      })

      // to reduce quantity
      .addCase(reduceCartItemQuantityAsync.pending, (state) => {
        // console.log("fdjfsojfosjdofjsodfjos");
        state.status = "loading";
      })
      .addCase(reduceCartItemQuantityAsync.fulfilled, (state, action) => {

        const { productDetails} = action.payload;
        const { productId, color, size ,quantity , colorCode } = productDetails;
        const existingProduct = state.cartItems.find(
          (item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
        );

        if(existingProduct.quantity === 1){
            state.cartItems = state.cartItems.filter((item) => 
                item.product._id === productId && item.color === color && item.size === size ? false : true)
        }else{
            state.cartItems = state.cartItems.map(item => 
                item.product._id === productId && item.color === color && item.size === size ? {...item,quantity:item.quantity-1} : {...item}
            )
        }
      
        state.status = "idle";
      })
      .addCase(reduceCartItemQuantityAsync.rejected, (state, action) => {
        state.status = "idle";
        console.log({ action });
        state.error = action.error.message;
      })

      // remove from cart
      .addCase(removeCartItemAsync.pending, (state) => {
        // console.log("fdjfsojfosjdofjsodfjos");
        state.status = "loading";
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {

        const { productDetails} = action.payload;
        const { productId, color, size } = productDetails;
        
        state.cartItems = state.cartItems.filter(item => 
            item.product._id.toString() === productId.toString() && item.size === size && item.color === color ? false :true
        )      
        state.status = "idle";
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.status = "idle";
        console.log({ action });
        state.error = action.error.message;
      })


  },
});

export const selectCartItems = (state) => state.cart;
export default cartSlice.reducer;