import { useState } from 'react'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
}

function Register({ users, onRegister, onLogin }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Enter your full name (min 3 letters)'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    else if (users.some((u) => u.email === form.email.trim().toLowerCase()))
      e.email = 'This email is already registered'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onRegister({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
        role: 'customer',
      })
    }
  }

  const cls = (field) => 'form-control' + (errors[field] ? ' is-invalid' : '')

  return (
    <div className="auth-wrapper py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <h3 className="text-center mb-1">Create account</h3>
                <p className="text-center text-muted mb-4">Join Glowcart and start your skincare routine</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input name="name" className={cls('name')} value={form.name} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input name="email" type="email" className={cls('email')} value={form.email} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input name="phone" maxLength="10" className={cls('phone')} value={form.phone} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.phone}</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <input name="password" type="password" className={cls('password')} value={form.password} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.password}</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input name="confirm" type="password" className={cls('confirm')} value={form.confirm} onChange={handleChange} />
                      <div className="invalid-feedback">{errors.confirm}</div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-glow w-100">
                    Register
                  </button>
                </form>

                <p className="text-center mt-3 mb-0">
                  Already have an account?{' '}
                  <a href="#" className="text-glow" onClick={onLogin}>
                    Login
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

export default Register
