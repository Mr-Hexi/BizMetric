import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../api/axios';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const subRes = await axiosInstance.get('subscription/');
                setSubscriptions(subRes.data);

                const payRes = await axiosInstance.get('payment/history/');
                setPayments(payRes.data);
            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserData();
    }, [user]);

    const handleCancel = async (id) => {
        try {
            await axiosInstance.delete(`subscription/${id}/`);
            setSubscriptions(subscriptions.map(sub =>
                sub.id === id ? { ...sub, status: 'cancelled' } : sub
            ));
        } catch (error) {
            console.error("Error cancelling subscription", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container max-w-5xl px-4 py-16 mx-auto">
                <h1 className="mb-10 text-4xl font-extrabold text-slate-900 tracking-tight">Welcome, {user?.username}</h1>

                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Profile Details */}
                    <div className="col-span-1 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm h-fit">
                        <h2 className="mb-6 text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Your Details</h2>
                        <div className="space-y-6">
                            <div><strong className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</strong> <span className="text-slate-700 font-medium">{user?.email}</span></div>
                            <div><strong className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</strong> <span className="text-slate-700 font-medium">{user?.phone || 'Not provided'}</span></div>
                            <div><strong className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</strong> <span className="text-slate-700 font-medium">{user?.address || 'Not provided'}</span></div>
                        </div>
                    </div>

                    {/* Subscriptions */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold text-slate-800 tracking-tight">Your Subscriptions</h2>
                        {subscriptions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 bg-white border border-slate-100 rounded-2xl shadow-sm">No active subscriptions found.</div>
                        ) : (
                            <div className="space-y-6">
                                {subscriptions.map(sub => (
                                    <div key={sub.id} className="p-8 transition-all bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-800">{sub.product_details?.name}</h3>
                                                <p className="inline-block mt-2 px-3 py-1 bg-slate-100 text-xs font-bold text-blue-700 uppercase tracking-widest rounded-lg">{sub.delivery_frequency.replace('_', ' ')}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full w-fit ${sub.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                sub.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 mt-8 p-6 bg-slate-50 rounded-2xl sm:grid-cols-3">
                                            <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quantity</span> <span className="font-medium text-slate-700">{sub.quantity} units</span></div>
                                            <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</span> <span className="font-medium text-slate-700">{sub.start_date}</span></div>
                                            <div><span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</span> <span className="font-medium text-slate-700">{sub.end_date || 'Ongoing'}</span></div>
                                        </div>
                                        {sub.status === 'active' && (
                                            <div className="mt-8 text-right border-t border-slate-100 pt-6">
                                                <button
                                                    onClick={() => handleCancel(sub.id)}
                                                    className="px-6 py-2.5 text-sm font-bold text-red-600 transition-colors bg-white border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200"
                                                >
                                                    Cancel Delivery
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 className="mt-14 mb-6 text-2xl font-bold text-slate-800 tracking-tight">Recent Payments</h2>
                        {payments.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 bg-white border border-slate-100 rounded-2xl shadow-sm">No payment history found.</div>
                        ) : (
                            <div className="overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Transaction ID</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 text-sm font-medium text-slate-700">{new Date(payment.payment_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-5 text-sm font-mono text-slate-500">{payment.transaction_id || '-'}</td>
                                                <td className="px-6 py-5 text-sm font-black text-slate-800">₹{payment.amount}</td>
                                                <td className="px-6 py-5 text-sm">
                                                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${payment.payment_status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                        }`}>
                                                        {payment.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
