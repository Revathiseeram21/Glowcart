const fallbackImages = [
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700&auto=format&fit=crop',
]

function ProductImage({ product, className = '' }) {
  const image = product.image || fallbackImages[(Number(product.id || 1) - 1) % fallbackImages.length]

  return (
    <img
      className={className}
      src={image}
      alt={product.name || 'Skincare product'}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = fallbackImages[0]
      }}
    />
  )
}

export default ProductImage
