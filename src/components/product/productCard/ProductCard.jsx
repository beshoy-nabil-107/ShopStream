import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./ProductCard.scss";
import { productCardIcons, SetIcon } from "../../../assets/icons";

import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";

export default function ProductCard({ product, addToCartText = false }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  // Dynamic badge & price calculations for products page
  const discount = Math.round(product.discountPercentage || 0);
  const hasDiscount = addToCartText && discount >= 12;
  const isNew =
    addToCartText &&
    !hasDiscount &&
    (product.id <= 10 || product.rating >= 4.7);

  const currentPrice = Number(product.price).toFixed(2);
  const oldPrice = hasDiscount
    ? (product.price / (1 - discount / 100)).toFixed(2)
    : null;

  return (
    <Card
      className={`product-card h-100 rounded-4 overflow-hidden ${
        addToCartText ? "detailed-card p-2" : "border-0 shadow-sm"
      }`}
    >
      {/* Image Container as Link */}
      <Link
        to={`/products/${product.id}`}
        className={`position-relative img-wrapper p-3 text-center d-block text-decoration-none ${
          addToCartText ? "rounded-3" : "bg-light"
        }`}
      >
        {/* Top-Left NEW Badge */}
        {isNew && (
          <span className="badge-custom badge-new position-absolute">NEW</span>
        )}

        {/* Top-Right Discount Badge */}
        {hasDiscount && (
          <span className="badge-custom badge-discount position-absolute">
            -{discount}%
          </span>
        )}

        <Card.Img
          src={product.thumbnail}
          alt={product.title}
          className="product-img object-fit-contain"
        />
      </Link>

      {/* Product Details */}
      <Card.Body
        className={`d-flex flex-column ${addToCartText ? "px-2 pb-2 pt-3" : ""}`}
      >
        {addToCartText ? (
          <>
            {/* Products Page Layout: Title + Rating Row */}
            <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
              <Link
                to={`/products/${product.id}`}
                className="fs-6 fw-bold mb-0 text-truncate text-dark text-decoration-none title-link"
              >
                {product.title}
              </Link>
              <div className="d-flex align-items-center flex-shrink-0 rating-green">
                <SetIcon
                  Icon={productCardIcons.Star}
                  size={14}
                  className="star-green me-1"
                />
                <span className="small fw-bold text-dark">
                  {Number(product.rating).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <Card.Text className="text-muted small mb-3 desc-clamp">
              {product.description}
            </Card.Text>
          </>
        ) : (
          <>
            {/* Featured Slider Layout */}
            <span className="text-muted small mb-1 text-capitalize">
              {product.category}
            </span>

            <Link
              to={`/products/${product.id}`}
              className="fs-6 fw-bold mb-2 text-truncate text-dark text-decoration-none title-link"
            >
              {product.title}
            </Link>

            <div className="d-flex align-items-center mb-3">
              <SetIcon
                Icon={productCardIcons.Star}
                size={16}
                className="text-warning me-1"
              />
              <span className="small fw-medium">{product.rating}</span>
            </div>
          </>
        )}

        {/* Footer: Price & Add to Cart */}
        <div className="mt-auto d-flex align-items-center justify-content-between">
          {addToCartText ? (
            <div className="d-flex flex-column">
              <span className="fw-bold fs-5 price-green">${currentPrice}</span>
              {oldPrice && (
                <span className="text-muted text-decoration-line-through old-price">
                  ${oldPrice}
                </span>
              )}
            </div>
          ) : (
            <span className="fw-bolder fs-5 main-color">${product.price}</span>
          )}

          <Button
            onClick={handleAddToCart}
            variant="light"
            className={`${
              addToCartText
                ? "btn-solid-main rounded-3 px-3 py-2"
                : "cart-btn rounded-3 p-2 px-3"
            } border-0 d-flex align-items-center`}
          >
            <SetIcon
              Icon={productCardIcons.CartPlus}
              size={addToCartText ? 18 : 22}
              className={
                addToCartText ? "cart-icon-white" : "main-color cart-icon"
              }
            />
            {addToCartText && (
              <span className="ms-2 fw-semibold text-white small">Add</span>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
