import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { loginIcons, SetIcon } from "../../assets/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";

import "./Login.scss";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const go = useNavigate();
  const location = useLocation();

  const { error, isLoading, isLoggedIn } = useSelector((store) => store.auth);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Handle login submit
  async function handleLogin(event) {
    event.preventDefault();

    const data = {
      username: usernameRef.current.value.trim(),
      password: passwordRef.current.value,
    };

    const result = await dispatch(login(data));

    if (login.fulfilled.match(result)) {
      const from = location.state?.from?.pathname || "/";
      go(from, { replace: true });
    }
  }

  // if you logged in you can't access login page
  useEffect(() => {
    if (isLoggedIn) {
      go("/", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <section className="login-page d-flex align-items-center justify-content-center py-5 px-3">
      <Card className="login-card border-0 rounded-4 p-4 p-sm-5 w-100">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bolder text-dark mb-1">Welcome Back</h2>
          <p className="text-muted small mb-0">
            Please enter your details to sign in.
          </p>
        </div>

        <Form onSubmit={handleLogin}>
          {/* Email or Username */}
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="username"
              className="small fw-semibold text-dark mb-1"
            >
              Email or Username
            </Form.Label>
            <InputGroup className="custom-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                <SetIcon Icon={loginIcons.mail} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                ref={usernameRef}
                type="text"
                id="username"
                placeholder="name@example.com"
                className="bg-transparent border-0 shadow-none small py-2"
              />
            </InputGroup>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label
                htmlFor="password"
                className="small fw-semibold text-dark mb-0"
              >
                Password
              </Form.Label>
              <Link
                className="text-decoration-none main-color fw-bold small"
                to="/forgot-password"
              >
                Forgot?
              </Link>
            </div>
            <InputGroup className="custom-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                <SetIcon Icon={loginIcons.lock} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                ref={passwordRef}
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="bg-transparent border-0 shadow-none small py-2"
              />
              <InputGroup.Text
                role="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="bg-transparent border-0 text-muted eye-toggle"
              >
                <SetIcon
                  Icon={
                    isPasswordVisible
                      ? loginIcons.closedEye
                      : loginIcons.openedEye
                  }
                  size={17}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="mb-3 py-2 small rounded-3">
              {error}
            </Alert>
          )}

          {/* Remember Me */}
          <Form.Group className="mb-4 d-flex align-items-center gap-2">
            <Form.Check id="rememberMe" className="remember-check" />
            <Form.Label
              className="mb-0 text-muted small"
              htmlFor="rememberMe"
              role="button"
            >
              Stay signed in for 30 days
            </Form.Label>
          </Form.Group>

          {/* Sign In Button */}
          <Button
            disabled={isLoading}
            className="sign-in-btn bg-main-color border-0 w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 mb-4"
            type="submit"
          >
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
              >
                <span className="visually-hidden">Loading…</span>
              </div>
            ) : (
              <>
                <span className="fw-semibold small">Sign In</span>
                <SetIcon
                  Icon={loginIcons.arrowRight}
                  size={16}
                  color="#ffffff"
                />
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="divider-line position-relative text-center mb-4">
            <span className="bg-white px-3 text-muted position-relative">
              Or continue with
            </span>
          </div>

          {/* Social Login Buttons */}
          <Row className="g-2 mb-4">
            <Col xs={6}>
              <Button
                variant="light"
                type="button"
                className="social-btn w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 bg-white"
              >
                <SetIcon Icon={loginIcons.google} size={18} />
                <span className="fw-semibold small text-dark">Google</span>
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="light"
                type="button"
                className="social-btn w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 bg-white"
              >
                <SetIcon Icon={loginIcons.apple} size={18} color="#000000" />
                <span className="fw-semibold small text-dark">Apple</span>
              </Button>
            </Col>
          </Row>

          {/* Register Link */}
          <div className="text-center small text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="main-color fw-bold text-decoration-none"
            >
              Register
            </Link>
          </div>
        </Form>
      </Card>
    </section>
  );
}
