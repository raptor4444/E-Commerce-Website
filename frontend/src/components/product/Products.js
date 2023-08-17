import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearError } from "../../actions/ProductActions";
import "./Products.css";
import Loader from "../layout/loader/Loader";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import ProductCard from "../home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import MetaData from "../layout/Metadata";

const Products = () => {
  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "sport",
  ];
  const [category, setCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const [price, setPrice] = useState([0, 25000]);
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const [ratings, setRatings] = useState(0);

  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;

  const { products, loading, error, resultPerPage, productsCount } =
    useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    dispatch(getProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch, error, keyword, currentPage, price, category, ratings]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
