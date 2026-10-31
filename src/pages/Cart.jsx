import { useState } from 'react'
import CheckoutForm from '../components/CheckoutForm'
import { calcTotals, coupons, money } from '../data/constants'
import ProductImage from '../components/ProductImage'

function Cart({ lines, user, onChangeQty, onRemove, onPlaceOrder, onBrowse, onGoLogin, onGoRegister }) {
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState('')
  const [couponStatus, setCouponStatus] = useState('')
  const [checkout, setCheckout] = useState(false)

  const totals = calcTotals(lines, coupon)

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (coupons[code]) {
      setCoupon(code)
      setCouponStatus('success')
    } else {
      setCoupon('')
      setCouponStatus('error')
    }
  }

  const handleCheckout = (form) => {
    onPlaceOrder({
      items: lines.map((l) => ({
        productId: l.id,
        name: l.name,
        emoji: l.emoji,
        image: l.image,
        price: l.price,
        qty: l.qty,
      })),
      ...totals,
      coupon,
      address: { name: form.name, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode },
      payment: form.payment,
    })
  }

  if (lines.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h4>Your cart is empty</h4>
        <p className="text-muted">Add some skincare products to get started.</p>
        <button className="btn btn-glow" onClick={onBrowse}>
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h4 className="mb-3">Shopping Cart ({lines.length} items)</h4>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <ul className="list-group list-group-flush">
              {lines.map((l) => (
                <li key={l.id} className="list-group-item d-flex align-items-center gap-3 py-3">
                  <ProductImage product={l} className="cart-product-photo" />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{l.name}</div>
                    <small className="text-muted">
                      {l.brand} • {l.size}
                    </small>
                    <div>{money(l.price)}</div>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => onChangeQty(l.id, l.qty - 1)}>
                      −
                    </button>
                    <span className="btn btn-light disabled">{l.qty}</span>
                    <button className="btn btn-outline-secondary" onClick={() => onChangeQty(l.id, l.qty + 1)}>
                      +
                    </button>
                  </div>
                  <div className="fw-semibold" style={{ width: 70, textAlign: 'right' }}>
                    {money(l.price * l.qty)}
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(l.id)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <h6>Apply Coupon</h6>
              <div className="input-group mb-1">
                <input
                  className="form-control"
                  placeholder="Try GLOW10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn btn-outline-glow" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
              {couponStatus === 'success' && (
                <small className="text-success">Coupon {coupon} applied – you saved {money(totals.discount)}</small>
              )}
              {couponStatus === 'error' && <small className="text-danger">Invalid coupon code</small>}

              <hr />
              <h6>Price Details</h6>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>{money(totals.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between text-success">
                <span>Discount</span>
                <span>- {money(totals.discount)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery</span>
                <span>{totals.delivery === 0 ? 'FREE' : money(totals.delivery)}</span>
              </div>
              {totals.delivery > 0 && (
                <small className="text-muted">Free delivery on orders above ₹499</small>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>{money(totals.total)}</span>
              </div>

              {!checkout && (
                <div className="mt-3">
                  {!user ? (
                    <div className="text-center">
                      <p className="text-muted mb-2">Login to place your order</p>
                      <button className="btn btn-glow me-2" onClick={onGoLogin}>
                        Login
                      </button>
                      <button className="btn btn-outline-glow" onClick={onGoRegister}>
                        Register
                      </button>
                    </div>
                  ) : user.role === 'admin' ? (
                    <div className="alert alert-warning mb-0">Admin accounts cannot place orders.</div>
                  ) : (
                    <button className="btn btn-glow w-100" onClick={() => setCheckout(true)}>
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {checkout && user && user.role === 'customer' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <CheckoutForm user={user} onSubmit={handleCheckout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
