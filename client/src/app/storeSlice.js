import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    categories: [],
    currentCategory: '',
    cart: [],
    cartOpen: false
}

export const storeSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        updateProducts: (state, action) => {
            state.products = action.payload.products
        },
        updateCategories: (state, action) => {
            state.categories = action.payload.categories
        },
        updateCurrentCategory: (state, action) => {
            state.currentCategory = action.payload.currentCategory
        },
        addToCart: (state, action) => {
            state.cartOpen = true;
            state.cart = action.payload.product
        },
        addMultipleToCart: (state, action) => {
            state.cartOpen = true;
            state.cart = action.payload.products
        },
        removeFromCart: (state, action) => {
            let newState = state.cart.filter(product => {
                return product._id !== action.payload._id;
            });

            state.cartOpen = newState.length > 0;
            state.cart = newState;
        },
        updateCartQuantity: (state, action) => {
            state.cartOpen = true;
            state.cart = state.cart.map(product => {
                if(action.payload._id === product._id) {
                    product.purchaseQuantity = action.payload.purchaseQuantity;
                }
                return product;
            });
        },
        clearCart: state => {
            state.cartOpen = false;
            state.cart = [];
        },
        toggleCart: state => {
            state.cartOpen = !state.cartOpen
        }
    }
});

export const {
    updateProducts,
    updateCategories,
    updateCurrentCategory,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleCart
} = storeSlice.actions;

export default storeSlice.reducer;