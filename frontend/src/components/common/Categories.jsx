const categories = [
    "Electronics",
    "Mobiles",
    "Fashion",
    "Computers",
    "Accessories",
    "Home",
];

const Categories = () => {
    return (
        <section className="py-14">

            <h2 className="text-3xl font-bold text-center mb-10">
                Shop by Category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

                {categories.map((category) => (
                    <div
                        key={category}
                        className="bg-white shadow rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
                    >
                        <h3 className="font-semibold">
                            {category}
                        </h3>
                    </div>
                ))}

            </div>

        </section>
    );
};

export default Categories;