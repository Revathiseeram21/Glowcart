import { useState } from 'react'

function CheckoutForm({ user, onSubmit }) {
  // name and phone come from the logged-in customer
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    address: '',
    city: '',
    pincode: '',
    payment: 'Cash on Delivery',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Enter your full name (min 3 letters)'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.address.trim().length < 10) e.address = 'Enter your full address (house no, street, area)'
    if (form.city.trim().length < 3) e.city = 'Enter your city'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) onSubmit(form)
  }

  const cls = (field) => 'form-control' + (errors[field] ? ' is-invalid' : '')

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h6 className="mb-3">Delivery Details</h6>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input name="name" className={cls('name')} value={form.name} onChange={handleChange} />
          <div className="invalid-feedback">{errors.name}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Mobile Number</label>
          <input
            name="phone"
            maxLength="10"
            className={cls('phone')}
            value={form.phone}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.phone}</div>
        </div>

        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            rows="2"
            className={cls('address')}
            placeholder="House no, street, area"
            value={form.address}
            onChange={handleChange}
          ></textarea>
          <div className="invalid-feedback">{errors.address}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">City</label>
          <input name="city" className={cls('city')} value={form.city} onChange={handleChange} />
          <div className="invalid-feedback">{errors.city}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Pincode</label>
          <input
            name="pincode"
            maxLength="6"
            className={cls('pincode')}
            value={form.pincode}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.pincode}</div>
        </div>

        <div className="col-12">
          <label className="form-label d-block">Payment Method</label>
          {['Cash on Delivery', 'UPI', 'Card'].map((method) => (
            <div className="form-check form-check-inline" key={method}>
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                id={'pay' + method}
                value={method}
                checked={form.payment === method}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={'pay' + method}>
                {method}
              </label>
            </div>
          ))}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-glow px-4">
            Place Order
          </button>
        </div>
      </div>
    </form>
  )
}

export default CheckoutForm
