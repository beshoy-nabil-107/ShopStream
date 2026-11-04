import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Table, Dropdown } from "react-bootstrap";
import { api } from "../../../services/axios";
import {
  appLayoutIcons,
  profilePageIcons,
  productDetailsIcons,
  productsPageIcons,
  inventoryIcons,
  ordersPageIcons,
  SetIcon,
} from "../../../assets/icons";
import analyticsLaptopImage from "../../../assets/images/analyticsLaptopImage.png";
import "./Orders.scss";

const STATUS_OPTIONS = ["all", "Completed", "Pending", "Abandoned"];
const AVATAR_COLORS = ["avatar-green", "avatar-purple", "avatar-blue", "avatar-gray"];

export default function Orders() {
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search, Status Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  // Fetch carts and users from DummyJSON and merge them
  useEffect(() => {
    async function fetchCartsAndUsers() {
      try {
        setIsLoading(true);
        const [cartsRes, usersRes] = await Promise.all([
          api.get("/carts?limit=0"),
          api.get("/users?limit=0"),
        ]);

        const usersList = usersRes.data.users || [];
        const cartsList = cartsRes.data.carts || [];

        const statuses = ["Completed", "Pending", "Completed", "Abandoned"];

        // Merge carts with user data and format for table display
        const formattedCarts = cartsList.map((cart, index) => {
          const foundUser = usersList.find((u) => u.id === cart.userId);
          const firstName = foundUser?.firstName || "Customer";
          const lastName = foundUser?.lastName || `${cart.userId}`;
          const fullName = `${firstName} ${lastName}`;
          const initials = `${firstName[0] || "C"}${lastName[0] || "U"}`.toUpperCase();

          return {
            id: cart.id,
            cartCode: `#CRT-${88200 + cart.id}`,
            userName: fullName,
            userEmail: foundUser?.email || `user${cart.userId}@example.com`,
            initials,
            avatarClass: AVATAR_COLORS[index % AVATAR_COLORS.length],
            totalItems: cart.totalQuantity || cart.totalProducts || 1,
            totalPrice: cart.total || 0,
            status: statuses[index % statuses.length],
          };
        });

        setCarts(formattedCarts);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartsAndUsers();
  }, []);

  // Filter by User Name and Status
  const filteredCarts = carts.filter((item) => {
    const matchesUser = item.userName
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesUser && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCarts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCarts = filteredCarts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Build pagination numbers with dots
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div className="orders-page">
      {/* Top Header, Search by User Name & Status Filter */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder text-dark mb-1">Cart Management</h3>
          <p className="text-muted small mb-0">
            Oversee and monitor all customer shopping activity.
          </p>
        </div>

        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
          {/* Search Input (By User Name) */}
          <div className="orders-search d-flex align-items-center px-3 py-1 rounded-3">
            <SetIcon Icon={appLayoutIcons.Search} size={17} color="#94a3b8" />
            <Form.Control
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search carts by user name..."
              className="border-0 bg-transparent shadow-none small"
            />
          </div>

          {/* Filter Dropdown (By Status) */}
          <Dropdown
            onSelect={(status) => {
              setSelectedStatus(status);
              setCurrentPage(1);
            }}
          >
            <Dropdown.Toggle className="filter-status-btn bg-main-color border-0 rounded-3 px-3 py-2 small fw-semibold d-flex align-items-center justify-content-center gap-2">
              <SetIcon Icon={inventoryIcons.filter} size={15} color="#ffffff" />
              <span>
                {selectedStatus === "all" ? "Filter" : selectedStatus}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border rounded-3">
              {STATUS_OPTIONS.map((status) => (
                <Dropdown.Item
                  key={status}
                  eventKey={status}
                  active={selectedStatus === status}
                  className="small"
                >
                  {status === "all" ? "All Statuses" : status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Top Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <Card className="top-stat-card border rounded-4 p-3 p-xl-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icon-box box-purple rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={appLayoutIcons.Cart}
                  size={17}
                  className="main-color"
                />
              </div>
              <span className="stat-change positive fw-bold">+12.5%</span>
            </div>
            <span className="stat-title text-muted fw-bold d-block mb-1">
              ACTIVE CARTS
            </span>
            <h3 className="fw-bolder text-dark mb-0">1,284</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="top-stat-card border rounded-4 p-3 p-xl-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icon-box box-green rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={profilePageIcons.wallet}
                  size={17}
                  color="#00714d"
                />
              </div>
              <span className="stat-change positive fw-bold">+8.2%</span>
            </div>
            <span className="stat-title text-muted fw-bold d-block mb-1">
              POTENTIAL REV
            </span>
            <h3 className="fw-bolder text-dark mb-0">$42,910</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="top-stat-card border rounded-4 p-3 p-xl-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icon-box box-purple rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={profilePageIcons.history}
                  size={17}
                  className="main-color"
                />
              </div>
              <span className="stat-change negative fw-bold">-2.1%</span>
            </div>
            <span className="stat-title text-muted fw-bold d-block mb-1">
              AVG. SESSION
            </span>
            <h3 className="fw-bolder text-dark mb-0">14m 32s</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="top-stat-card border rounded-4 p-3 p-xl-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icon-box box-red rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={appLayoutIcons.Cart}
                  size={17}
                  color="#b91c1c"
                />
              </div>
              <span className="stat-change negative fw-bold">+4.5%</span>
            </div>
            <span className="stat-title text-muted fw-bold d-block mb-1">
              ABANDON RATE
            </span>
            <h3 className="fw-bolder text-dark mb-0">34.2%</h3>
          </Card>
        </Col>
      </Row>

      {/* Recent Cart Activity Table Card */}
      <Card className="border rounded-4 bg-white shadow-sm mb-4 overflow-hidden">
        {/* Card Header with Download */}
        <div className="p-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <h6 className="fw-bold text-dark mb-0">Recent Cart Activity</h6>

          <div className="d-flex align-items-center gap-2 text-secondary">
            <button
              type="button"
              className="header-icon-btn border-0 bg-transparent p-1 text-secondary"
              title="Download"
            >
              <SetIcon Icon={inventoryIcons.export} size={17} />
            </button>
            <button
              type="button"
              className="header-icon-btn border-0 bg-transparent p-1 text-secondary"
              title="More options"
            >
              <SetIcon Icon={ordersPageIcons.more} size={17} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <Table align="middle" className="mb-0 orders-table">
            <thead>
              <tr className="border-bottom">
                <th className="py-3 px-4 text-secondary fw-bold">CART ID</th>
                <th className="py-3 text-secondary fw-bold">USER</th>
                <th className="py-3 text-secondary fw-bold">TOTAL ITEMS</th>
                <th className="py-3 text-secondary fw-bold">TOTAL PRICE</th>
                <th className="py-3 text-secondary fw-bold">STATUS</th>
                <th className="py-3 px-4 text-secondary fw-bold text-end">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted small">
                    Loading cart activity...
                  </td>
                </tr>
              ) : currentCarts.length > 0 ? (
                currentCarts.map((item) => (
                  <tr key={item.id} className="border-bottom">
                    {/* Cart ID */}
                    <td className="py-3 px-4">
                      <span className="cart-id-text fw-bold">
                        {item.cartCode}
                      </span>
                    </td>

                    {/* User Avatar Initials, Name & Email */}
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`user-initials-circle rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 ${item.avatarClass}`}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark small mb-0">
                            {item.userName}
                          </h6>
                          <span className="user-email text-muted">
                            {item.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Items */}
                    <td>
                      <span className="text-secondary small fw-medium">
                        {item.totalItems}{" "}
                        {item.totalItems === 1 ? "item" : "items"}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td>
                      <span className="fw-bolder text-dark">
                        ${Number(item.totalPrice).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`order-status-pill d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-bold status-${item.status.toLowerCase()}`}
                      >
                        <span className="status-dot rounded-circle" />
                        {item.status}
                      </span>
                    </td>

                    {/* Actions (More Icon) */}
                    <td className="px-4 text-end">
                      <button
                        type="button"
                        className="border-0 bg-transparent text-muted p-1"
                      >
                        <SetIcon Icon={ordersPageIcons.more} size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted small">
                    No carts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {filteredCarts.length > 0 && (
          <div className="table-footer p-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <span className="text-muted small">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredCarts.length)} of{" "}
              {filteredCarts.length} results
            </span>

            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="page-btn border bg-white rounded-2 d-flex align-items-center justify-content-center"
              >
                <SetIcon Icon={productsPageIcons.prev} size={11} />
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`dots-${index}`} className="px-2 text-muted small">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`page-btn border rounded-2 fw-bold ${
                      currentPage === page ? "active" : "bg-white text-dark"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="page-btn border bg-white rounded-2 d-flex align-items-center justify-content-center"
              >
                <SetIcon Icon={productsPageIcons.next} size={11} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Bottom Static Section: Abandoned Cart Recovery & System Alerts */}
      <Row className="g-4">
        {/* Left: Abandoned Cart Recovery Card */}
        <Col xs={12} lg={8}>
          <Card className="recovery-card border rounded-4 p-4 bg-white shadow-sm h-100 d-flex flex-column justify-content-center">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
              <div className="recovery-img-wrapper rounded-4 overflow-hidden flex-shrink-0">
                <img
                  src={analyticsLaptopImage}
                  alt="Analytics Laptop"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <div>
                <span className="insights-badge d-inline-block px-3 py-1 rounded-pill fw-bold mb-2">
                  INSIGHTS
                </span>
                <h5 className="fw-bolder text-dark mb-2">
                  Abandoned Cart Recovery
                </h5>
                <p className="text-muted small mb-3 lh-base">
                  Our AI detected a 14% increase in abandoned high-value carts
                  this week. Consider launching an automated "Complete Your
                  Purchase" email campaign with a 5% discount incentive.
                </p>
                <span
                  role="button"
                  className="main-color fw-bold small d-inline-flex align-items-center gap-1"
                >
                  <span>View Campaign Settings</span>
                  <SetIcon
                    Icon={productDetailsIcons.arrowRight}
                    size={15}
                  />
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right: System Alerts Dark Card */}
        <Col xs={12} lg={4}>
          <Card className="system-alerts-card border-0 rounded-4 p-4 text-white h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <SetIcon
                  Icon={ordersPageIcons.bell}
                  size={20}
                  color="#94a3b8"
                />
                <span className="online-dot rounded-circle" />
              </div>

              <h5 className="fw-bold mb-3">System Alerts</h5>

              <div className="alert-item green-border ps-3 mb-3">
                <p className="mb-0 small text-white-50">
                  Payment gateway response time is optimal (142ms).
                </p>
              </div>

              <div className="alert-item red-border ps-3 mb-4">
                <p className="mb-0 small text-white-50">
                  Unusually large cart (#CRT-88209) flagged for verification.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="dismiss-btn border-0 w-100 py-2 rounded-3 fw-semibold small"
            >
              Dismiss All
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}