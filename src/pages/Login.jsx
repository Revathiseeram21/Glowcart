import { useState } from 'react'

function Login({ users, onLogin, onRegister, message }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password)
    if (!found) {
      setError('Invalid email or password')
      return
    }
    onLogin(found)
  }

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <h3 className="text-center mb-1">Welcome back 💧</h3>
                <p className="text-center text-muted mb-4">Login to your Glowcart account</p>

                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-glow w-100">
                    Login
                  </button>
                </form>

                <p className="text-center mt-3 mb-0">
                  New customer?{' '}
                  <a href="#" className="text-glow" onClick={onRegister}>
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
