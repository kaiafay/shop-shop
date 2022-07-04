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
            state.products = action.products
        },
        updateCategories: (state, action) => {
            state.categories = action.categories
        },
        updateCurrentCategory: (state, action) => {
            state.currentCategory = action.currentCategory
        },
        addToCart: (state, action) => {
            state.cartOpen = true;
            state.cart = action.product
        },
        addMultipleToCart: (state, action) => {
            state.cartOpen = true;
            state.cart = action.products
        },
        removeFromCart: (state, action) => {
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });

            state.cartOpen = newState.length > 0;
            state.cart = newState;
        },
        updateCartQuantity: (state, action) => {
            state.cartOpen = true;
            state.cart = state.cart.map(product => {
                if(action._id === product._id) {
                    product.purchaseQuantity = action.purchaseQuantity;
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