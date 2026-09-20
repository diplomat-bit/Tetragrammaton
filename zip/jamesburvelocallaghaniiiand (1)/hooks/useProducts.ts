import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Treasury Prime Direct Connect', category: 'Banking API', price: 2500 },
    { id: 'p2', name: 'Real-Time FX Liquidity Engine', category: 'FX Trading', price: 5000 },
    { id: 'p3', name: 'Autonomous AML / Sanctions Radar', category: 'Compliance', price: 3800 }
  ]);
  const [loading, setLoading] = useState(false);

  return { products, loading };
}

export default useProducts;
