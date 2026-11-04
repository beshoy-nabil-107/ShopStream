import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Card, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { loginIcons, usersPageIcons, SetIcon } from "../../assets/icons";
import "./AdminRoute.scss";

export default function AdminRoute() {
  const secretPassword = import.meta.env.ADMIN_PANEL_PASSWORD || "";

  const [passwordInput, setPasswordInput] = useState(secretPassword);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerifyPassword = (e) => {
    e.preventDefault();

    if (passwordInput === secretPassword && secretPassword !== "") {
      setErrorMsg("");
      setIsAuthorized(true);
    } else {
      setErrorMsg("Invalid admin password. Access denied.");
    }
  };

  // Once verified => render the Dashboard routes
  if (isAuthorized) {
    return <Outlet />;
  }

  return (
    <section className="admin-gate-page d-flex align-items-center justify-content-center min-vh-100 px-3">
      <Card className="admin-gate-card border-0 rounded-4 p-4 p-sm-5 shadow-lg bg-white w-100">
        <div className="text-center mb-4">
          <div className="gate-icon-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
            <SetIcon
              Icon={usersPageIcons.shield}
              size={26}
              className="main-color"
            />
          </div>
          <h4 className="fw-bolder text-dark mb-1">Admin Panel Access</h4>
          <p className="text-muted small mb-0">
            Please confirm the administrator password to continue to the
            dashboard.
          </p>
        </div>

        <Form onSubmit={handleVerifyPassword}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary mb-1">
              Admin Password
            </Form.Label>
            <InputGroup className="gate-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 text-muted pe-1">
                <SetIcon Icon={loginIcons.lock} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                autoComplete="off"
                placeholder="••••••••"
                className="border-0 bg-transparent py-2 shadow-none small"
              />
            </InputGroup>
          </Form.Group>

          {errorMsg && (
            <Alert variant="danger" className="py-2 small rounded-3 mb-3">
              {errorMsg}
            </Alert>
          )}

          <Button
            type="submit"
            className="bg-main-color border-0 w-100 py-2 rounded-3 fw-semibold small d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            <span>Enter Dashboard</span>
            <SetIcon Icon={loginIcons.arrowRight} size={16} color="#ffffff" />
          </Button>

          <div className="text-center">
            <Link
              to="/"
              className="text-muted small text-decoration-none fw-semibold"
            >
              Return to Storefront
            </Link>
          </div>
        </Form>
      </Card>
    </section>
  );
}
