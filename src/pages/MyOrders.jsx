import { statusColor, money } from '../data/constants'
import ProductImage from '../components/ProductImage'

function MyOrders({ orders, onCancel, onBrowse }) {
  return (
    <div className="container py-4">
      <h4 className="mb-3">My Orders ({orders.length})</h4>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You have not placed any order yet.{' '}
          <a href="#" onClick={onBrowse}>
            Start shopping
          </a>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <b>Order #{o.id}</b>
                <span className="text-muted small ms-2">placed on {o.date}</span>
              </div>
              <span className={'badge bg-' + statusColor[o.status]}>{o.status}</span>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-7">
                  {o.items.map((i) => (
                    <div key={i.productId} className="d-flex justify-content-between border-bottom py-2">
                      <span className="d-flex align-items-center gap-2">
                        <ProductImage product={i} className="order-product-photo" />
                        {i.name} <span className="text-muted">× {i.qty}</span>
                      </span>
                      <span>{money(i.price * i.qty)}</span>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between fw-bold pt-2">
                    <span>Total ({o.payment})</span>
                    <span>{money(o.total)}</span>
                  </div>
                </div>

                <div className="col-md-5 small mt-3 mt-md-0">
                  <div className="fw-semibold">Delivering to</div>
                  <div className="text-muted">
                    {o.address.name}, {o.address.phone}
                    <br />
                    {o.address.address}, {o.address.city} - {o.address.pincode}
                  </div>
                  {o.tracking && (
                    <div className="mt-2">
                      🚚 {o.tracking.courier}
                      <br />
                      Tracking ID: <b>{o.tracking.trackingId}</b>
                    </div>
                  )}
                  {(o.status === 'Placed' || o.status === 'Packed') && (
                    <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => onCancel(o.id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders
