import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import {
  loginIcons,
  profilePageIcons,
  productDetailsIcons,
  SetIcon,
} from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice";

import "../loginPage/Login.scss";

export default function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const go = useNavigate();

  const { error, isLoading } = useSelector((store) => store.auth);

  // Form refs
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Handle register
  async function handleRegister(event) {
    event.preventDefault();
    setLocalError("");

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Check password match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const userData = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      username: usernameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      password,
    };

    const result = await dispatch(register(userData));

    // If registration is successful, navigate to home page
    if (register.fulfilled.match(result)) {
      go("/", { replace: true });
    }
  }

  return (
    <section className="login-page d-flex align-items-center justify-content-center py-5 px-3">
      <Card className="login-card border-0 rounded-4 p-4 p-sm-5 w-100">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bolder text-dark mb-1">Create Account</h2>
          <p className="text-muted small mb-0">
            Join ShopStream for a personalized shopping experience.
          </p>
        </div>

        <Form onSubmit={handleRegister}>
          {/* First Name & Last Name */}
          <Row className="g-2 mb-3">
            <Col xs={12} sm={6}>
              <Form.Label
                htmlFor="firstName"
                className="small fw-semibold text-dark mb-1"
              >
                First Name
              </Form.Label>
              <InputGroup className="custom-input-group rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                  <SetIcon Icon={profilePageIcons.user} size={17} />
                </InputGroup.Text>
                <Form.Control
                  required
                  ref={firstNameRef}
                  type="text"
                  id="firstName"
                  placeholder="John"
                  className="bg-transparent border-0 shadow-none small py-2"
                />
              </InputGroup>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Label
                htmlFor="lastName"
                className="small fw-semibold text-dark mb-1"
              >
                Last Name
              </Form.Label>
              <InputGroup className="custom-input-group rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                  <SetIcon Icon={profilePageIcons.user} size={17} />
                </InputGroup.Text>
                <Form.Control
                  required
                  ref={lastNameRef}
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  className="bg-transparent border-0 shadow-none small py-2"
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="username"
              className="small fw-semibold text-dark mb-1"
            >
              Username
            </Form.Label>
            <InputGroup className="custom-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                <SetIcon Icon={loginIcons.atSign} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                ref={usernameRef}
                type="text"
                id="username"
                placeholder="johndoe"
                className="bg-transparent border-0 shadow-none small py-2"
              />
            </InputGroup>
          </Form.Group>

          {/* Email Address */}
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="email"
              className="small fw-semibold text-dark mb-1"
            >
              Email Address
            </Form.Label>
            <InputGroup className="custom-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                <SetIcon Icon={loginIcons.mail} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                ref={emailRef}
                type="email"
                id="email"
                placeholder="john@example.com"
                className="bg-transparent border-0 shadow-none small py-2"
              />
            </InputGroup>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="password"
              className="small fw-semibold text-dark mb-1"
            >
              Password
            </Form.Label>
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

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="confirmPassword"
              className="small fw-semibold text-dark mb-1"
            >
              Confirm Password
            </Form.Label>
            <InputGroup className="custom-input-group rounded-3 overflow-hidden">
              <InputGroup.Text className="bg-transparent border-0 pe-1 text-muted">
                <SetIcon Icon={productDetailsIcons.warranty} size={17} />
              </InputGroup.Text>
              <Form.Control
                required
                ref={confirmPasswordRef}
                type={isPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                className="bg-transparent border-0 shadow-none small py-2"
              />
            </InputGroup>
          </Form.Group>

          {/* Error Alert */}
          {(localError || error) && (
            <Alert variant="danger" className="mb-3 py-2 small rounded-3">
              {localError || error}
            </Alert>
          )}

          {/* Terms Checkbox */}
          <Form.Group className="mb-4 d-flex align-items-center gap-2">
            <Form.Check required id="agreeTerms" className="remember-check" />
            <Form.Label
              className="mb-0 text-muted small"
              htmlFor="agreeTerms"
              role="button"
            >
              I agree to the{" "}
              <Link
                to="#"
                className="main-color fw-semibold text-decoration-none"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="#"
                className="main-color fw-semibold text-decoration-none"
              >
                Privacy Policy
              </Link>
              .
            </Form.Label>
          </Form.Group>

          {/* Sign Up Button */}
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
                <span className="fw-semibold small">Sign Up</span>
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
              Or register with
            </span>
          </div>

          {/* Social Buttons */}
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

          {/* Sign In Link */}
          <div className="text-center small text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="main-color fw-bold text-decoration-none"
            >
              Sign In
            </Link>
          </div>
        </Form>
      </Card>
    </section>
  );
}