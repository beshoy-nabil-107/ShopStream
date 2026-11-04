import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import {
  fetchAllUsers,
  addUser,
  editUser,
  deleteUser,
} from "../../../store/slices/userSlice";
import {
  appLayoutIcons,
  productsPageIcons,
  checkoutPageIcons,
  profilePageIcons,
  loginIcons,
  dashboardIcons,
  inventoryIcons,
  usersPageIcons,
  SetIcon,
} from "../../../assets/icons";
import "./Users.scss";

const DEFAULT_AVATAR = "https://dummyjson.com/icon/emilys/128";
const JOIN_DATES = [
  "Joined Oct 12, 2023",
  "Joined Jan 05, 2024",
  "Joined Nov 28, 2023",
  "Joined Feb 14, 2024",
];

export default function Users() {
  const dispatch = useDispatch();
  const { allUsers, totalUsers, isLoading } = useSelector(
    (store) => store.users
  );

  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Add User Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAvatarPreview, setAddAvatarPreview] = useState("");

  // Edit User Modal states
  const [editingUser, setEditingUser] = useState(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");
  const [editActiveStatus, setEditActiveStatus] = useState(true);

  // Delete User Modal state
  const [deletingUser, setDeletingUser] = useState(null);

  // Confirmation Alert Modal state
  const [alertInfo, setAlertInfo] = useState({ title: "", message: "" });

  // Refs for Add Modal
  const addFileRef = useRef(null);
  const addFullNameRef = useRef(null);
  const addUsernameRef = useRef(null);
  const addEmailRef = useRef(null);
  const addRoleRef = useRef(null);
  const addPasswordRef = useRef(null);

  // Refs for Edit Modal
  const editFileRef = useRef(null);
  const editFullNameRef = useRef(null);
  const editUsernameRef = useRef(null);
  const editEmailRef = useRef(null);
  const editRoleRef = useRef(null);

  const itemsPerPage = 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users using userSlice thunk
  useEffect(() => {
    dispatch(
      fetchAllUsers({
        limit: itemsPerPage,
        skip,
        searchQuery: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, skip]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Build pagination numbers
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage, "...", totalPages];
  };

  // Helpers to normalize user role and status
  const getUserRole = (user) => {
    if (user.customRole) return user.customRole;
    return user.role === "admin" ? "Admin" : "Customer";
  };

  const getUserStatus = (user) => {
    if (user.status) return user.status;
    return user.id % 4 === 0 ? "Inactive" : "Active";
  };

  // --- ADD USER HANDLERS ---
  const handleOpenAdd = () => {
    setAddAvatarPreview("");
    setShowAddModal(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const fullName = addFullNameRef.current.value.trim();
    const parts = fullName.split(" ");
    const firstName = parts[0] || "User";
    const lastName = parts.slice(1).join(" ") || "";

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      username: addUsernameRef.current.value.trim().replace(/^@/, ""),
      email: addEmailRef.current.value.trim(),
      customRole: addRoleRef.current.value,
      status: "Active",
      image: addAvatarPreview || DEFAULT_AVATAR,
      joinedDate: "Joined Just Now",
    };

    dispatch(addUser(newUser));
    setShowAddModal(false);
    setCurrentPage(1);
    setAlertInfo({
      title: "User Created!",
      message: `${fullName} has been added to the top of the user directory.`,
    });
  };

  // --- EDIT USER HANDLERS ---
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditAvatarPreview(user.image || DEFAULT_AVATAR);
    setEditActiveStatus(getUserStatus(user) === "Active");
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const fullName = editFullNameRef.current.value.trim();
    const parts = fullName.split(" ");
    const firstName = parts[0] || editingUser.firstName;
    const lastName = parts.slice(1).join(" ") || "";

    const updatedUser = {
      ...editingUser,
      firstName,
      lastName,
      username: editUsernameRef.current.value.trim(),
      email: editEmailRef.current.value.trim(),
      customRole: editRoleRef.current.value,
      status: editActiveStatus ? "Active" : "Inactive",
      image: editAvatarPreview || DEFAULT_AVATAR,
    };

    dispatch(editUser(updatedUser));
    setEditingUser(null);
    setAlertInfo({
      title: "User Updated!",
      message: `${fullName}'s profile details have been updated successfully.`,
    });
  };

  // --- DELETE USER HANDLER ---
  const handleConfirmDelete = () => {
    const fullName = `${deletingUser.firstName} ${deletingUser.lastName}`;
    dispatch(deleteUser(deletingUser.id));
    setDeletingUser(null);
    setAlertInfo({
      title: "User Deleted!",
      message: `${fullName}'s account has been removed from ShopStream.`,
    });
  };

  return (
    <div className="users-page">
      {/* Top Header, Search Input & Add New User Button */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h3 className="fw-bolder text-dark mb-1">User Directory</h3>
          <div className="breadcrumb-text small">
            <span className="text-muted">Home &gt; Products &gt; </span>
            <span className="fw-bold text-dark">Categories</span>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
          {/* Search Users Input */}
          <div className="users-search d-flex align-items-center px-3 py-1 rounded-3 bg-white border">
            <SetIcon Icon={appLayoutIcons.Search} size={17} color="#94a3b8" />
            <Form.Control
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search users..."
              className="border-0 bg-transparent shadow-none small"
            />
          </div>

          {/* Add New User Button */}
          <Button
            onClick={handleOpenAdd}
            className="bg-main-color border-0 rounded-3 px-3 py-2 fw-semibold small d-flex align-items-center justify-content-center gap-2"
          >
            <SetIcon
              Icon={usersPageIcons.userPlus}
              size={16}
              color="#ffffff"
            />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <Card className="user-stat-card border rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon-circle circle-purple rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                <SetIcon
                  Icon={dashboardIcons.users}
                  size={18}
                  className="main-color"
                />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Total Users
                </span>
                <h4 className="fw-bolder text-dark mb-0">
                  {totalUsers > 0 ? totalUsers.toLocaleString() : "2,842"}
                </h4>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="user-stat-card border rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon-circle circle-green rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                <SetIcon
                  Icon={usersPageIcons.shield}
                  size={18}
                  color="#00714d"
                />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Admins
                </span>
                <h4 className="fw-bolder text-dark mb-0">12</h4>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="user-stat-card border rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon-circle circle-red rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                <SetIcon
                  Icon={usersPageIcons.userInactive}
                  size={18}
                  color="#b91c1c"
                />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  Inactive
                </span>
                <h4 className="fw-bolder text-dark mb-0">48</h4>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card className="user-stat-card border rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon-circle circle-purple rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                <SetIcon
                  Icon={appLayoutIcons.Cart}
                  size={18}
                  className="main-color"
                />
              </div>
              <div>
                <span className="text-muted small fw-medium d-block">
                  New Signups
                </span>
                <h4 className="fw-bolder text-dark mb-0">+154</h4>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Users Table Card */}
      <Card className="border rounded-4 bg-white shadow-sm overflow-hidden">
        <div className="table-responsive">
          <Table align="middle" className="mb-0 users-table">
            <thead>
              <tr className="border-bottom">
                <th className="py-3 px-4 text-secondary fw-bold">USER</th>
                <th className="py-3 text-secondary fw-bold">EMAIL ADDRESS</th>
                <th className="py-3 text-secondary fw-bold">ROLE</th>
                <th className="py-3 text-secondary fw-bold">STATUS</th>
                <th className="py-3 px-4 text-secondary fw-bold text-end">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted small">
                    Loading users...
                  </td>
                </tr>
              ) : allUsers.length > 0 ? (
                allUsers.map((item, idx) => {
                  const fullName = `${item.firstName} ${item.lastName}`;
                  const role = getUserRole(item);
                  const status = getUserStatus(item);
                  const joined =
                    item.joinedDate || JOIN_DATES[idx % JOIN_DATES.length];

                  return (
                    <tr key={item.id} className="border-bottom">
                      {/* User Avatar, Name & Joined Date */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image || DEFAULT_AVATAR}
                            alt={fullName}
                            className="user-table-avatar rounded-circle object-fit-cover flex-shrink-0"
                          />
                          <div>
                            <h6 className="fw-bold text-dark small mb-0">
                              {fullName}
                            </h6>
                            <span className="joined-text text-muted">
                              {joined}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td>
                        <span className="text-secondary small">
                          {item.email}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td>
                        <span
                          className={`role-pill px-3 py-1 rounded-pill fw-semibold ${
                            role === "Admin" ? "role-admin" : "role-customer"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`status-dot rounded-circle ${
                              status === "Active" ? "active" : "inactive"
                            }`}
                          />
                          <span className="small fw-medium text-dark">
                            {status}
                          </span>
                        </div>
                      </td>

                      {/* Actions (Edit & Delete) */}
                      <td className="px-4 text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="action-icon-btn edit-btn border-0 bg-transparent p-1"
                            title="Edit User"
                          >
                            <SetIcon Icon={inventoryIcons.edit} size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingUser(item)}
                            className="action-icon-btn delete-btn border-0 bg-transparent p-1"
                            title="Delete User"
                          >
                            <SetIcon Icon={inventoryIcons.delete} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted small">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalUsers > 0 && (
          <div className="table-footer p-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <span className="text-muted small">
              Showing {skip + 1} to{" "}
              {Math.min(skip + itemsPerPage, totalUsers)} of{" "}
              {totalUsers.toLocaleString()} users
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

      {/* ============================================================
          MODAL 1: ADD NEW USER
      ============================================================ */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        contentClassName="user-modal-content border-0 rounded-4 overflow-hidden shadow-lg"
      >
        <div className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="modal-header-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
              <SetIcon
                Icon={usersPageIcons.userPlus}
                size={18}
                className="main-color"
              />
            </div>
            <div>
              <h6 className="fw-bolder text-dark mb-0">Add New User</h6>
              <span className="text-muted" style={{ fontSize: "0.76rem" }}>
                Create a new account for your store management team.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="btn-close shadow-none small"
          />
        </div>

        <Form onSubmit={handleCreateUser}>
          <Modal.Body className="p-4 bg-white">
            {/* Full Name & Username */}
            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-secondary mb-1">
                  Full Name
                </Form.Label>
                <Form.Control
                  required
                  ref={addFullNameRef}
                  type="text"
                  placeholder="Johnathan Doe"
                  className="user-soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>

              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-secondary mb-1">
                  Username
                </Form.Label>
                <InputGroup className="user-soft-group rounded-3 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 text-muted small pe-1">
                    @
                  </InputGroup.Text>
                  <Form.Control
                    required
                    ref={addUsernameRef}
                    type="text"
                    placeholder="johndoe"
                    className="border-0 bg-transparent py-2 small shadow-none"
                  />
                </InputGroup>
              </Col>
            </Row>

            {/* Email Address */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary mb-1">
                Email Address
              </Form.Label>
              <InputGroup className="user-soft-group rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 text-muted pe-1">
                  <SetIcon Icon={loginIcons.mail} size={16} />
                </InputGroup.Text>
                <Form.Control
                  required
                  ref={addEmailRef}
                  type="email"
                  placeholder="john@shopstream.com"
                  className="border-0 bg-transparent py-2 small shadow-none"
                />
              </InputGroup>
            </Form.Group>

            {/* Role & Password */}
            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-secondary mb-1">
                  Role
                </Form.Label>
                <Form.Select
                  ref={addRoleRef}
                  defaultValue="Customer"
                  className="user-soft-input rounded-3 py-2 small shadow-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-secondary mb-1">
                  Password
                </Form.Label>
                <Form.Control
                  required
                  ref={addPasswordRef}
                  type="password"
                  placeholder="••••••••"
                  className="user-soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>
            </Row>

            {/* Profile Picture Upload */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary mb-1">
                Profile Picture
              </Form.Label>
              <input
                ref={addFileRef}
                type="file"
                accept="image/*"
                onChange={handleAddImageChange}
                className="d-none"
              />
              <div
                role="button"
                onClick={() => addFileRef.current?.click()}
                className="add-user-photo-box rounded-3 p-2 px-3 d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3">
                  {addAvatarPreview ? (
                    <img
                      src={addAvatarPreview}
                      alt="Preview"
                      className="upload-avatar-preview rounded-circle object-fit-cover"
                    />
                  ) : (
                    <div className="upload-icon-circle rounded-circle d-flex align-items-center justify-content-center">
                      <SetIcon
                        Icon={inventoryIcons.camera}
                        size={16}
                        className="main-color"
                      />
                    </div>
                  )}
                  <div>
                    <span className="d-block fw-semibold text-dark small">
                      {addAvatarPreview
                        ? "Photo selected"
                        : "Upload user profile photo"}
                    </span>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      PNG or JPG up to 10MB
                    </span>
                  </div>
                </div>
                <span className="browse-pill px-3 py-1 rounded-2 fw-semibold small">
                  Browse
                </span>
              </div>
            </Form.Group>

            {/* Info Box */}
            <div className="user-info-banner rounded-3 p-3 d-flex align-items-start gap-2">
              <SetIcon
                Icon={profilePageIcons.info}
                size={17}
                className="main-color flex-shrink-0 mt-1"
              />
              <span style={{ fontSize: "0.75rem", color: "#334155" }}>
                A verification email will be sent to the new user automatically
                to set up their multi-factor authentication.
              </span>
            </div>
          </Modal.Body>

          <div className="modal-footer-bar px-4 py-3 d-flex justify-content-end align-items-center gap-2 border-top">
            <Button
              type="button"
              variant="light"
              onClick={() => setShowAddModal(false)}
              className="cancel-outline-btn bg-white rounded-3 px-4 py-2 fw-semibold small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-main-color border-0 rounded-3 px-4 py-2 fw-semibold small d-flex align-items-center gap-2"
            >
              <SetIcon
                Icon={usersPageIcons.userPlus}
                size={15}
                color="#ffffff"
              />
              <span>Create User</span>
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ============================================================
          MODAL 2: EDIT USER
      ============================================================ */}
      <Modal
        show={Boolean(editingUser)}
        onHide={() => setEditingUser(null)}
        centered
        contentClassName="user-modal-content border-0 rounded-4 overflow-hidden shadow-lg"
      >
        {editingUser && (
          <>
            <div className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="modal-header-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                  <SetIcon
                    Icon={dashboardIcons.users}
                    size={18}
                    className="main-color"
                  />
                </div>
                <div>
                  <h6 className="fw-bolder text-dark mb-0">Edit User</h6>
                  <span className="text-muted" style={{ fontSize: "0.76rem" }}>
                    Update {editingUser.firstName} {editingUser.lastName}'s
                    profile details
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn-close shadow-none small"
              />
            </div>

            <Form onSubmit={handleSaveEdit}>
              <Modal.Body className="p-4 bg-white">
                {/* Profile Picture Top Section */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <img
                    src={editAvatarPreview || DEFAULT_AVATAR}
                    alt={editingUser.firstName}
                    className="edit-profile-avatar rounded-circle object-fit-cover flex-shrink-0"
                  />
                  <div>
                    <h6 className="fw-bold text-dark small mb-0">
                      Profile Picture
                    </h6>
                    <span
                      className="text-muted d-block mb-2"
                      style={{ fontSize: "0.74rem" }}
                    >
                      PNG or JPG up to 10MB
                    </span>
                    <input
                      ref={editFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="d-none"
                    />
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        onClick={() => editFileRef.current?.click()}
                        className="upload-new-btn rounded-2 px-3 py-1 fw-bold"
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditAvatarPreview(DEFAULT_AVATAR)}
                        className="remove-pic-btn border-0 bg-transparent fw-bold p-0"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full Name & Username */}
                <Row className="g-3 mb-3">
                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      required
                      ref={editFullNameRef}
                      type="text"
                      defaultValue={`${editingUser.firstName} ${editingUser.lastName}`}
                      className="user-soft-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      Username
                    </Form.Label>
                    <Form.Control
                      required
                      ref={editUsernameRef}
                      type="text"
                      defaultValue={editingUser.username}
                      className="user-soft-input rounded-3 py-2 small shadow-none"
                    />
                  </Col>
                </Row>

                {/* Email Address */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary mb-1">
                    Email Address
                  </Form.Label>
                  <InputGroup className="user-soft-group rounded-3 overflow-hidden">
                    <InputGroup.Text className="bg-transparent border-0 text-muted pe-1">
                      <SetIcon Icon={loginIcons.mail} size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      ref={editEmailRef}
                      type="email"
                      defaultValue={editingUser.email}
                      className="border-0 bg-transparent py-2 small shadow-none"
                    />
                  </InputGroup>
                </Form.Group>

                {/* Role & Status Switch */}
                <Row className="g-3 mb-3">
                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      Role
                    </Form.Label>
                    <Form.Select
                      ref={editRoleRef}
                      defaultValue={getUserRole(editingUser)}
                      className="user-soft-input rounded-3 py-2 small shadow-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Customer">Customer</option>
                    </Form.Select>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Label className="small fw-bold text-secondary mb-1">
                      Status
                    </Form.Label>
                    <div className="user-soft-input rounded-3 px-3 py-2 d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold text-dark">
                        {editActiveStatus ? "Active" : "Inactive"}
                      </span>
                      <Form.Check
                        type="switch"
                        checked={editActiveStatus}
                        onChange={(e) => setEditActiveStatus(e.target.checked)}
                        className="status-green-switch mb-0"
                      />
                    </div>
                  </Col>
                </Row>

                {/* Info Box */}
                <div className="user-info-banner rounded-3 p-3 d-flex align-items-start gap-2">
                  <SetIcon
                    Icon={profilePageIcons.info}
                    size={17}
                    className="main-color flex-shrink-0 mt-1"
                  />
                  <span style={{ fontSize: "0.75rem", color: "#334155" }}>
                    Updating user roles may affect their access to specific
                    store departments and financial reports. Ensure this action
                    complies with your security policy.
                  </span>
                </div>
              </Modal.Body>

              <div className="modal-footer-bar px-4 py-3 d-flex justify-content-end align-items-center gap-2 border-top">
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setEditingUser(null)}
                  className="cancel-outline-btn bg-white rounded-3 px-4 py-2 fw-semibold small"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-main-color border-0 rounded-3 px-4 py-2 fw-semibold small d-flex align-items-center gap-2"
                >
                  <SetIcon
                    Icon={inventoryIcons.save}
                    size={15}
                    color="#ffffff"
                  />
                  <span>Update User</span>
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal>

      {/* ============================================================
          MODAL 3: DELETE USER ACCOUNT
      ============================================================ */}
      <Modal
        show={Boolean(deletingUser)}
        onHide={() => setDeletingUser(null)}
        centered
        contentClassName="delete-user-modal border-0 rounded-4 overflow-hidden shadow-lg"
      >
        {deletingUser && (
          <Modal.Body className="p-4 p-sm-5 text-center bg-white">
            {/* Top Bar Handle */}
            <div className="modal-top-handle mx-auto mb-4 rounded-pill" />

            {/* Warning Icon Circle */}
            <div className="warning-icon-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
              <SetIcon
                Icon={inventoryIcons.warning}
                size={22}
                color="#b91c1c"
              />
            </div>

            <h4 className="fw-bolder text-dark mb-2">Delete User Account?</h4>
            <p className="text-muted small mb-4 px-sm-2">
              This action cannot be undone. All data associated with this user
              will be permanently removed from the ShopStream systems.
            </p>

            {/* User Preview Card */}
            <div className="delete-user-card rounded-4 p-3 mb-4 d-flex align-items-center gap-3 text-start">
              <img
                src={deletingUser.image || DEFAULT_AVATAR}
                alt={deletingUser.firstName}
                className="delete-user-avatar rounded-circle object-fit-cover flex-shrink-0"
              />

              <div className="overflow-hidden">
                <h6 className="fw-bolder text-dark mb-0 text-truncate">
                  {deletingUser.firstName} {deletingUser.lastName}
                </h6>
                <span className="text-muted small d-block mb-2 text-truncate">
                  {deletingUser.email}
                </span>
                <span className="delete-role-pill d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-bold">
                  <SetIcon Icon={usersPageIcons.shield} size={12} />
                  <span>{getUserRole(deletingUser)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <Row className="g-2 mb-4">
              <Col xs={12} sm={6}>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setDeletingUser(null)}
                  className="go-back-btn border-0 w-100 py-2 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2"
                >
                  <SetIcon Icon={usersPageIcons.arrowLeft} size={15} />
                  <span>Go Back</span>
                </Button>
              </Col>

              <Col xs={12} sm={6}>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="confirm-delete-btn border-0 w-100 py-2 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2"
                >
                  <SetIcon
                    Icon={inventoryIcons.delete}
                    size={15}
                    color="#ffffff"
                  />
                  <span>Delete User</span>
                </Button>
              </Col>
            </Row>

            <div className="revoke-note d-flex align-items-center justify-content-center gap-1">
              <SetIcon Icon={profilePageIcons.info} size={13} />
              <span>Deleting a user will also revoke all API access keys.</span>
            </div>
          </Modal.Body>
        )}
      </Modal>

      {/* ============================================================
          CONFIRMATION ALERT MODAL
      ============================================================ */}
      <Modal
        show={Boolean(alertInfo.message)}
        onHide={() => setAlertInfo({ title: "", message: "" })}
        centered
        size="sm"
        contentClassName="border-0 rounded-4 shadow"
      >
        <Modal.Body className="text-center p-4">
          <div className="success-alert-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
            <SetIcon
              Icon={checkoutPageIcons.check}
              size={24}
              color="#00714d"
            />
          </div>
          <h6 className="fw-bolder text-dark mb-2">{alertInfo.title}</h6>
          <p className="text-muted small mb-4">{alertInfo.message}</p>
          <Button
            onClick={() => setAlertInfo({ title: "", message: "" })}
            className="bg-main-color border-0 w-100 py-2 rounded-3 fw-semibold small"
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}