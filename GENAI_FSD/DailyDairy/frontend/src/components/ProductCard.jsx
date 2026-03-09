import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {product.image ? (
                <div className="overflow-hidden rounded-xl mb-4 h-48">
                    <img
                        src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-48 mb-4 bg-slate-100 rounded-xl text-slate-400 font-medium">
                    No Image Available
                </div>
            )}
            <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
            <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
            <div className="flex items-center justify-between mt-auto pt-6">
                <span className="text-2xl font-black text-blue-700">₹{product.price}</span>
                <Link
                    to={`/product/${product.id}`}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
