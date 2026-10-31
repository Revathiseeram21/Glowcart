import { useState } from 'react'
import { money } from '../data/constants'
import ProductImage from '../components/ProductImage'

function ProductDetails({ product, wished, onBack, onAdd, onToggleWish, onGoCart }) {
  const [qty, setQty] = useState(1)
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <div className="container py-4">
      <button className="btn btn-link px-0 mb-3 text-glow" onClick={onBack}>
        ← Back to shop
      </button>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="product-img big shadow-sm" style={{ background: product.color }}>
            <ProductImage product={product} className="product-photo" />
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">{product.brand}</small>
              <h3 className="mb-1">{product.name}</h3>
              <p className="text-muted mb-2">
                ★ {product.rating} &nbsp;|&nbsp; {product.size}
              </p>

              <div className="mb-3">
                <span className="fs-3 fw-bold me-2">{money(product.price)}</span>
                <span className="text-muted text-decoration-line-through me-2">{money(product.mrp)}</span>
                <span className="badge bg-success">{off}% OFF</span>
              </div>

              <div className="mb-3">
                <span className="badge bg-glow-soft text-glow me-2">{product.category}</span>
                <span className="badge bg-light text-dark border">Best for {product.skinType} skin</span>
              </div>

              <h6>About this product</h6>
              <p className="text-muted">{product.description}</p>

              <h6>Key Ingredients</h6>
              <div className="mb-3">
                {product.ingredients.map((item) => (
                  <span key={item} className="badge bg-glow-soft text-glow me-1 mb-1">
                    {item}
                  </span>
                ))}
              </div>

              <h6>How to use</h6>
              <p className="text-muted">{product.howToUse}</p>

              {product.stock === 0 ? (
                <div className="alert alert-secondary mb-0">This product is currently out of stock.</div>
              ) : (
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <select
                    className="form-select w-auto"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Qty: {n}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-glow" onClick={() => onAdd(product, qty)}>
                    Add to Cart
                  </button>
                  <button className="btn btn-outline-glow" onClick={onGoCart}>
                    Go to Cart
                  </button>
                  <button className="btn btn-light border" onClick={() => onToggleWish(product)}>
                    {wished ? '❤️ Wishlisted' : '🤍 Wishlist'}
                  </button>
                </div>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-danger small mt-2 mb-0">Hurry! Only {product.stock} left in stock.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
