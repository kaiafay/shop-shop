import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"
import { idbPromise } from "../../utils/helpers";

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateCartQuantity } from '../../app/storeSlice';

function ProductItem(item) {
  const cart = useSelector(state => state.shop.cart);
  const dispatch = useDispatch();

  const add = () => {
    // find cart item with matching id
    const itemInCart = cart.find(cartItem => cartItem._id === _id);

    // if there's a match, call UPDATE with a new purchase quantity
    if(itemInCart) {
      dispatch(updateCartQuantity({ _id: _id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addToCart({ product: { ...item, purchaseQuantity: 1 } }));
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={add}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
