import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import sampleProducts from './data/products'
import { today } from './data/constants'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyOrders from './pages/MyOrders'
import Admin from './pages/Admin'

// one ready-made admin account so the admin panel can be opened without registering
const demoAdmin = {
  id: 1,
  name: 'Glowcart Admin',
  email: 'admin@glowcart.com',
  phone: '9876543210',
  password: 'admin123',
  role: 'admin',
}

function App() {
  const [page, setPage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)

  // data saved in localStorage
  const [products, setProducts] = useLocalStorage('glowcart_products', sampleProducts)
  const [users, setUsers] = useLocalStorage('glowcart_users', [demoAdmin])
  const [orders, setOrders] = useLocalStorage('glowcart_orders', [])
  const [cart, setCart] = useLocalStorage('glowcart_cart', []) // [{ productId, qty }]
  const [wishlist, setWishlist] = useLocalStorage('glowcart_wishlist', []) // [{ userEmail, productId }]
  const [user, setUser] = useLocalStorage('glowcart_user', null) // logged-in user

  const selectedProduct = products.find((p) => p.id === selectedId)

  // ---------- auth ----------
  const startSession = (u) => {
    setUser(u)
    setPage(u.role === 'admin' ? 'admin' : 'dashboard')
  }

  const register = (newUser) => {
    const created = { ...newUser, id: Date.now() }
    setUsers([...users, created])
    startSession(created)
  }

  const logout = () => {
    setUser(null)
    setPage('home')
  }

  // ---------- products ----------
  const viewProduct = (product) => {
    setSelectedId(product.id)
    setPage('details')
    window.scrollTo(0, 0)
  }

  const addProduct = (product) => setProducts([{ ...product, id: Date.now() }, ...products])

  const deleteProduct = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter((p) => p.id !== id))
      setCart(cart.filter((item) => item.productId !== id))
    }
  }

  const updateProduct = (id, changes) =>
    setProducts(products.map((p) => (p.id === id ? { ...p, ...changes } : p)))

  // ---------- cart ----------
  // join cart items with product details
  const cartLines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { ...product, qty: item.qty } : null
    })
    .filter(Boolean)

  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0)

  const addToCart = (product, qty = 1) => {
    if (user && user.role === 'admin') {
      alert('Admin accounts cannot shop. Please use a customer account.')
      return
    }
    const existing = cart.find((item) => item.productId === product.id)
    const newQty = (existing ? existing.qty : 0) + qty
    if (newQty > product.stock) {
      alert('Only ' + product.stock + ' unit(s) available in stock')
      return
    }
    if (existing) {
      setCart(cart.map((item) => (item.productId === product.id ? { ...item, qty: newQty } : item)))
    } else {
      setCart([...cart, { productId: product.id, qty }])
    }
  }

  const removeFromCart = (productId) => setCart(cart.filter((item) => item.productId !== productId))

  const changeQty = (productId, qty) => {
    const product = products.find((p) => p.id === productId)
    if (qty < 1) return removeFromCart(productId)
    if (qty > product.stock) {
      alert('Only ' + product.stock + ' unit(s) available in stock')
      return
    }
    setCart(cart.map((item) => (item.productId === productId ? { ...item, qty } : item)))
  }

  // ---------- wishlist ----------
  const wishlistIds = user ? wishlist.filter((w) => w.userEmail === user.email).map((w) => w.productId) : []
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id))

  const toggleWishlist = (product) => {
    if (!user) {
      alert('Please login to save products to your wishlist')
      setPage('login')
      return
    }
    if (user.role === 'admin') return
    if (wishlistIds.includes(product.id)) {
      setWishlist(wishlist.filter((w) => !(w.userEmail === user.email && w.productId === product.id)))
    } else {
      setWishlist([...wishlist, { userEmail: user.email, productId: product.id }])
    }
  }

  // ---------- orders ----------
  const myOrders = user ? orders.filter((o) => o.userEmail === user.email) : []

  const placeOrder = (order) => {
    const created = {
      ...order,
      id: 'GC' + Date.now().toString().slice(-6),
      userEmail: user.email,
      status: 'Placed',
      date: today(),
      tracking: null,
    }
    setOrders([created, ...orders])
    // reduce stock of ordered products
    setProducts(
      products.map((p) => {
        const item = order.items.find((i) => i.productId === p.id)
        return item ? { ...p, stock: p.stock - item.qty } : p
      }),
    )
    setCart([])
    setPage('orders')
    window.scrollTo(0, 0)
  }

  const updateOrder = (id, changes) =>
    setOrders(orders.map((o) => (o.id === id ? { ...o, ...changes } : o)))

  // used by both the customer (cancel) and the admin (status dropdown)
  const changeOrderStatus = (id, status) => {
    const order = orders.find((o) => o.id === id)
    if (order.status === 'Cancelled') return
    if (status === 'Cancelled') {
      // put the items back in stock
      setProducts(
        products.map((p) => {
          const item = order.items.find((i) => i.productId === p.id)
          return item ? { ...p, stock: p.stock + item.qty } : p
        }),
      )
    }
    updateOrder(id, { status })
  }

  const cancelOrder = (id) => {
    if (window.confirm('Cancel this order?')) changeOrderStatus(id, 'Cancelled')
  }

  const saveTracking = (id, trackingId) => {
    if (trackingId.trim().length < 5) {
      alert('Enter a valid tracking ID (min 5 characters)')
      return
    }
    updateOrder(id, { tracking: { courier: 'Delhivery', trackingId: trackingId.trim().toUpperCase() } })
  }

  // ---------- pick the page ----------
  const renderPage = () => {
    // pages that need login
    if (['dashboard', 'orders'].includes(page) && (!user || user.role !== 'customer')) {
      return (
        <Login
          users={users}
          onLogin={startSession}
          onRegister={() => setPage('register')}
          message="Please login as a customer to continue."
        />
      )
    }
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      return (
        <Login
          users={users}
          onLogin={startSession}
          onRegister={() => setPage('register')}
          message="Please login as admin to continue."
        />
      )
    }

    switch (page) {
      case 'login':
        return <Login users={users} onLogin={startSession} onRegister={() => setPage('register')} />
      case 'register':
        return <Register users={users} onRegister={register} onLogin={() => setPage('login')} />
      case 'details':
        if (!selectedProduct) return <Home products={products} wishlistIds={wishlistIds} onView={viewProduct} onAdd={addToCart} onToggleWish={toggleWishlist} />
        return (
          <ProductDetails
            product={selectedProduct}
            wished={wishlistIds.includes(selectedProduct.id)}
            onBack={() => setPage('home')}
            onAdd={addToCart}
            onToggleWish={toggleWishlist}
            onGoCart={() => setPage('cart')}
          />
        )
      case 'cart':
        return (
          <Cart
            lines={cartLines}
            user={user}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onPlaceOrder={placeOrder}
            onBrowse={() => setPage('home')}
            onGoLogin={() => setPage('login')}
            onGoRegister={() => setPage('register')}
          />
        )
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            orders={myOrders}
            wishlist={wishlistProducts}
            onViewProduct={viewProduct}
            onAdd={addToCart}
            onViewAll={() => setPage('orders')}
          />
        )
      case 'orders':
        return <MyOrders orders={myOrders} onCancel={cancelOrder} onBrowse={() => setPage('home')} />
      case 'admin':
        return (
          <Admin
            products={products}
            orders={orders}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onUpdateProduct={updateProduct}
            onStatusChange={changeOrderStatus}
            onSaveTracking={saveTracking}
          />
        )
      default:
        return (
          <Home
            products={products}
            wishlistIds={wishlistIds}
            onView={viewProduct}
            onAdd={addToCart}
            onToggleWish={toggleWishlist}
          />
        )
    }
  }

  return (
    <>
      <Navbar page={page} setPage={setPage} user={user} cartCount={cartCount} onLogout={logout} />
      {renderPage()}
      <footer className="text-center text-muted py-4 small">© 2026 Glowcart – Beauty &amp; Skincare Store</footer>
    </>
  )
}

export default App
