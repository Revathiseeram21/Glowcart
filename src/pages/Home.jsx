import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { categories, skinTypes } from '../data/constants'

function Home({ products, wishlistIds, onView, onAdd, onToggleWish }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [skinType, setSkinType] = useState('')
  const [sort, setSort] = useState('')

  let filtered = products.filter((p) => {
    const text = (p.name + ' ' + p.brand + ' ' + p.ingredients.join(' ')).toLowerCase()
    return (
      text.includes(search.toLowerCase()) &&
      (category === 'All' || p.category === category) &&
      (skinType === '' || p.skinType === skinType)
    )
  })

  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="fw-bold">Skincare that makes you glow ✨</h1>
          <p className="lead mb-4">
            Dermatologist-tested products for every skin type. Use code <b>GLOW10</b> for 10% off.
          </p>

          <div className="row g-2 justify-content-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search product, brand or ingredient"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
              >
                <option value="">All Skin Types</option>
                {skinTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* category buttons */}
        <div className="mb-3">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              className={'btn btn-sm me-2 mb-2 ' + (category === c ? 'btn-glow' : 'btn-outline-glow')}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{filtered.length} product(s) found</h5>
          <select
            className="form-select form-select-sm w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="alert alert-warning">No products match your search. Try different keywords.</div>
        ) : (
          <div className="row g-4">
            {filtered.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.id}>
                <ProductCard
                  product={p}
                  wished={wishlistIds.includes(p.id)}
                  onView={onView}
                  onAdd={onAdd}
                  onToggleWish={onToggleWish}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Home
