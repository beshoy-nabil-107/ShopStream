import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../store/slices/categorySlice";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Placeholder,
} from "react-bootstrap";
import {
  appLayoutIcons,
  categoriesPageIcons,
  productCardIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";

import "./Categories.scss";

// Filter groups
const GROUP_TABS = [
  { id: "all", label: "All Collections" },
  { id: "tech", label: "Electronics" },
  { id: "fashion", label: "Fashion & Style" },
  { id: "home", label: "Home & Living" },
  { id: "beauty", label: "Beauty & Care" },
  { id: "sports", label: "Sports & Auto" },
];

// Map category slug to icon, group, and subtitle
const getCategoryMeta = (slug = "") => {
  const s = slug.toLowerCase();

  if (s.includes("Phone") || s.includes("mobile") || s.includes("smartphones")) {
    return {
      icon: categoriesPageIcons.mobile,
      group: "tech",
      badge: "Popular",
      desc: "Latest flagship smartphones & mobile gear.",
    };
  }
  if (s.includes("laptop") || s.includes("tablet")) {
    return {
      icon: categoriesPageIcons.tech,
      group: "tech",
      badge: "Top Tech",
      desc: "High-performance laptops and tablets for work & play.",
    };
  }
  if (s.includes("watch") || s.includes("jewel")) {
    return {
      icon: categoriesPageIcons.watches,
      group: "fashion",
      badge: "Luxury",
      desc: "Precision timepieces and elegant jewelry pieces.",
    };
  }
  if (s.includes("sunglass")) {
    return {
      icon: categoriesPageIcons.sunglasses,
      group: "fashion",
      desc: "UV-protected designer eyewear and frames.",
    };
  }
  if (
    s.includes("shirt") ||
    s.includes("dress") ||
    s.includes("shoe") ||
    s.includes("bag") ||
    s.includes("top")
  ) {
    return {
      icon: categoriesPageIcons.fashion,
      group: "fashion",
      desc: "Curated everyday apparel, footwear, and handbags.",
    };
  }
  if (s.includes("beauty") || s.includes("skin") || s.includes("fragrance")) {
    return {
      icon: categoriesPageIcons.beauty,
      group: "beauty",
      badge: "Trending",
      desc: "Premium skincare, cosmetics, and signature scents.",
    };
  }
  if (s.includes("grocer")) {
    return {
      icon: categoriesPageIcons.groceries,
      group: "home",
      desc: "Daily essentials, fresh pantry items, and gourmet goods.",
    };
  }
  if (s.includes("furniture") || s.includes("home") || s.includes("kitchen")) {
    return {
      icon: categoriesPageIcons.home,
      group: "home",
      desc: "Modern furniture, kitchenware, and interior accents.",
    };
  }
  if (s.includes("sport") || s.includes("vehicle") || s.includes("motorcycle")) {
    return {
      icon: categoriesPageIcons.sports,
      group: "sports",
      desc: "Pro athletic gear, outdoor equipment, and auto parts.",
    };
  }

  return {
    icon: categoriesPageIcons.all,
    group: "other",
    desc: "Explore top-rated products in this collection.",
  };
};

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector(
    (store) => store.categories
  );

  // Local filter states
  const [activeGroup, setActiveGroup] = useState("all");
  const [filterText, setFilterText] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, categories.length]);

  // Format and filter categories
  const formattedCategories = useMemo(() => {
    return categories.map((cat) => {
      const name = cat.name;
      const slug = cat.slug;
      const meta = getCategoryMeta(slug);

      return { name, slug, ...meta };
    });
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return formattedCategories.filter((cat) => {
      const matchesGroup =
        activeGroup === "all" || cat.group === activeGroup;
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(filterText.trim().toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [formattedCategories, activeGroup, filterText]);

  const Skeletons = Array.from({ length: 8 });

  return (
    <section className="categories-page py-4 py-lg-5">
      <Container>
        {/* Page Hero Header */}
        <div className="categories-hero rounded-4 p-4 p-lg-5 mb-4 text-center position-relative overflow-hidden">
          <span className="hero-badge px-3 py-1 rounded-pill fw-bold d-inline-block mb-3">
            CURATED COLLECTIONS
          </span>
          <h1 className="fw-bolder text-dark mb-2">Browse by Category</h1>
          <p className="text-muted mx-auto mb-4 hero-subtitle">
            Discover our handpicked departments tailored to your lifestyle, from
            pro-grade electronics to modern home essentials.
          </p>

          {/* Quick Category Filter Input */}
          <div className="category-search-box mx-auto d-flex align-items-center bg-white rounded-pill px-3 py-2 shadow-sm border">
            <SetIcon
              Icon={appLayoutIcons.Search}
              size={18}
              color="#64748b"
            />
            <Form.Control
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Find a category (e.g. Laptops, Watches, Skincare)..."
              className="border-0 bg-transparent shadow-none ms-2 small"
            />
          </div>
        </div>

        {/* Group Filter Tabs & Counter */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="group-tabs d-flex align-items-center gap-2 overflow-auto pb-2 pb-md-0">
            {GROUP_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGroup(tab.id)}
                className={`group-tab-btn rounded-pill px-3 py-2 border-0 fw-semibold small text-nowrap ${
                  activeGroup === tab.id ? "active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-muted small fw-medium text-nowrap">
            Showing{" "}
            <strong className="text-dark">{filteredCategories.length}</strong>{" "}
            Departments
          </span>
        </div>

        {/* Error State */}
        {error && (
          <Alert
            variant="danger"
            className="text-center d-flex align-items-center justify-content-center gap-2 rounded-4"
          >
            <SetIcon Icon={productCardIcons.errorOutline} size={24} />
            <span>{error}</span>
          </Alert>
        )}

        {/* Categories Grid */}
        <Row className="g-3 g-lg-4 mb-5">
          {isLoading ? (
            Skeletons.map((_, idx) => (
              <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                <Card className="category-card border rounded-4 p-4 h-100 bg-white">
                  <Placeholder animation="glow" className="mb-3">
                    <Placeholder className="skeleton-icon rounded-3" />
                  </Placeholder>
                  <Placeholder as={Card.Title} animation="glow" className="mb-2">
                    <Placeholder xs={7} className="rounded-2" />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow" className="mb-4">
                    <Placeholder xs={10} className="rounded-2" />
                    <Placeholder xs={6} className="rounded-2" />
                  </Placeholder>
                  <Placeholder animation="glow" className="mt-auto">
                    <Placeholder xs={5} className="rounded-2" />
                  </Placeholder>
                </Card>
              </Col>
            ))
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <Col xs={12} sm={6} md={4} lg={3} key={cat.slug}>
                <Card
                  as={Link}
                  to={`/products?category=${cat.slug}`}
                  className="category-card border rounded-4 p-4 h-100 bg-white text-decoration-none d-flex flex-column"
                >
                  {/* Card Top: Icon + Badge */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="cat-icon-wrapper rounded-3 d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={cat.icon}
                        size={24}
                        className="cat-icon main-color"
                      />
                    </div>

                    {cat.badge && (
                      <span className="cat-badge px-2 py-1 rounded-pill fw-bold">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Category Name & Description */}
                  <h5 className="fw-bold text-dark text-capitalize mb-2 cat-title">
                    {cat.name.replace(/-/g, " ")}
                  </h5>
                  <p className="text-muted small mb-4 flex-grow-1">
                    {cat.desc}
                  </p>

                  {/* Footer Link */}
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top">
                    <span className="explore-text small fw-bold main-color">
                      Explore Products
                    </span>
                    <span className="arrow-circle rounded-circle d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={productDetailsIcons.arrowRight}
                        size={15}
                        className="arrow-icon main-color"
                      />
                    </span>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center py-5 bg-white rounded-4 border my-2">
                <h5 className="fw-bold text-dark mb-2">
                  No matching categories
                </h5>
                <p className="text-muted small mb-3">
                  Try clearing your search or selecting "All Collections".
                </p>
                <Button
                  onClick={() => {
                    setActiveGroup("all");
                    setFilterText("");
                  }}
                  className="bg-main-color border-0 px-4 py-2 rounded-3 fw-semibold small"
                >
                  Reset View
                </Button>
              </div>
            </Col>
          )}
        </Row>

        {/* Bottom Banner */}
        <div className="all-products-banner rounded-4 p-4 p-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          <div>
            <h4 className="fw-bolder text-dark mb-1">
              Want to browse everything at once?
            </h4>
            <p className="text-muted small mb-0">
              View our full catalog with advanced price, brand, and rating
              filters.
            </p>
          </div>
          <Button
            as={Link}
            to="/products"
            className="bg-main-color border-0 px-4 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2 flex-shrink-0 shadow-sm"
          >
            <span>View Full Catalog</span>
            <SetIcon
              Icon={productDetailsIcons.arrowRight}
              size={18}
              color="#ffffff"
            />
          </Button>
        </div>
      </Container>
    </section>
  );
}