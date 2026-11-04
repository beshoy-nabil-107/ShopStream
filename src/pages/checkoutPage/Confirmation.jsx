import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { clearCart } from "../../store/slices/cartSlice";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  checkoutPageIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";

import "./Checkout.scss";

export default function Confirmation() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);

  // Order summary passed from Checkout page
  const orderData = location.state;

  // Clear cart and scroll to top on load
  useEffect(() => {
    if (orderData) {
      dispatch(clearCart());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, orderData]);

  // Redirect if accessed directly without placing an order
  if (!orderData) {
    return <Navigate to="/products" replace />;
  }

  const { items, subtotal, tax, total } = orderData;

  return (
    <section className="checkout-page confirmed-view py-5">
      <Container>
        {/* Confirmation Header */}
        <div className="text-center mb-5">
          <div className="success-circle-outer mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
            <div className="success-circle-inner rounded-circle d-flex align-items-center justify-content-center">
              <SetIcon
                Icon={checkoutPageIcons.check}
                size={22}
                color="#ffffff"
              />
            </div>
          </div>

          <h2 className="fw-bolder text-dark mb-2">Order #12345 Confirmed</h2>
          <p className="text-muted small mb-0">
            Woohoo! Your order has been placed successfully. We've sent a
            confirmation
            <br className="d-none d-sm-inline" /> email to{" "}
            <span className="main-color fw-semibold">
              {user?.email || "alex.design@example.com"}
            </span>
            .
          </p>
        </div>

        <Row className="g-4 align-items-start mb-5">
          {/* Left Column: Estimated Delivery */}
          <Col xs={12} lg={8}>
            <Card className="delivery-status-card border rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="fw-bold text-dark mb-1">Estimated Delivery</h5>
                  <span className="delivery-date fw-bold small">
                    Tuesday, October 24th, 2024
                  </span>
                </div>
                <SetIcon
                  Icon={productDetailsIcons.delivery}
                  size={24}
                  color="#475569"
                />
              </div>

              {/* Delivery Tracker */}
              <div className="delivery-tracker d-flex align-items-center justify-content-between my-4 px-2 px-sm-4">
                <div className="tracker-node text-center">
                  <div className="node-circle active mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center">
                    <SetIcon
                      Icon={checkoutPageIcons.check}
                      size={14}
                      color="#ffffff"
                    />
                  </div>
                  <span className="fw-bold text-dark d-block node-label">
                    Placed
                  </span>
                </div>

                <div className="tracker-line active-line flex-grow-1 mx-2" />

                <div className="tracker-node text-center">
                  <div className="node-circle mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center">
                    <SetIcon
                      Icon={checkoutPageIcons.package}
                      size={14}
                      color="#64748b"
                    />
                  </div>
                  <span className="text-muted d-block node-label">
                    Processing
                  </span>
                </div>

                <div className="tracker-line flex-grow-1 mx-2" />

                <div className="tracker-node text-center">
                  <div className="node-circle mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center">
                    <SetIcon
                      Icon={productDetailsIcons.delivery}
                      size={14}
                      color="#64748b"
                    />
                  </div>
                  <span className="text-muted d-block node-label">Shipped</span>
                </div>
              </div>

              <hr className="text-muted opacity-25 my-4" />

              {/* Shipping Info */}
              <Row className="g-3 small">
                <Col xs={12} sm={6}>
                  <span className="text-muted fw-bold d-block mb-1 info-heading">
                    SHIPPING ADDRESS
                  </span>
                  <p className="text-dark mb-0 lh-base">
                    Alex Johnston
                    <br />
                    123 Indigo Way, Suite 404
                    <br />
                    San Francisco, CA 94103
                  </p>
                </Col>
                <Col xs={12} sm={6}>
                  <span className="text-muted fw-bold d-block mb-1 info-heading">
                    SHIPPING METHOD
                  </span>
                  <p className="text-dark mb-0">
                    Express Delivery (2-3 Business Days)
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Order Summary */}
          <Col xs={12} lg={4}>
            <div className="order-summary-panel rounded-4 p-4">
              <h5 className="fw-bolder text-dark mb-4">Order Summary</h5>

              {/* Ordered Items */}
              <div className="d-flex flex-column gap-3 mb-4 pb-3 border-bottom">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between gap-3"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="summary-img-box rounded-3 p-1 d-flex align-items-center justify-content-center flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="img-fluid object-fit-contain"
                        />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark small mb-1 text-truncate summary-item-title">
                          {item.title}
                        </h6>
                        <span
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Qty: {item.quantity}
                          {item.selectedColor ? ` • ${item.selectedColor}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="fw-bold text-dark small">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="d-flex flex-column gap-2 small mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold text-dark">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold free-text">FREE</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Tax</span>
                  <span className="fw-semibold text-dark">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-dark fs-6">Total</span>
                <span className="fw-bolder main-color fs-5">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-5">
          <Button
            as={Link}
            to="/products"
            className="bg-main-color border-0 px-4 py-2 rounded-3 fw-semibold small action-btn"
          >
            Continue Shopping
          </Button>
          <Button
            as={Link}
            to="/profile"
            variant="outline-primary"
            className="bg-white px-4 py-2 rounded-3 fw-semibold small action-btn outline-action-btn"
          >
            View Order History
          </Button>
        </div>

        {/* Support Banner */}
        <div className="support-banner rounded-4 p-3 p-md-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="help-icon-circle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
              <SetIcon
                Icon={checkoutPageIcons.help}
                size={20}
                color="#00714d"
              />
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0 small">
                Need help with your order?
              </h6>
              <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                Our support team is available 24/7. Reference order #12345 when
                contacting us.
              </span>
            </div>
          </div>
          <Button className="support-btn border-0 rounded-pill px-4 py-2 fw-s semibold small flex-shrink-0">
            Contact Support
          </Button>
        </div>
      </Container>
    </section>
  );
}
