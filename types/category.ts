export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (category: string | undefined) => void;
}
