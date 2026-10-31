import { orderFlow, statusColor, money } from '../data/constants'
import ProductImage from '../components/ProductImage'

function Dashboard({ user, orders, wishlist, onViewProduct, onAdd, onViewAll }) {
  const inTransit = orders.filter((o) => ['Packed', 'Shipped', 'Out for Delivery'].includes(o.status))
  const delivered = orders.filter((o) => o.status === 'Delivered').length
  const totalSpent = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
  const recent = orders.slice(0, 3)

  const progress = (status) => ((orderFlow.indexOf(status) + 1) / orderFlow.length) * 100

  return (
    <div className="container py-4">
      <h4>Welcome, {user.name} 👋</h4>
      <p className="text-muted">Here is a quick look at your orders and wishlist.</p>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card stat-card border-0 shadow-sm p-3">
            <small className="text-muted">Total Orders</small>
            <h2 className="mb-0">{orders.length}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card stat-card orange border-0 shadow-sm p-3">
            <small className="text-muted">In Transit</small>
            <h2 className="mb-0">{inTransit.length}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card stat-card green border-0 shadow-sm p-3">
            <small className="text-muted">Delivered</small>
            <h2 className="mb-0">{delivered}</h2>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card stat-card purple border-0 shadow-sm p-3">
            <small className="text-muted">Total Spent</small>
            <h2 className="mb-0">{money(totalSpent)}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Orders on the way */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold">📦 Orders on the way</div>
            <div className="card-body">
              {inTransit.length === 0 ? (
                <p className="text-muted mb-0">No orders on the way right now.</p>
              ) : (
                inTransit.map((o) => (
                  <div key={o.id} className="border rounded p-3 mb-2">
                    <div className="d-flex justify-content-between">
                      <b>#{o.id}</b>
                      <span className={'badge bg-' + statusColor[o.status]}>{o.status}</span>
                    </div>
                    <div className="progress my-2" style={{ height: 8 }}>
                      <div className="progress-bar bg-success" style={{ width: progress(o.status) + '%' }}></div>
                    </div>
                    <div className="small text-muted">
                      {o.items.map((i) => i.name).join(', ')}
                      {o.tracking && (
                        <>
                          <br />
                          🚚 {o.tracking.courier} – {o.tracking.trackingId}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold">❤️ My Wishlist</div>
            <div className="card-body">
              {wishlist.length === 0 ? (
                <p className="text-muted mb-0">Tap the heart on any product to save it here.</p>
              ) : (
                wishlist.map((p) => (
                  <div key={p.id} className="d-flex align-items-center gap-3 border rounded p-2 mb-2">
                    <ProductImage product={p} className="cart-product-photo" />
                    <div className="flex-grow-1">
                      <a href="#" className="text-dark fw-semibold text-decoration-none" onClick={() => onViewProduct(p)}>
                        {p.name}
                      </a>
                      <div className="small text-muted">{money(p.price)}</div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-glow"
                      disabled={p.stock === 0}
                      onClick={() => onAdd(p, 1)}
                    >
                      {p.stock === 0 ? 'Sold out' : 'Add to Cart'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between">
              <span className="fw-semibold">Recent Orders</span>
              <a href="#" className="text-glow" onClick={onViewAll}>
                View all
              </a>
            </div>
            <ul className="list-group list-group-flush">
              {recent.length === 0 && <li className="list-group-item text-muted">You have not placed any order yet.</li>}
              {recent.map((o) => (
                <li key={o.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <b>#{o.id}</b> • {money(o.total)}
                    <div className="small text-muted">
                      {o.items.length} item(s) • Ordered on {o.date}
                    </div>
                  </div>
                  <span className={'badge bg-' + statusColor[o.status]}>{o.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
