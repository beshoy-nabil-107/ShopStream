import HeroSection from "../components/hero/HeroSection";
import CategoriesSection from "../components/categories/CategoriesSection";
import FeaturedProducts from "../components/product/featuredProducts/FeaturedProducts";
import "./Home.scss";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />

      {/* Stay Ahead of the Stream Banner */}
      <Container className="my-5">
        <div className="newsletter-banner rounded-4 p-4 p-lg-5 position-relative overflow-hidden text-white">
          {/* Background decorative dashed rays */}
          <div className="banner-rays position-absolute"></div>

          <Row className="position-relative z-1 align-items-center">
            <Col xs={12} lg={8}>
              <h2 className="fw-bolder mb-2 text-white">
                Stay Ahead of the Stream
              </h2>
              <p className="text-white-50 mb-4 banner-desc">
                Join our inner circle for exclusive early access to product
                launches, seasonal deals, and curated tech trends. No spam, just
                high-quality updates.
              </p>

              {/* Form Input & Button */}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.target.reset();
                }}
                className="d-flex flex-column flex-sm-row gap-2"
              >
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input bg-transparent text-white border-0 shadow-none px-3 py-2 rounded-3"
                />
                <Button
                  type="submit"
                  className="join-now-btn border-0 fw-semibold px-4 py-2 rounded-3 text-nowrap"
                >
                  Join Now
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
