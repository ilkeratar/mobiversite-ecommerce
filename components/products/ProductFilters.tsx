'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { Category } from '@/types';

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
}

export default function ProductFilters({ categories, currentCategory, currentSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // name='category', value='elektronik'
    
    // Mevcut tüm URL parametrelerinin bir kopyasını al
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value); // ?category=elektronik
    } else {
      params.delete(name); // Değer boşsa parametreyi kaldır
    }

    // URL'i güncelle, bu sayfanın (Server Component) yeniden çalışmasını tetikler
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
      {/* Kategori Filtresi */}
      <select 
        name="category"
        onChange={handleFilterChange}
        value={currentCategory || ''} // Sayfa yenilendiğinde seçili değeri koru
      >
        <option value="">Tüm Kategoriler</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.slug}>{cat.name}</option>
        ))}
      </select>

      {/* Arama Filtresi */}
      <input 
        type="text"
        name="q" // json-server 'q' parametresini arama için kullanır
        placeholder="Ürün ara..."
        onChange={handleFilterChange} // Not: Gerçek dünyada bu 'debounce' edilmeli
        defaultValue={currentSearch || ''} // Sayfa yenilendiğinde değeri koru
      />
    </div>
  );
}