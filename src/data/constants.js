// order moves through these steps (used for the progress bar)
export const orderFlow = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
export const allStatuses = [...orderFlow, 'Cancelled']

export const statusColor = {
  Placed: 'primary',
  Packed: 'info',
  Shipped: 'warning',
  'Out for Delivery': 'purple',
  Delivered: 'success',
  Cancelled: 'danger',
}

export const categories = ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Face Mask', 'Lip Care']
export const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive']

// coupon code -> discount percentage
export const coupons = { GLOW10: 10, WELCOME15: 15 }

export const today = () => new Date().toISOString().slice(0, 10)

export const money = (n) => '₹' + Number(n).toLocaleString('en-IN')

// subtotal, discount, delivery charge and final total for a list of items
export const calcTotals = (items, couponCode) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const percent = coupons[couponCode] || 0
  const discount = Math.round((subtotal * percent) / 100)
  const delivery = subtotal === 0 || subtotal - discount >= 499 ? 0 : 49
  return { subtotal, discount, delivery, total: subtotal - discount + delivery }
}
