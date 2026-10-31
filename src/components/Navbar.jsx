import { useState } from 'react'

function Navbar({ page, setPage, user, cartCount, onLogout }) {
  const [open, setOpen] = useState(false)

  const go = (name) => {
    setPage(name)
    setOpen(false)
  }

  const linkClass = (name) => 'nav-link' + (page === name ? ' active fw-semibold' : '')

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-glow sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold text-glow" href="#" onClick={() => go('home')}>
          💧 Glowcart
        </a>
        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={'collapse navbar-collapse' + (open ? ' show' : '')}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <a className={linkClass('home')} href="#" onClick={() => go('home')}>
                Shop
              </a>
            </li>

            {user && user.role === 'customer' && (
              <>
                <li className="nav-item">
                  <a className={linkClass('dashboard')} href="#" onClick={() => go('dashboard')}>
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className={linkClass('orders')} href="#" onClick={() => go('orders')}>
                    My Orders
                  </a>
                </li>
              </>
            )}

            {user && user.role === 'admin' && (
              <li className="nav-item">
                <a className={linkClass('admin')} href="#" onClick={() => go('admin')}>
                  Admin Panel
                </a>
              </li>
            )}

            {(!user || user.role === 'customer') && (
              <li className="nav-item">
                <a className={linkClass('cart')} href="#" onClick={() => go('cart')}>
                  🛒 Cart{' '}
                  {cartCount > 0 && <span className="badge rounded-pill bg-danger">{cartCount}</span>}
                </a>
              </li>
            )}

            {!user ? (
              <>
                <li className="nav-item">
                  <a className={linkClass('login')} href="#" onClick={() => go('login')}>
                    Login
                  </a>
                </li>
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-glow btn-sm" onClick={() => go('register')}>
                    Register
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-muted">Hi, {user.name.split(' ')[0]}</span>
                </li>
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-outline-glow btn-sm" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
