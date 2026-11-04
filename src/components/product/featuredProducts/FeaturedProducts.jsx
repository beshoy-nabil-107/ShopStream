import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../../../store/slices/productSlice";
import { Container, Alert, Card, Placeholder } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import ProductCard from "../productCard/ProductCard";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "./FeaturedProducts.scss";
import { productCardIcons, SetIcon } from "../../../assets/icons";

export default function FeaturedProducts() {
  const dispatch = useDispatch();

  const SkeletonElements = Array.from({ length: 4 });

  // Redux state
  const { featuredProducts, isLoading, error } = useSelector(
    (store) => store.products,
  );

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <section className="featured-products py-5">
      <Container>
        {/* Section header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-0">Featured Products</h2>
        </div>

        {error ? ( // Show error message if there's an error
          <Alert
            variant="danger"
            className="text-center fs-5 d-flex align-items-center justify-content-center gap-2"
          >
            <SetIcon
              Icon={productCardIcons.errorOutline}
              size={34}
              className="me-2"
            />
            <span>{error}</span>
          </Alert>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 2000, disableOnInteraction: true }}
            navigation
            breakpoints={{
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            className="px-2 py-3"
          >
            {isLoading // Show skeleton while loading
              ? SkeletonElements.map((_, index) => (
                  <SwiperSlide key={index}>
                    <Card className="product-card-skeleton">
                      {/* Image */}
                      <div className="skeleton-img-container">
                        <Placeholder
                          animation="glow"
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                        >
                          <Placeholder className="skeleton-img" />
                        </Placeholder>
                      </div>

                      <Card.Body className="d-flex flex-column gap-2 skeleton-body">
                        {/* Category */}
                        <Placeholder
                          as={Card.Text}
                          animation="glow"
                          className="mb-1"
                        >
                          <Placeholder xs={5} className="skeleton-category" />
                        </Placeholder>

                        {/* Title */}
                        <Placeholder
                          as={Card.Title}
                          animation="glow"
                          className="mb-2"
                        >
                          <Placeholder xs={9} className="skeleton-title" />
                        </Placeholder>

                        {/* Rating */}
                        <Placeholder
                          as={Card.Text}
                          animation="glow"
                          className="mb-3"
                        >
                          <Placeholder xs={3} className="skeleton-rating" />
                        </Placeholder>

                        {/* Price & Cart Button */}
                        <div className="d-flex justify-content-between align-items-center mt-auto skeleton-footer">
                          <Placeholder
                            as="div"
                            animation="glow"
                            className="w-50"
                          >
                            <Placeholder xs={6} className="skeleton-price" />
                          </Placeholder>

                          <Placeholder animation="glow">
                            <Placeholder className="skeleton-cart-btn" />
                          </Placeholder>
                        </div>
                      </Card.Body>
                    </Card>{" "}
                  </SwiperSlide>
                ))
              : featuredProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
