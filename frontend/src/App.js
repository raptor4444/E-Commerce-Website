import "./App.css";
import Header from "./components/layout/header/Header.js";
import Footer from "./components/layout/footer/Footer.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import { React, useEffect, useState } from "react";
import Home from "./components/home/Home";
import ProductDetails from "./components/product/ProductDetails.js";
import Products from "./components/product/Products";
import Search from "./components/product/Search";
import LoginSignup from "./components/user/LoginSignup";
import store from "./store";
import { loadUser } from "./actions/UserActions";
import UserOptions from "./components/layout/header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./components/user/Profile";
import {
  AuthProtectRoute,
  RoleProtectRoute,
  StripeRoute,
} from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";
import Success from "./components/cart/Success";
import MyOrders from "./components/orders/MyOrders";
import OrderDetails from "./components/orders/OrderDetails";
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProducts from "./components/admin/UpdateProducts";
import OrderList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UserList from "./components/admin/UserList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import Contact from "./components/layout/contact/Contact";
import About from "./components/layout/about/About";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);
  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/contact" element={<Contact/>} />
        <Route exact path="/about" element={<About/>} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignup />} />
        <Route element={<AuthProtectRoute />}>
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route element={<RoleProtectRoute />}>
            <Route exact path="/admin/dashboard" element={<Dashboard />} isAdmin={true} />
            <Route exact path="/admin/products" element={<ProductList />} isAdmin={true} />
            <Route exact path="/admin/product" element={<NewProduct />} isAdmin={true} />
            <Route exact path="/admin/product/:id" element={<UpdateProducts />} isAdmin={true} />
            <Route exact path="/admin/orders" element={<OrderList />} isAdmin={true} />
            <Route exact path="/admin/order/:id" element={<ProcessOrder />} isAdmin={true} />
            <Route exact path="/admin/users" element={<UserList />} isAdmin={true} />
            <Route exact path="/admin/users/:id" element={<UpdateUser />} isAdmin={true} />
            <Route exact path="/admin/reviews" element={<ProductReviews />} isAdmin={true} />
          </Route>
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          <Route element={<StripeRoute />}>
            <Route exact path="/process/payment" element={<Payment />} />
          </Route>
          <Route exact path="/success" element={<Success />} />
          <Route exact path="/orders" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
        </Route>
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
