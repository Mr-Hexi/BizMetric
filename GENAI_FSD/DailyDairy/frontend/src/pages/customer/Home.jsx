import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';

const Home = () => {
    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await axiosInstance.get('category/');
                setCategories(catRes.data);
                const prodRes = await axiosInstance.get('product/');
                setProducts(prodRes.data);
            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        setLoading(true);
        try {
            const url = categoryId ? `product/?category=${categoryId}` : 'product/';
            const res = await axiosInstance.get(url);
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to load products by category", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !categories) return <div className="p-8 text-center text-gray-500">Loading shop...</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 px-4 mb-12 shadow-inner">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-sm">
                        Fresh Dairy, <span className="text-yellow-300">Delivered.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-2xl leading-relaxed">
                        Farm-fresh milk, artisanal curd, and soft paneer brought straight to your doorstep every morning.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Categories Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Shop by Category</h2>
                        {selectedCategory && (
                            <button
                                onClick={() => handleCategorySelect(null)}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-full transition-colors"
                            >
                                View All Products
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                        {categories?.map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={handleCategorySelect}
                            />
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="mb-8 text-3xl font-bold text-slate-800 tracking-tight">
                        {selectedCategory ? 'Filtered Products' : 'Trending Products'}
                    </h2>
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Loading fresh products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {!loading && products.length === 0 && (
                        <div className="py-20 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <span className="text-4xl block mb-4">🛒</span>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                            <p>We couldn't find any products in this category at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
