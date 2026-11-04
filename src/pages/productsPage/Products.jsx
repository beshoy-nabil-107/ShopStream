import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchAllProducts } from "../../store/slices/productSlice";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Placeholder,
  Spinner,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode, Scrollbar } from "swiper/modules";
import ProductCard from "../../components/product/productCard/ProductCard";
import {
  productCardIcons,
  productsPageIcons,
  SetIcon,
} from "../../assets/icons";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import "./Products.scss";

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination config
  const limit = 30;
  const [currentPage, setCurrentPage] = useState(1);

  // URL params
  const searchQuery = searchParams.get("search") || "";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [maxPriceLimit, setMaxPriceLimit] = useState(3000);
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  // Redux states
  const {
    categories,
    isLoading: isCatLoading,
    error: catError,
  } = useSelector((store) => store.categories);

  const {
    allProducts,
    total,
    isLoading: isProdLoading,
    error: prodError,
  } = useSelector((store) => store.products);

  // Sync URL params with state
  useEffect(() => {
    const urlCat = searchParams.get("category") || "all";
    setSelectedCategory(urlCat);
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Fetch products on page, category, search, or sort change
  useEffect(() => {
    const skip = (currentPage - 1) * limit;

    let sortBy = "";
    let order = "";
    if (sortOption === "price-low") {
      sortBy = "price";
      order = "asc";
    } else if (sortOption === "price-high") {
      sortBy = "price";
      order = "desc";
    } else if (sortOption === "rating") {
      sortBy = "rating";
      order = "desc";
    }

    dispatch(
      fetchAllProducts({
        limit,
        skip,
        category: selectedCategory === "all" ? "" : selectedCategory,
        searchQuery,
        sortBy,
        order,
      })
    );
  }, [dispatch, currentPage, selectedCategory, searchQuery, sortOption]);

  // Update dynamic max price
  useEffect(() => {
    if (allProducts.length > 0) {
      const highestPrice = Math.max(...allProducts.map((p) => p.price));
      const roundedMax = Math.ceil(highestPrice / 50) * 50 || 1000;
      setMaxPriceLimit(roundedMax);
      setPriceRange(roundedMax);
    }
  }, [allProducts]);

  // Extract unique brands
  const uniqueBrands = useMemo(() => {
    const brands = allProducts.map((p) => p.brand).filter(Boolean);
    return [...new Set(brands)];
  }, [allProducts]);

  // Apply secondary filters (Price, Rating, Brand)
  const displayedProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesPrice = product.price <= priceRange;
      const matchesRating =
        selectedRating === 0 || Math.round(product.rating) >= selectedRating;
      const matchesBrand =
        selectedBrand === "all" || product.brand === selectedBrand;

      return matchesPrice && matchesRating && matchesBrand;
    });
  }, [allProducts, priceRange, selectedRating, selectedBrand]);

  // Dynamic total pages
  const totalPages = Math.ceil(total / limit);

  // Handlers
  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
    setSelectedBrand("all");
    setSelectedRating(0);
    if (catSlug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: catSlug });
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchParams({});
    setPriceRange(maxPriceLimit);
    setSelectedRating(0);
    setSelectedBrand("all");
    setSortOption("default");
    setCurrentPage(1);
  };

  const Skeletons = Array.from({ length: 6 });

  return (
    <section className="products-page py-4 py-lg-5">
      <Container>
        <Row className="g-4 align-items-start">
          {/* Sidebar Filters */}
          <Col xs={12} md={4} lg={3} className="sidebar-col">
            <aside className="products-sidebar p-3 p-xl-4 shadow-sm rounded-4 bg-white">
              {/* Category Filter */}
              <div className="filter-group mb-3 pb-3 border-bottom">
                <h6 className="filter-title fw-bolder mb-3">CATEGORY</h6>
                {catError ? (
                  <div className="text-danger small">{catError}</div>
                ) : isCatLoading ? (
                  <div className="text-center py-3">
                    <Spinner
                      animation="border"
                      size="sm"
                      className="main-color"
                    />
                  </div>
                ) : (
                  <div className="categories-swiper-container">
                    <Swiper
                      direction="vertical"
                      slidesPerView="auto"
                      freeMode={true}
                      scrollbar={{ draggable: true }}
                      mousewheel={{
                        forceToAxis: true,
                        releaseOnEdges: true,
                      }}
                      modules={[FreeMode, Mousewheel, Scrollbar]}
                      className="categories-swiper h-100 pe-2"
                    >
                      <SwiperSlide className="category-slide">
                        <Form.Check
                          type="radio"
                          id="cat-all"
                          name="category"
                          label="All Categories"
                          checked={selectedCategory === "all"}
                          onChange={() => handleCategoryChange("all")}
                          className="custom-radio py-1"
                        />
                      </SwiperSlide>
                      {categories.map((category, index) => {
                        const catName =
                          typeof category === "object"
                            ? category.name
                            : category;
                        const catSlug =
                          typeof category === "object"
                            ? category.slug
                            : category;
                        return (
                          <SwiperSlide key={index} className="category-slide">
                            <Form.Check
                              type="radio"
                              id={`cat-${catSlug}`}
                              name="category"
                              label={catName}
                              checked={selectedCategory === catSlug}
                              onChange={() => handleCategoryChange(catSlug)}
                              className="custom-radio py-1 text-capitalize"
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="filter-group mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="filter-title fw-bolder mb-0">PRICE RANGE</h6>
                  <span className="badge bg-light main-color fw-bold fs-6 border">
                    ${priceRange}
                  </span>
                </div>
                <Form.Range
                  min={0}
                  max={maxPriceLimit}
                  step={10}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="custom-range"
                />
                <div className="d-flex justify-content-between text-muted small">
                  <span>$0</span>
                  <span>${maxPriceLimit}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-group mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="filter-title fw-bolder mb-0">RATING</h6>
                  {selectedRating > 0 && (
                    <span className="text-muted small fw-medium">
                      {selectedRating} Stars & Up
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2 interactive-rating py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      className="star-icon"
                      color={
                        star <= (hoverRating || selectedRating)
                          ? "#FFC107"
                          : "#E2E8F0"
                      }
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setSelectedRating(selectedRating === star ? 0 : star)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-group mb-4">
                <h6 className="filter-title fw-bolder mb-2">BRAND</h6>
                <Form.Select
                  className="custom-select shadow-none"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="all">
                    All Brands ({uniqueBrands.length})
                  </option>
                  {uniqueBrands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline-danger"
                onClick={handleClearFilters}
                className="w-100 fw-semibold rounded-3 py-2"
              >
                Clear All Filters
              </Button>
            </aside>
          </Col>

          {/* Main Content Area */}
          <Col xs={12} md={8} lg={9}>
            {/* Header: Count & Sorting */}
            <div className="products-topbar d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 bg-white shadow-sm p-3 rounded-4 gap-2">
              <div className="text-muted fw-medium">
                Showing{" "}
                <span className="text-dark fw-bolder">
                  {displayedProducts.length}
                </span>{" "}
                of <span className="text-dark fw-bold">{total}</span> Products
                {searchQuery && (
                  <span className="ms-1">
                    for <strong className="text-dark">"{searchQuery}"</strong>
                  </span>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="fw-medium text-nowrap text-muted small">
                  Sort by:
                </span>
                <Form.Select
                  className="custom-select sort-select shadow-none border-0 bg-light rounded-3 fw-semibold"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </Form.Select>
              </div>
            </div>

            {/* Error State */}
            {prodError && (
              <Alert
                variant="danger"
                className="text-center d-flex align-items-center justify-content-center gap-2 rounded-4"
              >
                <SetIcon Icon={productCardIcons.errorOutline} size={24} />
                <span>{prodError}</span>
              </Alert>
            )}

            {/* Product Grid */}
            <Row className="g-3 g-xl-4">
              {isProdLoading ? (
                Skeletons.map((_, index) => (
                  <Col xs={12} sm={6} lg={4} key={index}>
                    <Card className="product-card-skeleton border-0 rounded-4 shadow-sm h-100">
                      <div className="skeleton-img-container">
                        <Placeholder animation="glow" className="w-100 h-100">
                          <Placeholder className="skeleton-img" />
                        </Placeholder>
                      </div>
                      <Card.Body className="d-flex flex-column gap-2 skeleton-body">
                        <Placeholder
                          as={Card.Text}
                          animation="glow"
                          className="mb-1"
                        >
                          <Placeholder xs={5} className="skeleton-category" />
                        </Placeholder>
                        <Placeholder
                          as={Card.Title}
                          animation="glow"
                          className="mb-2"
                        >
                          <Placeholder xs={9} className="skeleton-title" />
                        </Placeholder>
                        <Placeholder
                          as={Card.Text}
                          animation="glow"
                          className="mb-3"
                        >
                          <Placeholder xs={4} className="skeleton-rating" />
                        </Placeholder>
                        <div className="mt-auto d-flex justify-content-between align-items-center skeleton-footer">
                          <Placeholder
                            as="div"
                            animation="glow"
                            className="w-50"
                          >
                            <Placeholder xs={7} className="skeleton-price" />
                          </Placeholder>
                          <Placeholder animation="glow">
                            <Placeholder className="skeleton-cart-btn" />
                          </Placeholder>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <Col xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard product={product} addToCartText={true} />
                  </Col>
                ))
              ) : prodError ? null : (
                <Col xs={12}>
                  <div className="text-center py-5 bg-white rounded-4 shadow-sm my-2">
                    <h4 className="text-dark fw-bold mb-2">
                      No products found
                    </h4>
                    <p className="text-muted mb-4">
                      Try adjusting your filters or clearing them.
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="bg-main-color border-0 px-4 py-2 rounded-3 fw-semibold"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Col>
              )}
            </Row>

            {/* Pagination Controls */}
            {!isProdLoading && totalPages > 1 && (
              <div className="pagination-wrapper d-flex justify-content-center align-items-center gap-2 mt-5">
                <Button
                  variant="light"
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <SetIcon Icon={productsPageIcons.prev} size={14} />
                </Button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant="light"
                      className={`page-btn fw-bold ${
                        currentPage === pageNum ? "active-page" : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="light"
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <SetIcon Icon={productsPageIcons.next} size={14} />
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}