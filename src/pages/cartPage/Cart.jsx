import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  cartPageIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";

import "./Cart.scss";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((store) => store.cart);

  // Order summary calculations Tax -> 12%
  const estimatedTax = Number((totalPrice * 0.12).toFixed(2));
  const finalTotal = Number((totalPrice + estimatedTax).toFixed(2));

  // Empty Cart View
  if (items.length === 0) {
    return (
      <section className="cart-page empty-cart-view d-flex align-items-center justify-content-center py-5">
        <Container className="text-center py-5">
          {/* Illustration Circle */}
          <div className="empty-illustration-wrapper position-relative mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle">
            {/* Top badge */}
            <span className="floating-badge badge-top-left rounded-circle d-flex align-items-center justify-content-center shadow-sm">
              <SetIcon
                Icon={productDetailsIcons.shoppingBag}
                color="#00714d"
                size={18}
              />
            </span>

            {/* Main Cart Icon */}
            <div className="inner-cart-box rounded-4 d-flex align-items-center justify-content-center shadow-sm">
              <SetIcon
                Icon={cartPageIcons.cartMain}
                color="#2e99bc"
                size={75}
              />
            </div>

            {/* Bottom badge */}
            <span className="floating-badge badge-bottom-right rounded-circle d-flex align-items-center justify-content-center shadow-sm">
              <SetIcon Icon={cartPageIcons.gift} color="#ffffff" size={18} />
            </span>
          </div>

          {/* Empty State Text */}
          <h2 className="fw-bolder text-dark mb-3">
            Your cart is feeling light
          </h2>
          <p className="text-muted mx-auto mb-4 empty-subtitle">
            It looks like you haven't added anything to your cart yet.
            <br />
            Let's find something special for you.
          </p>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
            <Button
              as={Link}
              to="/products"
              className="btn-start-shopping bg-main-color border-0 px-4 py-2 rounded-3 fw-semibold"
            >
              Start Shopping
            </Button>
            <Button
              as={Link}
              to="/products"
              variant="outline-primary"
              className="btn-saved-items bg-white px-4 py-2 rounded-3 fw-semibold"
            >
              View Saved Items
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // Active Cart View
  return (
    <section className="cart-page py-5">
      <Container>
        <h2 className="fw-bolder text-dark mb-4">Your Shopping Cart</h2>

        <Row className="g-4 align-items-start">
          {/* Left Column */}
          <Col xs={12} lg={8}>
            <div className="d-flex flex-column gap-3">
              {items.map((item) => {
                // Subtitle specifications (Color | Brand | Category)
                const specs = [
                  item.selectedColor,
                  item.brand,
                  item.category,
                ].filter(Boolean); // exist only (non-empty values)

                return (
                  <Card
                    key={item.id}
                    className="cart-item-card border rounded-4 p-3 bg-white"
                  >
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      {/* Item left Side */}
                      <div className="d-flex align-items-center gap-3">
                        <Link
                          to={`/products/${item.id}`}
                          className="item-img-wrapper rounded-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="img-fluid object-fit-contain"
                          />
                        </Link>

                        <div>
                          <Link
                            to={`/products/${item.id}`}
                            className="h5 fw-bold text-dark text-decoration-none d-block mb-1 item-title"
                          >
                            {item.title}
                          </Link>

                          <p className="text-muted small mb-3 text-capitalize">
                            {specs.join(" | ")}
                          </p>

                          {/* Quantity Control Box */}
                          <div className="qty-selector d-inline-flex align-items-center border rounded-3 bg-light px-1">
                            <button
                              type="button"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  }),
                                )
                              }
                              className="btn btn-sm border-0 fw-bold text-secondary"
                            >
                              −
                            </button>
                            <span className="px-3 fw-bold small text-dark">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={item.quantity >= item.stock}
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  }),
                                )
                              }
                              className="btn btn-sm border-0 fw-bold text-secondary"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Item right side */}
                      <div className="d-flex flex-sm-column justify-content-between align-items-sm-end align-self-sm-stretch py-1 border-top border-sm-0 pt-2 pt-sm-0">
                        <span className="fs-5 fw-bolder main-color">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="remove-btn btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 small fw-semibold"
                        >
                          <SetIcon
                            Icon={cartPageIcons.trash}
                            color="#b91c1c"
                            size={15}
                          />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Col>

          {/* Right Column */}
          <Col xs={12} lg={4} className="summary-col">
            <div className="order-summary-box rounded-4 p-4">
              <h5 className="fw-bolder text-dark mb-4">Order Summary</h5>

              {/* Cost Breakdown */}
              <div className="d-flex flex-column gap-3 small mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold text-dark">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold shipping-free">Free</span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Estimated Tax</span>
                  <span className="fw-bold text-dark">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bolder text-dark fs-5">Total</span>
                <span className="fw-bolder main-color fs-4">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                as={Link}
                to="/checkout"
                className="bg-main-color border-0 w-100 py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <SetIcon
                  Icon={productDetailsIcons.arrowRight}
                  color="white"
                  size={18}
                />
              </Button>

              {/* Terms Text */}
              <p className="terms-text text-muted text-center mb-4">
                By proceeding to checkout, you agree to ShopStream's{" "}
                <Link
                  to="#"
                  className="text-decoration-none text-dark fw-semibold"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-decoration-none text-dark fw-semibold"
                >
                  privacy policy
                </Link>
                .
              </p>

              {/* Express Delivery Box */}
              <div className="delivery-info-box rounded-3 p-3 d-flex align-items-center gap-3">
                <SetIcon
                  Icon={productDetailsIcons.delivery}
                  size={22}
                  className="main-color flex-shrink-0"
                />
                <div className="small">
                  <span className="fw-bold text-dark d-block">
                    Free Express Delivery
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                    Arrives within 2 - 4 business days
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
