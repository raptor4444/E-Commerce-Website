import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, ProductDetailsReducer, productReducer, productReviewsReducer, ProductsReducer, reviewReducer } from "./reducers/ProductReducer";
import { allUsersReducer, forgotPasswordReducer, ProfileReducer, usersDetailsReducer, UserReducer } from "./reducers/UserReducer";
import { cartReducer } from "./reducers/CartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/OrderReducer";

const reducer = combineReducers({
    products: ProductsReducer,
    productDetails: ProductDetailsReducer,
    user: UserReducer,
    profile: ProfileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    usersDetails: usersDetailsReducer,
    review: reviewReducer,
    productReviews: productReviewsReducer
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  userDetails: null
};

const middleWare = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store