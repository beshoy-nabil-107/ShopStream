import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Dropdown,
  Modal,
  InputGroup,
} from "react-bootstrap";
import {
  fetchAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "../../../store/slices/productSlice";
import {
  appLayoutIcons,
  productsPageIcons,
  checkoutPageIcons,
  profilePageIcons,
  loginIcons,
  inventoryIcons,
  SetIcon,
} from "../../../assets/icons";
import "./Inventory.scss";
import defaultProductImg from "../../../assets/images/default-product-image.png";
const CATEGORIES = [
  "all",
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
  "mens-watches",
  "womens-watches",
  "furniture",
  "home-decoration",
  "groceries",
  "beauty",
  "fragrances",
  "sunglasses",
];

const DEFAULT_IMAGE = defaultProductImg;

export default function Inventory() {
  const dispatch = useDispatch();
  const { allProducts, total, isLoading } = useSelector(
    (store) => store.products,
  );

  // Search, Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Add Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addPreviewImg, setAddPreviewImg] = useState("");

  // Edit Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [isPublished, setIsPublished] = useState(true);

  // Delete Modal state
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Confirmation Alert state
  const [alertInfo, setAlertInfo] = useState({ title: "", message: "" });

  // Refs for Add Modal
  const addFileRef = useRef(null);
  const addTitleRef = useRef(null);
  const addSkuRef = useRef(null);
  const addCategoryRef = useRef(null);
  const addPriceRef = useRef(null);
  const addStockRef = useRef(null);
  const addDescRef = useRef(null);

  // Refs for Edit Modal
  const editFileRef = useRef(null);
  const editTitleRef = useRef(null);
  const editSkuRef = useRef(null);
  const editCategoryRef = useRef(null);
  const editPriceRef = useRef(null);
  const editStockRef = useRef(null);
  const editDescRef = useRef(null);

  const itemsPerPage = 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        limit: itemsPerPage,
        skip,
        category: selectedCategory,
        searchQuery: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, selectedCategory, debouncedSearch, skip]);

  const totalPages = Math.ceil(total / itemsPerPage);

  // Pagination numbers with dots
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

  // Stock status
  const getStockInfo = (stock) => {
    if (stock === 0) return { text: "Out of Stock", dotClass: "out-stock" };
    if (stock <= 10)
      return { text: `Only ${stock} Left`, dotClass: "low-stock" };
    return { text: `${stock} In Stock`, dotClass: "in-stock" };
  };

  // --- ADD PRODUCT HANDLERS ---
  const handleOpenAdd = () => {
    setAddPreviewImg("");
    setShowAddModal(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const imgUrl = addPreviewImg || DEFAULT_IMAGE;

    const newProduct = {
      id: Date.now(),
      title: addTitleRef.current.value.trim(),
      sku:
        addSkuRef.current.value.trim() ||
        `SKU-${Date.now().toString().slice(-4)}`,
      category: addCategoryRef.current.value,
      price: Number(addPriceRef.current.value) || 0,
      stock: Number(addStockRef.current.value) || 0,
      description: addDescRef.current.value.trim(),
      thumbnail: imgUrl,
      images: [imgUrl],
    };

    dispatch(addProduct(newProduct));
    setShowAddModal(false);
    setCurrentPage(1);
    setAlertInfo({
      title: "Product Added!",
      message: `"${newProduct.title}" has been added to the top of your inventory.`,
    });
  };

  // --- EDIT PRODUCT HANDLERS ---
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const productImgs =
      product.images && product.images.length > 0
        ? product.images
        : [product.thumbnail];
    setEditImages(productImgs);
    setIsPublished(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditImages((prev) => [url, ...prev]);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...editingProduct,
      title: editTitleRef.current.value.trim(),
      sku: editSkuRef.current.value.trim(),
      category: editCategoryRef.current.value,
      price: Number(editPriceRef.current.value) || 0,
      stock: Number(editStockRef.current.value) || 0,
      description: editDescRef.current.value.trim(),
      thumbnail: editImages[0] || editingProduct.thumbnail,
      images: editImages,
    };

    dispatch(editProduct(updatedProduct));
    setEditingProduct(null);
    setAlertInfo({
      title: "Changes Saved!",
      message: `"${updatedProduct.title}" has been updated successfully.`,
    });
  };

  // --- DELETE PRODUCT HANDLER ---
  const handleConfirmDelete = () => {
    const deletedTitle = deletingProduct.title;
    dispatch(deleteProduct(deletingProduct.id));
    setDeletingProduct(null);
    setAlertInfo({
      title: "Product Deleted!",
      message: `"${deletedTitle}" has been removed from your inventory.`,
    });
  };

  return (
    <div className="inventory-page">
      {/* Top Header & Add Product Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder text-dark mb-1">Product Inventory</h3>
          <p className="text-muted small mb-0">
            Manage your catalog, stock levels, and pricing.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="add-product-btn border-0 rounded-3 px-3 py-2 fw-bold small d-flex align-items-center gap-2"
        >
          <SetIcon Icon={inventoryIcons.plus} size={16} />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border rounded-4 p-3 mb-4 bg-white shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3">
          <div className="inventory-search d-flex align-items-center px-3 py-1 rounded-3 flex-grow-1">
            <SetIcon Icon={appLayoutIcons.Search} size={18} color="#94a3b8" />
            <Form.Control
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              placeholder="Search products by name..."
              className="border-0 bg-transparent shadow-none small"
            />
          </div>
              {/* Filter Dropdown & Export Button */}
          <div className="d-flex align-items-center gap-2">
            <Dropdown
              onSelect={(cat) => {
                setSelectedCategory(cat);
                setSearchTerm("");
                setDebouncedSearch("");
                setCurrentPage(1);
              }}
            >
              <Dropdown.Toggle
                variant="light"
                className="toolbar-btn border bg-white rounded-3 px-3 py-2 small fw-semibold text-dark d-flex align-items-center gap-2"
              >
                <SetIcon Icon={inventoryIcons.filter} size={15} />
                <span className="text-capitalize">
                  {selectedCategory === "all"
                    ? "Filters"
                    : selectedCategory.replace("-", " ")}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="category-dropdown-menu shadow-sm border rounded-3">
                {CATEGORIES.map((cat) => (
                  <Dropdown.Item
                    key={cat}
                    eventKey={cat}
                    active={selectedCategory === cat}
                    className="small text-capitalize"
                  >
                    {cat === "all" ? "All Categories" : cat.replace("-", " ")}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button
              variant="light"
              type="button"
              className="toolbar-btn border bg-white rounded-3 px-3 py-2 small fw-semibold text-dark d-flex align-items-center gap-2"
            >
              <SetIcon Icon={inventoryIcons.export} size={15} />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Table Card */}
      <Card className="border rounded-4 bg-white shadow-sm mb-4 overflow-hidden">
        <div className="table-responsive">
          <Table align="middle" className="mb-0 inventory-table">
            <thead>
              <tr className="border-bottom">
                <th className="py-3 px-4 text-secondary fw-semibold small">
                  Product
                </th>
                <th className="py-3 text-secondary fw-semibold small">
                  Category
                </th>
                <th className="py-3 text-secondary fw-semibold small">Price</th>
                <th className="py-3 text-secondary fw-semibold small">
                  Stock Status
                </th>
                <th className="py-3 px-4 text-secondary fw-semibold small text-end">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted small">
                    Loading inventory...
                  </td>
                </tr>
              ) : allProducts.length > 0 ? (
                allProducts.map((item) => {
                  const stockInfo = getStockInfo(item.stock);
                  return (
                    <tr key={item.id} className="border-bottom">
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="product-thumb-box rounded-3 p-1 d-flex align-items-center justify-content-center flex-shrink-0">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="img-fluid object-fit-contain"
                            />
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark small mb-0">
                              {item.title}
                            </h6>
                            <span className="sku-text text-muted">
                              SKU: {item.sku || `SS-${item.id}00`}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-pill px-2 py-1 rounded-pill fw-bold text-uppercase">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bolder text-dark">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`stock-dot rounded-circle ${stockInfo.dotClass}`}
                          />
                          <span className="small fw-medium text-dark">
                            {stockInfo.text}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="icon-action-btn edit-btn border-0 bg-transparent p-1"
                            title="Edit Product"
                          >
                            <SetIcon Icon={inventoryIcons.edit} size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProduct(item)}
                            className="icon-action-btn delete-btn border-0 bg-transparent p-1"
                            title="Delete Product"
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
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="table-footer p-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <span className="text-muted small">
              Showing {skip + 1} to {Math.min(skip + itemsPerPage, total)} of{" "}
              {total} products
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
                ),
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

      {/* Bottom Cards */}
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card className="stat-card border-0 rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="stat-icon purple-box rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={inventoryIcons.trend}
                  size={18}
                  color="#ffffff"
                />
              </div>
              <span className="growth-badge fw-bold">+12.5%</span>
            </div>
            <span className="stat-label text-muted fw-bold d-block mb-1">
              TOTAL SALES
            </span>
            <h4 className="fw-bolder text-dark mb-0">$48,290.00</h4>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="stat-card border-0 rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="stat-icon purple-box rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon Icon={appLayoutIcons.Cart} size={18} color="#ffffff" />
              </div>
              <span className="period-badge text-secondary fw-semibold">
                Current Period
              </span>
            </div>
            <span className="stat-label text-muted fw-bold d-block mb-1">
              ACTIVE CARTS
            </span>
            <h4 className="fw-bolder text-dark mb-0">1,240</h4>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="stat-card border-0 rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="stat-icon green-box rounded-3 d-flex align-items-center justify-content-center">
                <SetIcon
                  Icon={checkoutPageIcons.package}
                  size={18}
                  color="#00714d"
                />
              </div>
              <span className="alert-badge fw-bold">-4 Items</span>
            </div>
            <span className="stat-label text-muted fw-bold d-block mb-1">
              LOW STOCK ALERTS
            </span>
            <h4 className="fw-bolder text-dark mb-0">18</h4>
          </Card>
        </Col>
      </Row>

      {/* ============================================================
          MODAL 1: ADD NEW PRODUCT
      ============================================================ */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        contentClassName="add-modal-content border-0 rounded-4 overflow-hidden shadow-lg"
      >
        <div className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom bg-white">
          <h5 className="fw-bolder text-dark mb-0">Add New Product</h5>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="btn-close shadow-none small"
          />
        </div>

        <Form onSubmit={handleCreateProduct}>
          <Modal.Body className="p-4 bg-white">
            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-dark mb-1">
                  Product Name
                </Form.Label>
                <Form.Control
                  required
                  ref={addTitleRef}
                  type="text"
                  placeholder="e.g. SonicWave Pro 2"
                  className="soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>

              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-dark mb-1">
                  SKU
                </Form.Label>
                <Form.Control
                  ref={addSkuRef}
                  type="text"
                  placeholder="SKU-0000-XX"
                  className="soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-dark mb-1">
                  Category
                </Form.Label>
                <Form.Select
                  ref={addCategoryRef}
                  defaultValue="smartphones"
                  className="soft-input rounded-3 py-2 small shadow-none text-capitalize"
                >
                  {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("-", " ")}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-dark mb-1">
                  Price ($)
                </Form.Label>
                <Form.Control
                  required
                  ref={addPriceRef}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Label className="small fw-bold text-dark mb-1">
                  Stock Quantity
                </Form.Label>
                <Form.Control
                  required
                  ref={addStockRef}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="soft-input rounded-3 py-2 small shadow-none"
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-dark mb-1">
                Description
              </Form.Label>
              <Form.Control
                ref={addDescRef}
                as="textarea"
                rows={3}
                placeholder="Enter product details..."
                className="soft-input rounded-3 small shadow-none"
              />
            </Form.Group>

            <div>
              <Form.Label className="small fw-bold text-dark mb-1">
                Product Images
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
                className="upload-dropzone rounded-3 p-4 text-center d-flex flex-column align-items-center justify-content-center"
              >
                {addPreviewImg ? (
                  <img
                    src={addPreviewImg}
                    alt="Uploaded preview"
                    className="uploaded-thumb-preview object-fit-contain"
                  />
                ) : (
                  <>
                    <SetIcon
                      Icon={inventoryIcons.upload}
                      size={26}
                      className="main-color mb-2"
                    />
                    <span className="text-muted small">
                      Click or drag images to upload
                    </span>
                  </>
                )}
              </div>
            </div>
          </Modal.Body>

          <div className="modal-footer-bar px-4 py-3 d-flex justify-content-end align-items-center gap-3 border-top">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-link text-dark text-decoration-none fw-semibold small"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="bg-main-color border-0 rounded-3 px-4 py-2 fw-semibold small"
            >
              Create Product
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ============================================================
          MODAL 2: EDIT PRODUCT
      ============================================================ */}
      <Modal
        show={Boolean(editingProduct)}
        onHide={() => setEditingProduct(null)}
        centered
        size="lg"
        contentClassName="edit-modal-content border-0 rounded-4 overflow-hidden shadow-lg"
      >
        {editingProduct && (
          <>
            <div className="modal-header-bar px-4 py-3 d-flex justify-content-between align-items-center border-bottom">
              <div>
                <h6 className="fw-bold text-dark mb-0">Edit Product</h6>
                <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                  Update details for {editingProduct.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn-close shadow-none small"
              />
            </div>

            <Form onSubmit={handleSaveEdit}>
              <Modal.Body className="p-4 bg-white">
                <Row className="g-4">
                  <Col xs={12} md={5}>
                    <span className="section-label text-muted fw-bold d-block mb-2">
                      PRODUCT IMAGES
                    </span>

                    <div className="main-img-preview rounded-3 mb-3 d-flex align-items-center justify-content-center p-3">
                      <img
                        src={editImages[0] || editingProduct.thumbnail}
                        alt={editingProduct.title}
                        className="img-fluid object-fit-contain"
                      />
                    </div>

                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <div className="sub-img-preview rounded-3 d-flex align-items-center justify-content-center p-2">
                          <img
                            src={
                              editImages[1] ||
                              editImages[0] ||
                              editingProduct.thumbnail
                            }
                            alt="Secondary view"
                            className="img-fluid object-fit-contain"
                          />
                        </div>
                      </Col>

                      <Col xs={6}>
                        <input
                          ref={editFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          className="d-none"
                        />
                        <div
                          role="button"
                          onClick={() => editFileRef.current?.click()}
                          className="add-img-box rounded-3 d-flex flex-column align-items-center justify-content-center p-2 text-secondary"
                        >
                          <SetIcon Icon={inventoryIcons.camera} size={20} />
                          <span
                            className="fw-semibold mt-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Add Image
                          </span>
                        </div>
                      </Col>
                    </Row>

                    <div className="publish-status-box rounded-3 p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold text-dark mb-0 small">
                          Publish Status
                        </h6>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Visible on storefront
                        </span>
                      </div>
                      <Form.Check
                        type="switch"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="publish-switch fs-5 mb-0"
                      />
                    </div>
                  </Col>

                  <Col xs={12} md={7}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary mb-1">
                        Product Name
                      </Form.Label>
                      <Form.Control
                        required
                        ref={editTitleRef}
                        type="text"
                        defaultValue={editingProduct.title}
                        className="edit-input rounded-3 py-2 small shadow-none"
                      />
                    </Form.Group>

                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-secondary mb-1">
                          SKU
                        </Form.Label>
                        <Form.Control
                          ref={editSkuRef}
                          type="text"
                          defaultValue={
                            editingProduct.sku || `SS-${editingProduct.id}00`
                          }
                          className="edit-input rounded-3 py-2 small shadow-none"
                        />
                      </Col>

                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-secondary mb-1">
                          Category
                        </Form.Label>
                        <Form.Select
                          ref={editCategoryRef}
                          defaultValue={editingProduct.category}
                          className="edit-input rounded-3 py-2 small shadow-none text-capitalize"
                        >
                          {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.replace("-", " ")}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>

                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-secondary mb-1">
                          Price (USD)
                        </Form.Label>
                        <InputGroup className="edit-input-group rounded-3 overflow-hidden">
                          <InputGroup.Text className="bg-transparent border-0 text-muted small pe-1">
                            $
                          </InputGroup.Text>
                          <Form.Control
                            required
                            ref={editPriceRef}
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={editingProduct.price}
                            className="border-0 bg-transparent py-2 small shadow-none"
                          />
                        </InputGroup>
                      </Col>

                      <Col xs={6}>
                        <Form.Label className="small fw-semibold text-secondary mb-1">
                          Current Stock
                        </Form.Label>
                        <Form.Control
                          required
                          ref={editStockRef}
                          type="number"
                          min="0"
                          defaultValue={editingProduct.stock}
                          className="edit-input rounded-3 py-2 small shadow-none"
                        />
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary mb-1">
                        Description
                      </Form.Label>
                      <Form.Control
                        ref={editDescRef}
                        as="textarea"
                        rows={4}
                        defaultValue={editingProduct.description}
                        className="edit-input rounded-3 small shadow-none"
                      />
                    </Form.Group>

                    <div className="sync-info-box rounded-3 p-3 d-flex align-items-start gap-2">
                      <SetIcon
                        Icon={profilePageIcons.info}
                        size={18}
                        color="#00714d"
                        className="flex-shrink-0 mt-1"
                      />
                      <span style={{ fontSize: "0.76rem", color: "#005a3e" }}>
                        Changes will be reflected immediately in the Customer
                        Facing store. Inventory sync takes approximately 2-3
                        minutes.
                      </span>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>

              <div className="modal-footer-bar px-4 py-3 d-flex justify-content-between align-items-center border-top">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-link text-secondary text-decoration-none fw-semibold small p-0"
                >
                  Discard
                </button>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      if (editTitleRef.current) {
                        editTitleRef.current.value = `${editTitleRef.current.value} (Copy)`;
                      }
                    }}
                    className="duplicate-btn bg-white rounded-3 px-3 py-2 fw-semibold small"
                  >
                    Duplicate
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
                    <span>Save Changes</span>
                  </Button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Modal>

      {/* ============================================================
          MODAL 3: DELETE PRODUCT (Matches Figma Delete Modal)
      ============================================================ */}
      <Modal
        show={Boolean(deletingProduct)}
        onHide={() => setDeletingProduct(null)}
        centered
        contentClassName="delete-modal-content border-0 rounded-4 overflow-hidden shadow-lg"
      >
        {deletingProduct && (
          <Modal.Body className="p-4 p-sm-5 text-center bg-white">
            {/* Top Indicator Bar */}
            <div className="modal-top-handle mx-auto mb-4 rounded-pill" />

            {/* Warning Icon Circle */}
            <div className="warning-icon-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center">
              <SetIcon
                Icon={inventoryIcons.warning}
                size={22}
                color="#b91c1c"
              />
            </div>

            {/* Title & Description */}
            <h4 className="fw-bolder text-dark mb-2">Delete Product?</h4>
            <p className="text-muted small mb-4 px-sm-3">
              This action is permanent and cannot be undone. All data associated
              with this product will be removed from the store's inventory.
            </p>

            {/* Product Summary Box */}
            <div className="delete-product-preview rounded-3 p-3 mb-4 d-flex align-items-center gap-3 text-start">
              <div className="preview-img-box rounded-3 p-1 d-flex align-items-center justify-content-center flex-shrink-0">
                <img
                  src={deletingProduct.thumbnail}
                  alt={deletingProduct.title}
                  className="img-fluid object-fit-contain"
                />
              </div>

              <div className="overflow-hidden">
                <span className="stock-tag fw-bold d-block text-uppercase">
                  {deletingProduct.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
                <h6 className="fw-bolder text-dark mb-1 text-truncate">
                  {deletingProduct.title}
                </h6>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span
                    className="text-muted fw-medium"
                    style={{ fontSize: "0.75rem" }}
                  >
                    ID: {deletingProduct.sku || `SS-${deletingProduct.id}00`}
                  </span>
                  <span className="price-tag fw-bolder small">
                    ${Number(deletingProduct.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Row className="g-2 mb-4">
              <Col xs={12} sm={6}>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setDeletingProduct(null)}
                  className="cancel-delete-btn w-100 py-2 rounded-3 fw-bold small"
                >
                  Cancel and Go Back
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
                  <span>Confirm Delete</span>
                </Button>
              </Col>
            </Row>

            {/* Modal Footer Info */}
            <div className="delete-modal-footer pt-3 border-top">
              <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                <SetIcon Icon={loginIcons.lock} size={12} />
                <span className="fw-semibold">Secure Action Required</span>
              </div>
              <div>© {new Date().getFullYear()} ShopStream Inc. Internal Admin Tool</div>
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
            <SetIcon Icon={checkoutPageIcons.check} size={24} color="#00714d" />
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
