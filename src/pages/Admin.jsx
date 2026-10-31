import ProductImage from '../components/ProductImage'
import { useState } from 'react'
import { allStatuses, categories, skinTypes, statusColor, money } from '../data/constants'

const emptyProduct = {
  name: '',
  brand: '',
  category: 'Serum',
  skinType: 'Oily',
  price: '',
  mrp: '',
  size: '',
  stock: '',
  image: '',
  description: '',
}

function Admin({ products, orders, onAddProduct, onDeleteProduct, onUpdateProduct, onStatusChange, onSaveTracking }) {
  const [tab, setTab] = useState('overview')
  const [form, setForm] = useState(emptyProduct)
  const [errors, setErrors] = useState({})
  const [tracking, setTracking] = useState({}) // tracking text typed for each order

  // ---------- numbers for the overview ----------
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter((o) => ['Placed', 'Packed'].includes(o.status)).length
  const lowStock = products.filter((p) => p.stock < 10)

  // ---------- add product ----------
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Enter product name'
    if (form.brand.trim().length < 2) e.brand = 'Enter brand'
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter price'
    if (!form.mrp || Number(form.mrp) < Number(form.price)) e.mrp = 'MRP must be more than price'
    if (!form.size.trim()) e.size = 'Enter size'
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Enter stock'
    if (form.description.trim().length < 15) e.description = 'Write a short description (min 15 letters)'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onAddProduct({
        ...form,
        name: form.name.trim(),
        brand: form.brand.trim(),
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        rating: 4.0,
        color: '#fde8ef',
        ingredients: ['Natural extracts'],
        howToUse: 'Follow the instructions on the pack.',
      })
      setForm(emptyProduct)
    }
  }

  const cls = (field) => 'form-control' + (errors[field] ? ' is-invalid' : '')

  return (
    <div className="container py-4">
      <h4 className="mb-3">Admin Panel</h4>

      <ul className="nav nav-pills mb-4">
        {[
          ['overview', 'Overview'],
          ['orders', 'Orders (' + orders.length + ')'],
          ['products', 'Products (' + products.length + ')'],
        ].map(([key, label]) => (
          <li className="nav-item" key={key}>
            <button className={'nav-link me-2 ' + (tab === key ? 'active bg-secondary' : 'text-dark')} onClick={() => setTab(key)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* ================= OVERVIEW ================= */}
      {tab === 'overview' && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm p-3">
                <small className="text-muted">Products</small>
                <h2 className="mb-0">{products.length}</h2>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card stat-card orange border-0 shadow-sm p-3">
                <small className="text-muted">Orders to process</small>
                <h2 className="mb-0">{pending}</h2>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card stat-card green border-0 shadow-sm p-3">
                <small className="text-muted">Revenue</small>
                <h2 className="mb-0">{money(revenue)}</h2>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card stat-card purple border-0 shadow-sm p-3">
                <small className="text-muted">Low stock items</small>
                <h2 className="mb-0">{lowStock.length}</h2>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold">⚠️ Low stock (less than 10)</div>
            <ul className="list-group list-group-flush">
              {lowStock.length === 0 && <li className="list-group-item text-muted">All products have enough stock.</li>}
              {lowStock.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <span>
                    <span className="d-flex align-items-center gap-2">
                            <ProductImage product={p} className="admin-product-photo" />
                            {p.name}
                          </span>
                  </span>
                  <span className={'badge ' + (p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark')}>{p.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* ================= ORDERS ================= */}
      {tab === 'orders' && (
        <>
          {orders.length === 0 && <div className="alert alert-info">No orders yet. Orders placed by customers will appear here.</div>}

          {orders.map((o) => (
            <div key={o.id} className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <b>#{o.id}</b>
                  <span className="text-muted small ms-2">
                    {o.date} • {o.userEmail}
                  </span>
                </div>
                <span className={'badge bg-' + statusColor[o.status]}>{o.status}</span>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-5">
                    {o.items.map((i) => (
                      <div key={i.productId} className="small">
                        {i.name} × {i.qty}
                      </div>
                    ))}
                    <div className="fw-bold mt-2">
                      {money(o.total)} <span className="text-muted fw-normal small">({o.payment})</span>
                    </div>
                  </div>

                  <div className="col-md-3 small text-muted">
                    {o.address.name}
                    <br />
                    {o.address.phone}
                    <br />
                    {o.address.address}, {o.address.city} - {o.address.pincode}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small mb-1">Update status</label>
                    <select
                      className="form-select form-select-sm mb-2"
                      value={o.status}
                      disabled={o.status === 'Cancelled'}
                      onChange={(e) => onStatusChange(o.id, e.target.value)}
                    >
                      {allStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    {(o.status === 'Shipped' || o.status === 'Out for Delivery') && (
                      <div className="input-group input-group-sm">
                        <input
                          className="form-control"
                          placeholder="Courier tracking ID"
                          value={tracking[o.id] !== undefined ? tracking[o.id] : o.tracking ? o.tracking.trackingId : ''}
                          onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })}
                        />
                        <button
                          className="btn btn-outline-glow"
                          onClick={() => onSaveTracking(o.id, tracking[o.id] || '')}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ================= PRODUCTS ================= */}
      {tab === 'products' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Add New Product</h6>
                <form onSubmit={handleAdd} noValidate>
                  <div className="mb-2">
                    <input name="name" placeholder="Product name" className={cls('name')} value={form.name} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                  <div className="mb-2">
                    <input name="brand" placeholder="Brand" className={cls('brand')} value={form.brand} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.brand}</div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <select name="skinType" className="form-select" value={form.skinType} onChange={handleChange}>
                        {skinTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input name="price" type="number" placeholder="Price ₹" className={cls('price')} value={form.price} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.price}</div>
                    </div>
                    <div className="col-6">
                      <input name="mrp" type="number" placeholder="MRP ₹" className={cls('mrp')} value={form.mrp} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.mrp}</div>
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-4">
                      <input name="size" placeholder="Size" className={cls('size')} value={form.size} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.size}</div>
                    </div>
                    <div className="col-4">
                      <input name="stock" type="number" placeholder="Stock" className={cls('stock')} value={form.stock} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.stock}</div>
                    </div>
                    <div className="col-4">
                      <input name="image" placeholder="Image URL" className="form-control" value={form.image || ''} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="description"
                      rows="3"
                      placeholder="Description"
                      className={cls('description')}
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                    <div className="invalid-feedback">{errors.description}</div>
                  </div>
                  <button type="submit" className="btn btn-glow w-100">
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th style={{ width: 90 }}>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="d-flex align-items-center gap-2">
                            <ProductImage product={p} className="admin-product-photo" />
                            {p.name}
                          </span>
                          <div className="small text-muted">{p.brand}</div>
                        </td>
                        <td>{p.category}</td>
                        <td>{money(p.price)}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={p.stock}
                            onChange={(e) => onUpdateProduct(p.id, { stock: Math.max(0, Number(e.target.value)) })}
                          />
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteProduct(p.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
