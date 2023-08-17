import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
// import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/ProductActions";
import { getAllOrders } from "../../actions/OrderActions.js";
import { getAllUsers } from "../../actions/UserActions.js";
import MetaData from "../layout/Metadata";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);

  // const { orders } = useSelector((state) => state.allOrders);

  // const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock == 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  // let totalAmount = 0;
  // orders &&
  //   orders.forEach((item) => {
  //     totalAmount += item.totalPrice;
  //   });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        // data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
  console.log(outOfStock, products.length);
  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>{/* Total Amount <br /> ₹{totalAmount} */}</p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              {/* <p>{orders && orders.length}</p> */}
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              {/* <p>{users && users.length}</p> */}
            </Link>
          </div>
        </div>

        {/* <div
          style={{
            width: "80%",
            margin: "auto",
            fontSize: '11'
          }}
          className="lineChart"
        >
          <LineChart
            width={300}
            height={200}
            xLabel="Ammount earned"
            data={[
              {
                color: "steelblue",
                points: [
                  { x: 0, y: 0 },
                  { x: 4000, y: 4000 },
                ],
                label: "Total ammount",
              },
            ]}
          />
        </div>

        <div className="doughnutChart">
          <DonutChart
            width={300}
            height={200}
            data={[
              {
                label: "Out of Stock",
                value: outOfStock,
              },
              {
                label: "In stock",
                value: products.length - outOfStock,
              },
            ]}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
