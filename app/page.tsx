"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  name?: string;
  quantity?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editError, setEditError] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/products${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  // Client-side validation
  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = "Product name is required.";
    const qty = Number(quantity);
    if (quantity === "") {
      errors.quantity = "Quantity is required.";
    } else if (!Number.isInteger(qty)) {
      errors.quantity = "Quantity must be a whole number.";
    } else if (qty < 0) {
      errors.quantity = "Quantity cannot be negative.";
    }
    return errors;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sku, quantity: Number(quantity) }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormErrors(data.errors || {});
    } else {
      setName("");
      setSku("");
      setQuantity("0");
      setFormErrors({});
      fetchProducts();
    }
    setSubmitting(false);
  }

  async function handleUpdate(id: string) {
    const qty = Number(editQuantity);
    if (editQuantity === "" || !Number.isInteger(qty)) {
      setEditError("Enter a valid whole number.");
      return;
    }
    if (qty < 0) {
      setEditError("Cannot be negative.");
      return;
    }

    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });

    if (res.ok) {
      setEditingId(null);
      setEditError("");
      fetchProducts();
    } else {
      const data = await res.json();
      setEditError(data.errors?.quantity || "Update failed.");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    fetchProducts();
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditQuantity(String(product.quantity));
    setEditError("");
  }

  return (
    <main className="container">
      <header className="app-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <div>
          <h1>Inventory Tracker</h1>
          <p className="subtitle">Manage your product stock in real-time</p>
        </div>
      </header>

      {/* Add Product Form */}
      <section className="card form-card">
        <h2>Add Product</h2>
        <form onSubmit={handleAdd} className="add-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-name">Name *</label>
              <input
                id="product-name"
                type="text"
                placeholder="e.g. Wireless Mouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={formErrors.name ? "input-error" : ""}
              />
              {formErrors.name && <span className="error-msg">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="product-sku">SKU</label>
              <input
                id="product-sku"
                type="text"
                placeholder="e.g. WM-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-quantity">Quantity *</label>
              <input
                id="product-quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={formErrors.quantity ? "input-error" : ""}
              />
              {formErrors.quantity && <span className="error-msg">{formErrors.quantity}</span>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting} id="add-product-btn">
            {submitting ? (
              <span className="spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Product
              </>
            )}
          </button>
        </form>
      </section>

      {/* Inventory Table */}
      <section className="card table-card">
        <div className="table-header">
          <h2>Inventory</h2>
          <div className="search-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner large" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <p>No products found.</p>
            <p className="empty-hint">
              {search ? "Try a different search term." : "Add your first product above."}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="name-cell">{product.name}</td>
                    <td className="sku-cell">{product.sku || "—"}</td>
                    <td className="qty-cell">
                      {editingId === product.id ? (
                        <div className="inline-edit">
                          <input
                            id={`edit-qty-${product.id}`}
                            type="number"
                            min="0"
                            step="1"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate(product.id);
                              if (e.key === "Escape") {
                                setEditingId(null);
                                setEditError("");
                              }
                            }}
                            autoFocus
                            className={editError ? "input-error" : ""}
                          />
                          {editError && <span className="error-msg">{editError}</span>}
                        </div>
                      ) : (
                        <span className="qty-badge">{product.quantity}</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {editingId === product.id ? (
                        <div className="action-group">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleUpdate(product.id)}
                            id={`save-btn-${product.id}`}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              setEditingId(null);
                              setEditError("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : deletingId === product.id ? (
                        <div className="action-group confirm-delete">
                          <span className="confirm-text">Delete?</span>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
                            id={`confirm-delete-${product.id}`}
                          >
                            Yes
                          </button>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setDeletingId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="action-group">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => startEdit(product)}
                            id={`edit-btn-${product.id}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => setDeletingId(product.id)}
                            id={`delete-btn-${product.id}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
