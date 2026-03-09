import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import AuthContext from '../../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [frequency, setFrequency] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`product/${id}/`);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();

        // Default start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setStartDate(tomorrow.toISOString().split('T')[0]);
    }, [id]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const subscriptionData = {
                product: product.id,
                quantity: quantity,
                delivery_frequency: frequency,
                start_date: startDate,
                end_date: endDate || null
            };

            // Navigate to Cart/Checkout to confirm
            navigate('/cart', { state: { subscriptionData, product } });
        } catch (error) {
            console.error("Failed to prepare subscription", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
    if (!product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container max-w-6xl px-4 py-16 mx-auto">
                <div className="flex flex-col gap-12 lg:flex-row bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                    {/* Product Image */}
                    <div className="lg:w-1/2">
                        {product.image ? (
                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`} alt={product.name} className="object-cover w-full rounded-2xl shadow-sm h-96 lg:h-[500px]" />
                        ) : (
                            <div className="flex items-center justify-center w-full bg-slate-100 rounded-2xl h-96 lg:h-[500px] text-slate-400 font-medium">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Product Info & Form */}
                    <div className="flex flex-col justify-center lg:w-1/2 lg:pl-8">
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-700 bg-blue-100 rounded-full uppercase w-fit">
                            {product.category_details?.name}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h1>
                        <p className="mt-6 text-slate-600 leading-relaxed text-lg">{product.description}</p>
                        <div className="mt-8">
                            <span className="text-4xl font-black text-blue-700">₹{product.price}</span>
                            <span className="text-lg font-medium text-slate-500 ml-2">/ unit</span>
                        </div>

                        <div className="p-8 mt-10 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                            <h3 className="mb-6 text-xl font-bold text-slate-800 flex items-center gap-2">
                                📅 Subscription Settings
                            </h3>
                            <form onSubmit={handleSubscribe} className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-bold text-slate-700">Quantity (Units)</label>
                                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800" required />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-bold text-slate-700">Delivery Frequency</label>
                                        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800" required>
                                            <option value="daily">Daily</option>
                                            <option value="alternate_days">Alternate Days</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-bold text-slate-700">Start Date</label>
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800" required />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-bold text-slate-700">End Date <span className="text-slate-400 font-normal">(Optional)</span></label>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 mt-2 text-lg font-bold text-white transition-all bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-[0.98]">
                                    {user ? 'Proceed to Cart ➔' : 'Login to Subscribe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
