import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

// instantiate the global state object
const StoreContext = createContext();
const { Provider } = StoreContext;

// instantiate initial global state
const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: ''
    });
    // confirm it works
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

// custom react hook
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };

