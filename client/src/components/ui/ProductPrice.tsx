import React from 'react';
import { Product } from '../../types';

interface ProductPriceProps {
  product: Product;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({ product }) => {
  return (
    <div className="product-price">
      {product.discountPrice ? (
        <>
          <span className="original-price">${product.price}</span>
          <span className="current-price">${product.discountPrice}</span>
        </>
      ) : (
        <span className="current-price">${product.price}</span>
      )}
    </div>
  );
};
