import { money } from '../data/constants'
import ProductImage from './ProductImage'

function ProductCard({ product, wished, onView, onAdd, onToggleWish }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <div className="card product-card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="product-img mb-3" style={{ background: product.color }}>
          <span className="badge bg-success discount-tag">{off}% OFF</span>
          <button
            className="wish-btn shadow-sm"
            title="Add to wishlist"
            onClick={() => onToggleWish(product)}
          >
            {wished ? '❤️' : '🤍'}
          </button>
          <ProductImage product={product} className="product-photo" />
        </div>

        <small className="text-muted">{product.brand}</small>
        <h6 className="card-title mb-1" style={{ cursor: 'pointer' }} onClick={() => onView(product)}>
          {product.name}
        </h6>
        <small className="text-muted mb-2">
          {product.size} • ★ {product.rating}
        </small>

        <div className="mb-2">
          <span className="badge bg-glow-soft text-glow me-1">{product.category}</span>
          <span className="badge bg-light text-dark border">{product.skinType} skin</span>
        </div>

        <div className="mb-3">
          <span className="fw-bold fs-5">{money(product.price)}</span>{' '}
          <small className="text-muted text-decoration-line-through">{money(product.mrp)}</small>
        </div>

        {product.stock === 0 ? (
          <button className="btn btn-secondary mt-auto" disabled>
            Out of Stock
          </button>
        ) : (
          <div className="d-flex gap-2 mt-auto">
            <button className="btn btn-outline-glow flex-fill" onClick={() => onView(product)}>
              View
            </button>
            <button className="btn btn-glow flex-fill" onClick={() => onAdd(product, 1)}>
              Add to Cart
            </button>
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <small className="text-danger mt-2">Only {product.stock} left!</small>
        )}
      </div>
    </div>
  )
}

export default ProductCard
