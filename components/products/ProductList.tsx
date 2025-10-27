import { Product, ProductListProps } from '@/types';

export default function ProductList({ products }: ProductListProps) {
    if (!products || products.length === 0) {
      return <p>No products found.</p>;
    }
  
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <img 
              src={product.image} 
              alt={product.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <p>{product.description.substring(0, 100)}...</p>
            <div>
              <span>Rating: {product.rating.rate} ({product.rating.count} reviews)</span>
            </div>
            <div>
              <span>Category: {product.category}</span>
            </div>
            <div>
              <span>In Stock: {product.details.inStock ? 'Yes' : 'No'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }