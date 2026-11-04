import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import {
  profilePageIcons,
  productDetailsIcons,
  SetIcon,
  checkoutPageIcons,
} from "../../assets/icons";

import "./Profile.scss";

// Sample recent orders data
const RECENT_ORDERS = [
  {
    id: "SS-98231",
    title: "StreamX Pro Wireless Headphones",
    date: "Oct 12, 2023",
    price: 299.0,
    status: "Delivered",
    statusClass: "status-delivered",
    actionText: "Track Package",
    image:
      "https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/thumbnail.png",
  },
  {
    id: "SS-98442",
    title: "Quantum Watch Series 4",
    date: "Oct 15, 2023",
    price: 449.0,
    status: "Shipped",
    statusClass: "status-shipped",
    actionText: "Track Package",
    image:
      "https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/thumbnail.png",
  },
  {
    id: "SS-98771",
    title: "Mechanical Chroma Keyboard",
    date: "Oct 18, 2023",
    price: 189.0,
    status: "Processing",
    statusClass: "status-processing",
    actionText: "Edit Order",
    image:
      "https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/thumbnail.png",
  },
];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoggedIn } = useSelector((store) => store.auth);

  // Active sidebar tab & alert state
  const [activeTab, setActiveTab] = useState("profile");
  const [alertMessage, setAlertMessage] = useState("");

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.username || "john12";

  const userEmail = user?.email || "john12@example.com";
  const userAvatar =
    user?.image || "https://dummyjson.com/icon/emilys/128";

  // Handle sign out
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <section className="profile-page py-4 py-lg-5">
      <Container>
        <Row className="g-4 align-items-start">
          {/* Left Sidebar */}
          <Col xs={12} lg={3}>
            <Card className="profile-sidebar border-0 rounded-4 p-3 p-xl-4">
              <div className="mb-4 px-2">
                <h6 className="fw-bolder text-dark mb-0">Account</h6>
                <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                  Manage your settings
                </span>
              </div>

              {/* Navigation Links */}
              <div className="d-flex flex-column gap-2 mb-4 pb-4 border-bottom">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`sidebar-btn border-0 rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small text-start ${
                    activeTab === "profile" ? "active" : "text-secondary"
                  }`}
                >
                  <SetIcon Icon={profilePageIcons.user} size={18} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`sidebar-btn border-0 rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small text-start ${
                    activeTab === "orders" ? "active" : "text-secondary"
                  }`}
                >
                  <SetIcon Icon={profilePageIcons.history} size={18} />
                  <span>Order History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`sidebar-btn border-0 rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small text-start ${
                    activeTab === "settings" ? "active" : "text-secondary"
                  }`}
                >
                  <SetIcon Icon={profilePageIcons.settings} size={18} />
                  <span>Account Settings</span>
                </button>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="signout-btn border-0 bg-transparent px-3 py-2 d-flex align-items-center gap-3 fw-bold small text-start"
              >
                <SetIcon Icon={profilePageIcons.signOut} size={18} />
                <span>Sign Out</span>
              </button>
            </Card>
          </Col>

          {/* Right Main Content */}
          <Col xs={12} lg={9}>
            {/* Top User Info Card */}
            <Card className="user-header-card border rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-start gap-4">
                  <img
                    src={userAvatar}
                    alt={fullName}
                    className="user-avatar rounded-circle object-fit-cover border"
                  />

                  <div>
                    <h3 className="fw-bolder text-dark mb-1">{fullName}</h3>
                    <p className="text-muted small mb-3">{userEmail}</p>
                    <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-2">
                      <span className="badge-premium px-3 py-1 rounded-pill fw-bold">
                        Premium Member
                      </span>
                      <span className="badge-member px-3 py-1 rounded-pill fw-semibold">
                        Member since 2022
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="d-flex flex-row flex-md-column gap-2 w-100 w-md-auto header-actions">
                  <Button
                    onClick={() =>
                      setAlertMessage(
                        "Profile editing will be available soon!"
                      )
                    }
                    className="bg-main-color border-0 rounded-3 py-2 px-4 fw-semibold small flex-grow-1"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      setAlertMessage(
                        "Analytics dashboard is coming soon in the next update!"
                      )
                    }
                    className="analytics-btn bg-white rounded-3 py-2 px-4 fw-semibold small flex-grow-1"
                  >
                    View Analytics
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <Row className="g-3 mb-4">
              <Col xs={12} md={4}>
                <Card className="stat-card border rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="stat-icon-box icon-purple rounded-3 d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={productDetailsIcons.shoppingBag}
                        size={18}
                        className="main-color"
                      />
                    </div>
                    <span className="stat-tag fw-bold">+2 this month</span>
                  </div>
                  <span className="text-muted small fw-medium d-block mb-1">
                    Total Orders
                  </span>
                  <h3 className="fw-bolder text-dark mb-0">24</h3>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className="stat-card border rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="stat-icon-box icon-green rounded-3 d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={checkoutPageIcons.card}
                        size={18}
                        color="#00714d"
                      />
                    </div>
                  </div>
                  <span className="text-muted small fw-medium d-block mb-1">
                    Wallet Balance
                  </span>
                  <h3 className="fw-bolder text-dark mb-0">$1,248.50</h3>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className="stat-card border rounded-4 p-4 bg-white h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="stat-icon-box icon-purple rounded-3 d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={profilePageIcons.star}
                        size={18}
                        className="main-color"
                      />
                    </div>
                  </div>
                  <span className="text-muted small fw-medium d-block mb-1">
                    Loyalty Points
                  </span>
                  <h3 className="fw-bolder text-dark mb-0">4,800</h3>
                </Card>
              </Col>
            </Row>

            {/* Recent Orders Card */}
            <Card className="recent-orders-card border rounded-4 bg-white overflow-hidden">
              <div className="orders-header p-4 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="fw-bolder text-dark mb-0">Recent Orders</h5>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="btn btn-link p-0 main-color text-decoration-none fw-bold small"
                >
                  View All
                </button>
              </div>

              <div className="orders-list">
                {RECENT_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="order-row p-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border-bottom"
                  >
                    {/* Left: Image + Order Info */}
                    <div className="d-flex align-items-center gap-3">
                      <div className="order-img-box rounded-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0">
                        <img
                          src={order.image}
                          alt={order.title}
                          className="img-fluid object-fit-contain"
                        />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          {order.title}
                        </h6>
                        <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                          Order #{order.id} &nbsp; Placed on {order.date}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price + Status Badge + Action */}
                    <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4">
                      <span className="fw-bolder main-color fs-6">
                        ${order.price.toFixed(2)}
                      </span>

                      <div className="text-end" style={{ minWidth: "105px" }}>
                        <span
                          className={`status-badge d-inline-block px-3 py-1 rounded-pill fw-bold mb-1 ${order.statusClass}`}
                        >
                          {order.status}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAlertMessage(
                              `${order.actionText} for Order #${order.id} will be available soon!`
                            )
                          }
                          className="d-block ms-auto btn btn-link p-0 main-color text-decoration-none fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {order.actionText}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Coming Soon Alert Modal */}
      <Modal
        show={!!alertMessage}
        onHide={() => setAlertMessage("")}
        centered
        size="sm"
        contentClassName="border-0 rounded-4 shadow"
      >
        <Modal.Body className="text-center p-4">
          <div className="alert-icon-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
            <SetIcon
              Icon={profilePageIcons.info}
              size={24}
              className="main-color"
            />
          </div>
          <h6 className="fw-bolder text-dark mb-2">Coming Soon</h6>
          <p className="text-muted small mb-4">{alertMessage}</p>
          <Button
            onClick={() => setAlertMessage("")}
            className="bg-main-color border-0 w-100 py-2 rounded-3 fw-semibold small"
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
}