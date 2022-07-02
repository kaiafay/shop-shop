import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { idbPromise } from "../../utils/helpers";
import './style.css';

import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, addMultipleToCart } from '../../app/storeSlice'

const Cart = () => {
  const cart = useSelector(state => state.shop.cart);
  const cartOpen = useSelector(state => state.shop.cartOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch(addMultipleToCart({products: [...cart] }));
    };

    if(!cart.length) {
      getCart();
    }
  }, [cart.length, dispatch]);

  function toggle() {
    dispatch(toggleCart());
  }

  function calculateTotal() {
    let sum = 0;
    cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggle}>
        <span
          role="img"
          aria-label="cart">🛒</span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggle}>[close]</div>
      <h2>Shopping Cart</h2>
      {cart.length ? (
        <div>
            {cart.map(item => (
              <CartItem key={item._id} item={item} />
            ))}

            <div className="flex-row space-between">
              <strong>Total: ${calculateTotal()}</strong>
              {
                Auth.loggedIn() ?
                  <button>
                    Checkout
                  </button>
                  :
                  <span>(log in to check out)</span>
              }
            </div>
          </div>
      ) : (
        <h3>
          <span role='img' aria-label='shocked'>
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;