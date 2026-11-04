import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Navbar as BNavbar, Button, Form, Nav } from "react-bootstrap";
import Navbar from "../navbar/Navbar";
import { appLayoutIcons, SetIcon } from "../../../assets/icons";
import { useSelector } from "react-redux";
import "./AppLayout.scss";
import Footer from "../footer/Footer";

export default function AppLayout() {
  const { totalQuantity } = useSelector((store) => store.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search state
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Sync input with URL search param
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Debouncing search (500ms)
  useEffect(() => {
    if (location.pathname !== "/products") return;

    const currentUrlSearch = searchParams.get("search") || "";
    const trimmed = searchTerm.trim();

    if (trimmed === currentUrlSearch) return;

    const timer = setTimeout(() => {
      if (trimmed) {
        navigate(`/products?search=${encodeURIComponent(trimmed)}`, {
          replace: true,
        });
      } else {
        navigate("/products", { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, location.pathname, navigate, searchParams]);

  // Redirect to products page on focus/typing
  const handleSearchFocus = () => {
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  return (
    <div>
      {/* Main Navigation Bar */}
      <Navbar>
        <BNavbar.Brand className="brand fw-bolder me-5 fs-4" as={Link} to="/">
          ShopStream
        </BNavbar.Brand>

        <BNavbar.Toggle
          className="navbar-toggler"
          aria-controls="basic-navbar-nav"
        />

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-nav d-flex align-items-center gap-1 gap-md-3">
            <Nav.Item>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "is-selected" : "text-dark fw-medium"}`
                }
              >
                Home
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "is-selected" : "text-dark fw-medium"}`
                }
              >
                Products
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "is-selected" : "text-dark fw-medium"}`
                }
              >
                Categories
              </NavLink>
            </Nav.Item>
          </Nav>

          {/* Search Input and Action Icons */}
          <div className="navbar-icons-and-search d-flex align-items-center gap-4 ms-auto pe-md-3 mt-3 mt-md-0">
            <Form onSubmit={(e) => e.preventDefault()}>
              <div className="search-form d-flex align-items-center rounded-pill px-3 py-1">
                <Form.Label
                  htmlFor="searchInput"
                  className="mb-0 d-flex align-items-center"
                >
                  <SetIcon
                    Icon={appLayoutIcons.Search}
                    size={20}
                    color="gray"
                  />
                </Form.Label>
                <Form.Control
                  type="search"
                  value={searchTerm}
                  onFocus={handleSearchFocus}
                  onChange={handleSearchChange}
                  className="border-0 bg-transparent shadow-none ms-2"
                  id="searchInput"
                  placeholder="Search products..."
                />
              </div>
            </Form>

            <div className="nav-icons d-flex align-items-center gap-3">
              {/* Cart Icon */}
              <Button
                as={Link}
                to="/cart"
                variant="link"
                className="text-dark p-0 position-relative text-decoration-none"
              >
                <SetIcon Icon={appLayoutIcons.Cart} size={24} />
                {totalQuantity > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {totalQuantity}
                  </span>
                )}
              </Button>

              <Button variant="link" as={Link} to="/profile" className="text-dark p-0">
                <SetIcon Icon={appLayoutIcons.Profile} size={24} />
              </Button>
            </div>
          </div>
        </BNavbar.Collapse>
      </Navbar>

      <Outlet />

      <Footer />
    </div>
  );
}