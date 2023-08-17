import React, { Fragment, useEffect } from "react";
import Metadata from "../layout/Metadata";
import "./Home.css";
import ProductCard from "./ProductCard";
import { getProducts } from "../../actions/ProductActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch();

  const { loading, error, products, productsCount } = useSelector((state) => state.products);

  useEffect(() => {
    if(error){
      return alert.error(error)
    }
    dispatch(getProducts());
  }, [dispatch,error]);
  
  return (
    <Fragment>
    {loading ? (
      <Loader/>
    ) : (
      <Fragment>
        <Metadata title="ECOMMERCE" />

        <div className="banner">
          <p>Welcome to Ecommerce</p>
          <h1>FIND AMAZING PRODUCTS BELOW</h1>

          <a href="#container">
            <button>
              Scroll
            </button>
          </a>
        </div>

        <h2 className="homeHeading">Featured Products</h2>

        <div className="container" id="container">
          {products &&
            products.map((product) => (
              <ProductCard product={product} />
            ))}
        </div>
      </Fragment>
    )}
  </Fragment>
  );
};

export default Home;
