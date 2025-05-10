import { useEffect, useState } from 'react';
import { ProductMainContent } from './ProductMainContent';
import { ProductSidebarContainer } from './ProductSidebar';
import { getProducts } from '@/Apis/userApi';

export const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedGenetics, setSelectedGenetics] = useState<string[]>([]);

  // Fetch products when genetics change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ 
          genetics: selectedGenetics,
          page: 1,
          pageSize: 25
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    
    fetchProducts();
  }, [selectedGenetics]); // Re-run when genetics change

  return (
    <div className="flex">
      <ProductSidebarContainer 
        selectedGenetics={selectedGenetics}
        onGeneticsChange={setSelectedGenetics}
      />
      <ProductMainContent product={products} />
    </div>
  );
};