const CategoryCard = ({ category, onClick }) => {
    return (
        <div
            onClick={() => onClick(category.id)}
            className="p-5 text-center transition-all bg-white border border-slate-200 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
        >
            <h3 className="text-xl font-bold text-slate-800">{category.name}</h3>
            {category.description && (
                <p className="mt-1 text-sm text-slate-500">{category.description}</p>
            )}
        </div>
    );
};

export default CategoryCard;
