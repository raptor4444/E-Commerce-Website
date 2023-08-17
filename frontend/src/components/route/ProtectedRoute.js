import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtectRoute = ({ isAdmin, element: Element }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Fragment>
      {loading === false &&
        (isAuthenticated ? <Outlet /> : <Navigate to="/login" />)}
    </Fragment>
  );
};

const RoleProtectRoute = ({ isAdmin, element: Element }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (isAdmin && user.role !== "admin") {
        return <Navigate to="/login" />
  }

  return (
    <Fragment>
          <Outlet/>
    </Fragment>
  );
};

const StripeRoute = ({ element: Element }) => {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    getStripeApiKey();
  }, []);

  return (
    <Elements stripe={loadStripe(stripeApiKey)}>
      <Outlet />
    </Elements>
  );
};

export { AuthProtectRoute, RoleProtectRoute, StripeRoute };
