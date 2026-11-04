import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { FiGlobe, FiMail } from "react-icons/fi";
import "./Footer.scss";
import { SetIcon, usersPageIcons } from "../../../assets/icons";

export default function Footer() {
  return (
    <footer className="app-footer border-top p-2 p-md-3 mt-auto ">
      <Container
        fluid
        className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
      >
        {/* Left Side: Brand & Copyright */}
        <div className="d-flex flex-column justify-content-center align-items-center gap-1">
          <Link
            to="/"
            className="footer-brand text-decoration-none fw-bolder fs-5"
          >
            ShopStream
          </Link>
          <span className="text-muted small">
            © {new Date().getFullYear()} ShopStream Inc. All rights reserved.
          </span>
        </div>

        {/* Middle Links */}
        <div className="footer-links d-flex flex-wrap align-items-center gap-4 small fw-medium">
          <Link to="#" className="text-decoration-none text-secondary">
            Privacy Policy
          </Link>
          <Link to="#" className="text-decoration-none text-secondary">
            Terms of Service
          </Link>
          <Link to="#" className="text-decoration-none text-secondary">
            Contact Us
          </Link>
          <Link to="#" className="text-decoration-none text-secondary">
            Shipping Info
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="footer-icons d-flex align-items-center gap-3 text-secondary">
          <span className="icon-wrapper" role="button">
            <FiGlobe size={18} />
          </span>
          <span className="icon-wrapper" role="button">
            <FiMail size={18} />
          </span>
          <Button
            as={Link}
            to="/dashboard"
            size="sm"
            className="footer-dashboard-btn bg-main-color border-0 rounded-3 px-3 py-1 fw-semibold small d-flex align-items-center gap-1 text-white text-decoration-none"
          >
            <SetIcon Icon={usersPageIcons.shield} size={14} color="#ffffff" />
            <span>Dashboard</span>
          </Button>
        </div>
      </Container>
    </footer>
  );
}
