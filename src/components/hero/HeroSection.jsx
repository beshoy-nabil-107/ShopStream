import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HeroSection.scss";

import heroImage from "../../assets/images/hero-headphones.png";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center min-vh-75">
          {/* Left column */}
          <Col lg={6} className="mb-5 mb-lg-0">
            <span className="badge mb-3 px-3 py-2 rounded-pill fw-semibold">
              NEW SEASON ARRIVAL
            </span>
            <h1 className="display-4 fw-bolder mb-3 text-dark">
              Experience the Future of{" "}
              <span className="main-color">Innovation.</span>
            </h1>
            <p className="lead text-muted mb-4 pe-lg-5">
              Explore our curated selection of premium electronics designed to
              elevate your daily stream of life. Precision engineering meets
              minimalist design.
            </p>

            <div className="d-flex gap-3">
              <Button
                as={Link}
                to="/products"
                size="lg"
                className="bg-main-color text-white border-0 px-4 fw-semibold rounded-3"
              >
                Shop Electronics
              </Button>
              <Button
                as={Link}
                to="/categories"
                variant="outline-dark"
                size="lg"
                className="px-4 fw-semibold rounded-3"
              >
                View Collections
              </Button>
            </div>
          </Col>

          {/* Right column */}
          <Col lg={6} className="text-center position-relative image-container">
            {/* Accent blurs */}
            <div className="accent-blur top-right"></div>
            <div className="accent-blur bottom-left"></div>

            <img
              src={heroImage}
              alt="Premium Headphones"
              className="img-fluid hero-img drop-shadow position-relative rounded-3"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
