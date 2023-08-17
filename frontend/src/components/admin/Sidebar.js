import React from "react";
import "./Sidebar.css";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import MuiTreeView from "material-ui-treeview";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

const Sidebar = () => {
  const navigate = useNavigate();
  const product = "product";

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <p>
        <MuiTreeView
          className="MuiTreeView"
          style={{
            width: "30%",
            marginLeft: "60px",
            color: "rgb(100, 100, 100)",
          }}
          onLeafClick={(node) =>
            navigate(`/admin/${JSON.stringify(node.id).slice(1, -1)}`)
          }
          tree={[
            {
              value: "Products",
              nodes: [
                { value: "all", id: `products` },
                { value: "create", id: `product` },
              ],
            },
          ]}
        ></MuiTreeView>
      </p>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
