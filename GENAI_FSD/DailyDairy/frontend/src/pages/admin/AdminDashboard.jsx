import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axiosInstance from '../../api/axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Quick Add States
    const [catName, setCatName] = useState('');
    const [prodData, setProdData] = useState({ name: '', price: '', category: '', stock_quantity: '', image: null });

    // Data States
    const [customers, setCustomers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    // UI Feedback
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user && (user.is_staff || user.is_superuser)) {
            const fetchData = async () => {
                try {
                    const custRes = await axiosInstance.get('admin/customers/');
                    setCustomers(custRes.data);

                    const subRes = await axiosInstance.get('subscription/admin/');
                    setSubscriptions(subRes.data);
                } catch (err) {
                    console.error("Failed to fetch admin data", err);
                }
            };
            fetchData();
        }
    }, [user]);

    if (!user || (!user.is_staff && !user.is_superuser)) {
        return <div className="p-12 text-center text-red-600">Access Denied: Admin Privileges Required.</div>;
    }

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('category/admin/', { name: catName });
            setMsg('Category added successfully!');
            setCatName('');
        } catch (err) {
            setMsg('Failed to add category.');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', prodData.name);
            formData.append('price', prodData.price);
            formData.append('category', prodData.category);
            formData.append('stock_quantity', prodData.stock_quantity);
            if (prodData.image) {
                formData.append('image', prodData.image);
            }

            await axiosInstance.post('product/admin/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMsg('Product added successfully!');
            setProdData({ name: '', price: '', category: '', stock_quantity: '', image: null });
        } catch (err) {
            setMsg('Failed to add product.');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container max-w-7xl px-4 py-12 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-slate-600 font-medium text-lg">Manage customers and their subscriptions.</p>
                    </div>
                    {/* Add quick stats or actions here if needed later */}
                </div>

                {msg && <div className="p-4 mb-6 bg-blue-100 rounded text-blue-800">{msg}</div>}

                <div className="grid gap-8 md:grid-cols-2 mb-12">
                    {/* Add Category */}
                    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold border-b pb-2">Add New Category</h2>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Category Name</label>
                                <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required />
                            </div>
                            <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">Add Category</button>
                        </form>
                    </div>

                    {/* Add Product */}
                    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold border-b pb-2">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Product Name</label>
                                <input type="text" value={prodData.name} onChange={(e) => setProdData({ ...prodData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block mb-1 text-sm font-medium text-slate-700">Price (₹)</label>
                                    <input type="number" step="0.01" value={prodData.price} onChange={(e) => setProdData({ ...prodData, price: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block mb-1 text-sm font-medium text-slate-700">Stock</label>
                                    <input type="number" value={prodData.stock_quantity} onChange={(e) => setProdData({ ...prodData, stock_quantity: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Category ID</label>
                                <input type="number" value={prodData.category} onChange={(e) => setProdData({ ...prodData, category: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-slate-700">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProdData({ ...prodData, image: e.target.files[0] })}
                                    className="w-full px-4 py-2 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">Add Product</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Directory</h2>
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold uppercase tracking-wider rounded-full shadow-sm">{customers.length} Total Users</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Username</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Email</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Phone</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Address</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Active Subscriptions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-slate-500 bg-slate-50 font-medium">No customers found.</td>
                                </tr>
                            ) : (
                                customers.map(customer => {
                                    const custSubs = subscriptions.filter(s => s.customer === customer.id && s.status === 'active');
                                    return (
                                        <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                                            <td className="px-8 py-6 text-sm font-mono text-slate-500 whitespace-nowrap">{customer.id}</td>
                                            <td className="px-8 py-6 text-base font-bold text-slate-800 whitespace-nowrap">{customer.username}</td>
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600 whitespace-nowrap">{customer.email}</td>
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600 whitespace-nowrap">{customer.phone || '-'}</td>
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600 max-w-xs truncate" title={customer.address}>{customer.address || '-'}</td>
                                            <td className="px-8 py-6">
                                                {custSubs.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {custSubs.map(sub => (
                                                            <li key={sub.id} className="text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-slate-800 mb-1">{sub.product_details?.name || 'Unknown Product'}</span>
                                                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                                        {sub.quantity} {sub.quantity === 1 ? 'unit' : 'units'} • {sub.delivery_frequency.replace('_', ' ')}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col items-start sm:items-end text-xs font-medium text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-100">
                                                                    <span className="flex gap-2">Started: <strong className="text-slate-700">{sub.start_date}</strong></span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-lg">None Active</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
