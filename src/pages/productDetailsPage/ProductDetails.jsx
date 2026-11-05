import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  fetchAllProducts,
} from "../../store/slices/productSlice";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import {
  productCardIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "./ProductDetails.scss";

import { addToCart } from "../../store/slices/cartSlice";

const COLOR_OPTIONS = [
  { name: "Midnight Indigo", hex: "#3525CD" },
  { name: "Matte Charcoal", hex: "#3A3A3C" },
  { name: "Pearl White", hex: "#F4F5F7" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const go = useNavigate();

  // Add to Cart handler for main product
  const handleAddMainProduct = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedColor: selectedColor.name,
      }),
    );
  };

  const {
    selectedProduct: product,
    allProducts,
    isLoading,
    error,
  } = useSelector((store) => store.products);

  // Local UI states
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("specs"); // Default tab: Specifications

  // Fetch single product details
  useEffect(() => {
    dispatch(fetchProductById(id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, id]);

  // Set default gallery image and fetch related category products
  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || product.thumbnail);
      setQuantity(1);
      if (product.category) {
        dispatch(
          fetchAllProducts({
            category: product.category,
            limit: 8,
            skip: 0,
          }),
        );
      }
    }
  }, [product, dispatch]);

  if (isLoading) {
    return (
      <Container className="py-5 my-5 text-center min-vh-100">
        <Spinner animation="border" className="main-color" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 min-vh-100">
        <Alert
          variant="danger"
          className="d-flex align-items-center justify-content-center gap-2 rounded-4"
        >
          <SetIcon Icon={productCardIcons.errorOutline} size={24} />
          <span>{error}</span>
        </Alert>
      </Container>
    );
  }

  if (!product) return null;

  // Price & discount
  const discount = Math.round(product.discountPercentage || 0);
  const currentPrice = Number(product.price).toFixed(2);
  const oldPrice =
    discount > 0 ? (product.price / (1 - discount / 100)).toFixed(2) : null;

  //  gallery array
  const galleryImages =
    product.images?.length > 1
      ? product.images
      : [product.thumbnail, product.thumbnail, product.thumbnail];

  // Related products excluding current item
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <section className="product-details-page py-4">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav mb-4 d-flex align-items-center gap-2 small">
          <Link to="/" className="text-muted text-decoration-none">
            Home
          </Link>
          <span className="text-muted">&gt;</span>
          <Link to="/products" className="text-muted text-decoration-none">
            Products
          </Link>
          <span className="text-muted">&gt;</span>
          <Link
            to={`/products?category=${product.category}`}
            className="text-muted text-decoration-none text-capitalize"
          >
            {product.category}
          </Link>
          <span className="text-muted">&gt;</span>
          <span className="text-dark fw-semibold text-truncate">
            {product.title}
          </span>
        </nav>

        {/* Top Product Overview Section */}
        <Row className="g-4 g-lg-5 mb-5 align-items-start">
          {/* Left Column */}
          <Col xs={12} lg={6}>
            <div className="gallery-container d-flex flex-column-reverse flex-sm-row gap-3">
              {/* Thumbnails Slider */}
              <div className="thumbs-swiper-wrapper">
                <Swiper
                  direction="vertical"
                  slidesPerView="auto"
                  spaceBetween={12}
                  freeMode={true}
                  mousewheel={true}
                  modules={[FreeMode, Mousewheel]}
                  className="thumbs-swiper"
                  breakpoints={{
                    0: { direction: "horizontal" },
                    576: { direction: "vertical" },
                  }}
                >
                  {galleryImages.map((imgUrl, index) => (
                    <SwiperSlide key={index} className="thumb-slide">
                      <button
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`thumb-item rounded-3 p-2 border bg-light ${
                          activeImage === imgUrl ? "active" : ""
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.title}-thumb-${index + 1}`}
                          className="w-100 h-100 object-fit-contain"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Preview Card */}
              <div className="main-image-card flex-grow-1 bg-white p-3 rounded-4 border position-relative">
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="wishlist-btn position-absolute border-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                >
                  <SetIcon
                    Icon={
                      isWishlisted
                        ? productDetailsIcons.heartFilled
                        : productDetailsIcons.heartOutline
                    }
                    size={18}
                    className={isWishlisted ? "text-danger" : "main-color"}
                  />
                </button>
                {/* Main Image */}
                <div className="main-img-inner rounded-3 d-flex align-items-center justify-content-center p-4">
                  <img
                    src={activeImage || product.thumbnail}
                    alt={product.title}
                    className="img-fluid main-img object-fit-contain"
                  />
                </div>
              </div>
            </div>
          </Col>

          {/* Right Column */}
          <Col xs={12} lg={6}>
            <div className="product-info">
              {/* Badge & SKU */}
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="arrival-badge px-3 py-1 rounded-pill fw-bold">
                  New Arrival
                </span>
                <span className="text-muted small">
                  SKU: {product.sku || `SHP-${product.id}092-A`}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="h2 fw-bolder text-dark mb-2">{product.title}</h1>

              {/* Rating & Reviews Count */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SetIcon
                      key={star}
                      Icon={
                        star <= Math.round(product.rating)
                          ? productCardIcons.Star
                          : productDetailsIcons.starEmpty
                      }
                      size={16}
                      className="star-green"
                    />
                  ))}
                </div>
                <span className="fw-bold small text-dark">
                  {Number(product.rating).toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className="btn btn-link p-0 text-muted small text-decoration-underline"
                >
                  {product.reviews?.length || 0} Reviews
                </button>
              </div>

              {/* Price & Discount Row */}
              <div className="mb-1 d-flex align-items-baseline gap-2">
                <span className="display-6 fw-bolder text-dark">
                  ${currentPrice}
                </span>
                {oldPrice && (
                  <span className="text-muted text-decoration-line-through fs-6">
                    ${oldPrice}
                  </span>
                )}
                {discount > 0 && (
                  <span className="discount-text fw-bold small">
                    ({discount}% OFF)
                  </span>
                )}
              </div>

              <p className="text-muted small mb-4 pb-3 border-bottom">
                {product.shippingInformation ||
                  "Ships within 2-3 business days"}
                . Free shipping on orders over $500.
              </p>

              {/* Description */}
              <p className="text-secondary small leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mb-4">
                <div className="small mb-2">
                  <span className="fw-bold text-dark">Select Color: </span>
                  <span className="text-muted">{selectedColor.name}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`color-swatch rounded-circle ${
                        selectedColor.name === color.name ? "active" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart Row */}
              <div className="mb-3">
                <label className="small fw-bold text-dark d-block mb-2">
                  Quantity
                </label>
                <div className="d-flex align-items-center gap-3">
                  <div className="qty-box d-flex align-items-center justify-content-between border rounded-3 bg-white px-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="btn btn-sm border-0 fw-bold text-muted"
                    >
                      −
                    </button>
                    <span className="fw-bold small px-3">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="btn btn-sm border-0 fw-bold text-muted"
                    >
                      +
                    </button>
                  </div>
                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddMainProduct}
                    className="bg-main-color border-0 rounded-3 py-2 px-4 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2 add-cart-btn"
                  >
                    <SetIcon
                      Icon={productDetailsIcons.shoppingBag}
                      size={18}
                      className="text-white"
                    />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>

              {/* Buy Now Button */}
              <Button onClick={() => {
                handleAddMainProduct();
                go("/checkout");
              }} className="buy-now-btn w-100 border-0 rounded-3 py-2 fw-semibold mb-4">
                Buy Now
              </Button>

              {/* Perks grid */}
              <Row className="g-3 pt-3 border-top small text-dark fw-medium">
                <Col xs={6} className="d-flex align-items-center gap-2">
                  <SetIcon
                    Icon={productDetailsIcons.warranty}
                    size={18}
                    className="perk-icon"
                  />
                  <span>
                    {product.warrantyInformation || "2 Year Warranty"}
                  </span>
                </Col>
                <Col xs={6} className="d-flex align-items-center gap-2">
                  <SetIcon
                    Icon={productDetailsIcons.delivery}
                    size={18}
                    className="perk-icon"
                  />
                  <span>
                    {product.shippingInformation || "Fast 2-Day Delivery"}
                  </span>
                </Col>
                <Col xs={6} className="d-flex align-items-center gap-2">
                  <SetIcon
                    Icon={productDetailsIcons.returns}
                    size={18}
                    className="perk-icon"
                  />
                  <span>{product.returnPolicy || "30-Day Returns"}</span>
                </Col>
                <Col xs={6} className="d-flex align-items-center gap-2">
                  <SetIcon
                    Icon={productDetailsIcons.support}
                    size={18}
                    className="perk-icon"
                  />
                  <span>Lifetime Support</span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/*  Specifications, User Reviews, Q&A, Downloads */}
        <div className="tabs-section mb-5">
          <div className="tabs-header d-flex gap-4 border-bottom mb-4 overflow-auto">
            {[
              { id: "specs", label: "Specifications" },
              {
                id: "reviews",
                label: `User Reviews (${product.reviews?.length || 0})`,
              },
              { id: "qa", label: "Q&A" },
              { id: "downloads", label: "Downloads" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn border-0 bg-transparent pb-3 fw-semibold small text-nowrap ${
                  activeTab === tab.id ? "active" : "text-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1 (Specifications) */}
          {activeTab === "specs" && (
            <Row className="g-4">
              {/* Card 1 */}
              <Col xs={12} md={4}>
                <div className="spec-card rounded-4 p-4 h-100">
                  <h6 className="fw-bold text-dark mb-3 text-capitalize">
                    {product.category} Specs
                  </h6>
                  <div className="d-flex flex-column gap-3 small">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Brand</span>
                      <span className="fw-bold text-dark">
                        {product.brand || "ShopStream Pro"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Model SKU</span>
                      <span className="fw-bold text-dark">
                        {product.sku || "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Availability</span>
                      <span className="fw-bold text-dark">
                        {product.availabilityStatus || "In Stock"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Min Order Qty</span>
                      <span className="fw-bold text-dark">
                        {product.minimumOrderQuantity || 1} Unit(s)
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Card 2 */}
              <Col xs={12} md={4}>
                <div className="spec-card rounded-4 p-4 h-100">
                  <h6 className="fw-bold text-dark mb-3">Physical</h6>
                  <div className="d-flex flex-column gap-3 small">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Weight</span>
                      <span className="fw-bold text-dark">
                        {product.weight
                          ? `${product.weight * 100}g (${product.weight} oz)`
                          : "285g (9.8 oz)"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Width</span>
                      <span className="fw-bold text-dark">
                        {product.dimensions?.width || 18.5} cm
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Height</span>
                      <span className="fw-bold text-dark">
                        {product.dimensions?.height || 20.2} cm
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Depth</span>
                      <span className="fw-bold text-dark">
                        {product.dimensions?.depth || 8.4} cm
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Card 3 */}
              <Col xs={12} md={4}>
                <div className="spec-card rounded-4 p-4 h-100 d-flex flex-column">
                  <h6 className="fw-bold text-dark mb-2">In the Box</h6>
                  <p className="text-muted small mb-3">
                    Everything you need to start your professional journey
                    immediately.
                  </p>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {(product.tags?.length > 0
                      ? [...product.tags, "User Manual", "Warranty Card"]
                      : [
                          "Main Unit",
                          "Protective Case",
                          "Charging Cable",
                          "Manual",
                        ]
                    ).map((tag, i) => (
                      <span
                        key={i}
                        className="box-tag px-2 py-1 rounded-2 small fw-medium text-capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto text-center">
                    <img
                      src={product.thumbnail}
                      alt="In the box preview"
                      className="box-preview-img rounded-3 p-2 bg-white border object-fit-contain"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Tab 2: User Reviews */}
          {activeTab === "reviews" && (
            <Row className="g-4">
              {product.reviews?.length > 0 ? (
                product.reviews.map((rev, index) => (
                  <Col xs={12} md={4} key={index}>
                    <div className="spec-card rounded-4 p-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0 text-dark">
                          {rev.reviewerName}
                        </h6>
                        <div className="d-flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <SetIcon
                              key={s}
                              Icon={
                                s <= rev.rating
                                  ? productCardIcons.Star
                                  : productDetailsIcons.starEmpty
                              }
                              size={13}
                              className="star-green"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted small mb-2">{rev.comment}</p>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {new Date(rev.date).toLocaleDateString()}
                      </span>
                    </div>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <p className="text-muted">No reviews yet for this product.</p>
                </Col>
              )}
            </Row>
          )}

          {/* Tab 3 & 4: Q&A and Downloads */}
          {activeTab === "qa" && (
            <div className="spec-card rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-2">
                Frequently Asked Questions
              </h6>
              <p className="text-muted small mb-0">
                Have a question about <strong>{product.title}</strong>? Our
                support team responds within 24 hours. Warranty:{" "}
                {product.warrantyInformation}.
              </p>
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="spec-card rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-2">
                Product Manuals & Guides
              </h6>
              <p className="text-muted small mb-0">
                Quick Start Guide (PDF) and Official Warranty Documentation for
                SKU {product.sku}.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        {relatedProducts.length > 0 && (
          <div className="complete-setup-section pt-3">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h4 className="fw-bolder text-dark mb-1">
                  Complete Your Setup
                </h4>
                <p className="text-muted small mb-0">
                  Recommended products based on your interest.
                </p>
              </div>
              {/* View All Link */}
              <Link
                to={`/products?category=${product.category}`}
                className="main-color text-decoration-none fw-bold small d-flex align-items-center gap-1"
              >
                <span>View All</span>
                <SetIcon Icon={productDetailsIcons.arrowRight} size={16} />
              </Link>
            </div>

            <Row className="g-4">
              {relatedProducts.map((item, index) => (
                <Col xs={12} sm={6} lg={3} key={item.id}>
                  <Card className="setup-card border rounded-4 p-2 h-100">
                    <Link
                      to={`/products/${item.id}`}
                      className="setup-img-box rounded-3 p-3 text-center position-relative d-block"
                    >
                      {index === 0 && (
                        <span className="pro-choice-badge position-absolute">
                          PRO CHOICE
                        </span>
                      )}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="img-fluid setup-img object-fit-contain"
                      />
                    </Link>
                    <Card.Body className="px-2 pb-1 pt-3 d-flex flex-column">
                      <Link
                        to={`/products/${item.id}`}
                        className="fw-bold text-dark text-decoration-none text-truncate small mb-2"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bolder price-green">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(addToCart({ product: item, quantity: 1 }))
                          }
                          type="button"
                          className="setup-cart-btn rounded-circle border-0 d-flex align-items-center justify-content-center"
                        >
                          <SetIcon
                            Icon={productCardIcons.CartPlus}
                            size={15}
                            className="text-white"
                          />
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
}
