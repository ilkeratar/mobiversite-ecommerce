import { Product, ProductFilters } from '@/types';


  // Applies filters to a product and returns true if it matches all filter criteria

export function applyFilters(product: Product, filters: ProductFilters): boolean {
  // Category filter
  if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
    return false;
  }

  // Price range filters
  if (filters.minPrice !== undefined && product.price < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
    return false;
  }

  // Stock filter
  if (filters.inStock && !product.details.inStock) {
    return false;
  }

  // Rating filter
  if (filters.rating !== undefined && product.rating.rate < filters.rating) {
    return false;
  }

  // Brand filter
  if (filters.brand && product.details.brand !== filters.brand) {
    return false;
  }

  // Size filter
  if (filters.size) {
    const sizes = product.details.sizes || product.details.size;
    if (!sizes || !sizes.includes(filters.size)) {
      return false;
    }
  }

  // Color filter
  if (filters.color) {
    const colors = product.details.colors || product.details.color;
    if (!colors || !colors.includes(filters.color)) {
      return false;
    }
  }

  // Material filter
  if (filters.material) {
    const materials = product.details.material;
    if (!materials || !materials.includes(filters.material)) {
      return false;
    }
  }

  // Storage filter
  if (filters.storage) {
    const storages = product.details.storage;
    if (!storages || !storages.includes(filters.storage)) {
      return false;
    }
  }

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    if (
      !product.title.toLowerCase().includes(searchTerm) &&
      !product.description.toLowerCase().includes(searchTerm) &&
      !product.category.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }
  }

  return true;
}

