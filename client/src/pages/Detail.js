import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Cart from '../components/cart';

import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from "../utils/helpers";
import spinner from '../assets/spinner.gif';

import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts
} from '../app/storeSlice';

function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const cart = useSelector(state => state.shop.cart);
  const products = useSelector(state => state.shop.products);

  useEffect(() => {
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } else if (data) {
      dispatch(updateProducts({ products: data.products }));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if(!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts({ products: indexedProducts }));
      });
    }
  }, [products, data, loading, dispatch, id]);

  const add = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      dispatch(updateCartQuantity({ _id: id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }));
      // if updating quantity, use existing item data and increment purchaseQuantity by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addToCart({ product: { ...currentProduct, purchaseQuantity: 1 } }));
      // if product isn't in cart, add it
      idbPromise('cart', 'put', {...currentProduct, purchaseQuantity: 1 });
    }
  };

  const remove = () => {
    dispatch(removeFromCart({ _id: currentProduct._id }));
    // delete item from IndexedDB
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={add}>Add to Cart</button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={remove}>
                Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
