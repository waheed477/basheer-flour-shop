export interface Product {
    id: number;
    name: string;
    nameUrdu: string;
    price: number;
    category: "wheat" | "flour";
    image: string;
    stock: number;
    description?: string;
    unit: "Kg" | "Maan";
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: "Premium Wheat",
      nameUrdu: "پریمیم گندم",
      price: 3200,
      category: "wheat",
      image: "/shop-images/wheat.jpg",
      stock: 50,
      description: "Premium quality wheat, perfect for homemade atta. Fresh from local farms.",
      unit: "Maan"
    },
    {
      id: 2,
      name: "Sharbati Wheat",
      nameUrdu: "شربتی گندم",
      price: 3500,
      category: "wheat",
      image: "/shop-images/wheat1.jpg",
      stock: 30,
      description: "Special Sharbati wheat, soft and rich texture. Imported quality.",
      unit: "Maan"
    },
    {
      id: 3,
      name: "Fresh Chakki Atta",
      nameUrdu: "تازہ چکی آٹا",
      price: 900,
      category: "flour",
      image: "/shop-images/atta.jpg",
      stock: 200,
      description: "Freshly ground atta, stone chakki processed. No preservatives added.",
      unit: "Kg"
    }
  ];
  
  // Helper functions
  export const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };
  
  export const getProductsByCategory = (category: "wheat" | "flour" | "all"): Product[] => {
    if (category === "all") return products;
    return products.filter(product => product.category === category);
  };
  
  export const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.nameUrdu.includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  };
  
  // Default export
  export default products;