
export interface CartItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    discountPrice?: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}
