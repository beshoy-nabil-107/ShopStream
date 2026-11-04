import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import "./CategoriesSection.scss";

// Image imports
import leftImage from "../../assets/images/large-category.png";
import rightImage from "../../assets/images/right-category.png";
import centerImage from "../../assets/images/center-category.png";
import bottomImage from "../../assets/images/bottom-category.png";

export default function CategoriesSection() {

  return (
    <Container className="categories-section my-5">
      {/* Section Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1">Top Categories</h2>
          <p className="text-muted mb-0">Curated gear for every lifestyle.</p>
        </div>
        <Link
          to="/categories"
          className=" main-color text-decoration-none fw-semibold"
        >
          See All &rarr;
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="row g-3">
        {/* Left Column */}
        <div className="col-md-6">
          <Link
            to="/products?category=laptops" // query
            className="category-card d-block h-100 rounded-4 overflow-hidden position-relative"
          >
            <img
              src={leftImage}
              alt="Computing"
              className="img-fluid w-100 h-100 object-fit-cover"
            />
            <div className="category-overlay d-flex flex-column justify-content-end p-4">
              <h4 className="text-white fw-bold mb-1">Computing</h4>
              <p className="text-white-50 mb-0 small">
                Work and play without limits.
              </p>
            </div>
          </Link>
        </div>

        {/* Right Column */}
        <div className="col-md-6 d-flex flex-column gap-3">
          {/* Upper Row - Two square images */}
          <div className="row g-3 h-50">
            <div className="col-6">
              <Link
                to="/products?category=mens-watches" // query
                className="category-card d-block h-100 rounded-4 overflow-hidden position-relative"
              >
                <img
                  src={centerImage}
                  alt="Wearables"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div className="category-overlay d-flex flex-column justify-content-end p-3">
                  <h5 className="text-white fw-bold mb-0">Wearables</h5>
                </div>
              </Link>
            </div>
            <div className="col-6">
              <Link
                to="/products?category=mobile-accessories" // query
                className="category-card d-block h-100 rounded-4 overflow-hidden position-relative"
              >
                <img
                  src={rightImage}
                  alt="Audio"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div className="category-overlay d-flex flex-column justify-content-end p-3">
                  <h5 className="text-white fw-bold mb-0">Audio</h5>
                </div>
              </Link>
            </div>
          </div>

          {/* Lower Row */}
          <div className="h-50">
            <Link
              to="/products?category=home-decoration" // query
              className="category-card d-block h-100 rounded-4 overflow-hidden position-relative"
            >
              <img
                src={bottomImage}
                alt="Home Theater"
                className="img-fluid w-100 h-100 object-fit-cover"
              />
              <div className="category-overlay d-flex flex-column justify-content-end p-4">
                <h5 className="text-white fw-bold mb-1">Home Theater</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
