import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  checkoutPageIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";

import "./Checkout.scss";

export default function Checkout() {
  const go = useNavigate();

  const { items, totalPrice } = useSelector((store) => store.cart);
  const { user } = useSelector((store) => store.auth);

  // Step & payment method states
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Redirect if cart is empty
  if (items.length === 0) {
    return <Navigate to="/products" replace />;
  }

  // Order summary calculations (Tax 12%)
  const estimatedTax = Number((totalPrice * 0.12).toFixed(2));
  const finalTotal = Number((totalPrice + estimatedTax).toFixed(2));

  // Switch payment method
  const handleSelectPayment = (method) => {
    setPaymentMethod(method);
    setCurrentStep(method === "paypal" ? 3 : 2);
  };

  // Submit order and go to Confirmation page
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const orderData = {
      items: [...items],
      subtotal: totalPrice,
      tax: estimatedTax,
      total: finalTotal,
    };

    go("/confirmation", { state: orderData, replace: true });
  };

  return (
    <section className="checkout-page py-4 py-lg-5">
      <Container>
        {/* Page Header */}
        <div className="mb-4">
          <h2 className="fw-bolder text-dark mb-1">Secure Checkout</h2>
          <p className="text-muted small mb-0">
            Complete your order with ShopStream's verified protection.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="steps-bar d-flex align-items-center gap-2 gap-sm-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`step-badge rounded-circle d-flex align-items-center justify-content-center fw-bold small ${
                currentStep >= 1 ? "active" : ""
              }`}
            >
              1
            </span>
            <span
              className={`small fw-semibold ${
                currentStep >= 1 ? "main-color" : "text-muted"
              }`}
            >
              Shipping
            </span>
          </div>

          <div
            className={`step-Connector ${currentStep >= 2 ? "active" : ""}`}
          />

          <div className="d-flex align-items-center gap-2">
            <span
              className={`step-badge rounded-circle d-flex align-items-center justify-content-center fw-bold small ${
                currentStep >= 2 ? "active" : ""
              }`}
            >
              2
            </span>
            <span
              className={`small fw-semibold ${
                currentStep >= 2 ? "main-color" : "text-muted"
              }`}
            >
              Payment
            </span>
          </div>

          <div
            className={`step-Connector ${currentStep >= 3 ? "active" : ""}`}
          />

          <div className="d-flex align-items-center gap-2">
            <span
              className={`step-badge rounded-circle d-flex align-items-center justify-content-center fw-bold small ${
                currentStep >= 3 ? "active" : ""
              }`}
            >
              3
            </span>
            <span
              className={`small fw-semibold ${
                currentStep >= 3 ? "main-color" : "text-muted"
              }`}
            >
              Review
            </span>
          </div>
        </div>

        <Form onSubmit={handlePlaceOrder}>
          <Row className="g-4 align-items-start">
            {/* Left Column: Forms */}
            <Col xs={12} lg={8}>
              {/* 1. Shipping Information */}
              <Card
                onFocus={() => setCurrentStep(1)}
                className={`checkout-card border rounded-4 p-4 mb-4 bg-white ${
                  currentStep === 1 ? "active-step-card" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <SetIcon
                    Icon={productDetailsIcons.delivery}
                    size={20}
                    className="main-color"
                  />
                  <h5 className="fw-bold text-dark mb-0">
                    Shipping Information
                  </h5>
                </div>

                <Row className="g-3">
                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      First Name
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      defaultValue={user?.firstName || ""}
                      placeholder="John"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      Last Name
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      defaultValue={user?.lastName || ""}
                      placeholder="Doe"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      Address
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="123 Commerce Way"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12} sm={4}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      City
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="New York"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12} sm={4}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      Zip Code
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="10001"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12} sm={4}>
                    <Form.Label className="small fw-semibold text-dark mb-1">
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="checkout-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>
                </Row>
              </Card>

              {/* 2. Payment Method */}
              <Card
                onFocus={() => {
                  if (currentStep < 2) setCurrentStep(2);
                }}
                className={`checkout-card border rounded-4 p-4 mb-4 bg-white ${
                  currentStep >= 2 ? "active-step-card" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <SetIcon
                    Icon={checkoutPageIcons.card}
                    size={20}
                    className="main-color"
                  />
                  <h5 className="fw-bold text-dark mb-0">Payment Method</h5>
                </div>

                {/* Credit Card Option */}
                <div
                  onClick={() => handleSelectPayment("card")}
                  className={`payment-option-box rounded-3 p-3 mb-3 ${
                    paymentMethod === "card" ? "selected" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="radio"
                      id="pay-card"
                      name="paymentMethod"
                      label="Credit or Debit Card"
                      checked={paymentMethod === "card"}
                      onChange={() => handleSelectPayment("card")}
                      className="fw-bold small text-dark payment-radio"
                    />
                    <SetIcon
                      Icon={checkoutPageIcons.card}
                      size={18}
                      color="#475569"
                    />
                  </div>

                  {paymentMethod === "card" && (
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Label className="small fw-semibold text-dark mb-1">
                          Card Number
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="checkout-input rounded-3 py-2 small shadow-none"
                        />
                      </Col>

                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-dark mb-1">
                          Expiry Date
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="MM/YY"
                          className="checkout-input rounded-3 py-2 small shadow-none"
                        />
                      </Col>

                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-dark mb-1">
                          CVC
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="123"
                          onChange={(e) => {
                            if (e.target.value.trim().length >= 3) {
                              setCurrentStep(3);
                            }
                          }}
                          className="checkout-input rounded-3 py-2 small shadow-none"
                        />
                      </Col>
                    </Row>
                  )}
                </div>

                {/* PayPal Option */}
                <div
                  onClick={() => handleSelectPayment("paypal")}
                  className={`payment-option-box rounded-3 p-3 d-flex justify-content-between align-items-center ${
                    paymentMethod === "paypal" ? "selected" : ""
                  }`}
                >
                  <Form.Check
                    type="radio"
                    id="pay-paypal"
                    name="paymentMethod"
                    label="PayPal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => handleSelectPayment("paypal")}
                    className="fw-bold small text-dark payment-radio"
                  />
                  <SetIcon
                    Icon={checkoutPageIcons.paypal}
                    size={18}
                    color="#475569"
                  />
                </div>
              </Card>

              {/* Place Order Button */}
              <div className="text-end">
                <Button
                  type="submit"
                  className="place-order-btn bg-main-color border-0 rounded-3 px-5 py-3 fw-semibold small d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <span>Place Order</span>
                  <SetIcon
                    Icon={productDetailsIcons.arrowRight}
                    size={16}
                    color="#ffffff"
                  />
                </Button>
              </div>
            </Col>

            {/* Right Column: Order Summary */}
            <Col xs={12} lg={4} className="summary-sticky">
              <div className="order-summary-panel rounded-4 p-4">
                <h5 className="fw-bolder text-dark mb-4">Order Summary</h5>

                {/* Cart Items */}
                <div className="d-flex flex-column gap-3 mb-4 pb-3 border-bottom">
                  {items.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3">
                      <div className="summary-img-box rounded-3 p-1 d-flex align-items-center justify-content-center flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="img-fluid object-fit-contain"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="fw-bold text-dark small mb-0 text-truncate">
                          {item.title}
                        </h6>
                        <span
                          className="text-muted d-block mb-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Qty: {item.quantity}
                        </span>
                        <span className="fw-bolder main-color small">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="d-flex flex-column gap-2 small mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold text-dark">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Shipping</span>
                    <span className="fw-bold free-text">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Tax (Est.)</span>
                    <span className="fw-semibold text-dark">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bolder text-dark fs-6">Total</span>
                  <span className="fw-bolder main-color fs-4">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Promo Code */}
                <div className="d-flex gap-2 mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Promo Code"
                    className="bg-white border rounded-3 small shadow-none py-2"
                  />
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="promo-apply-btn rounded-3 px-3 fw-semibold small"
                  >
                    Apply
                  </Button>
                </div>

                {/* Security Perks */}
                <div className="security-perks-box rounded-3 p-3 d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <SetIcon
                      Icon={productDetailsIcons.warranty}
                      size={15}
                      color="#00714d"
                    />
                    <span className="perk-text">256-bit SSL Secure Payment</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <SetIcon
                      Icon={productDetailsIcons.returns}
                      size={15}
                      color="#00714d"
                    />
                    <span className="perk-text">
                      30-Day Money Back Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
}