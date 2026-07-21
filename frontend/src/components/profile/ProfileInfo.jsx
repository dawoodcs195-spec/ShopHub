const ProfileInfo = ({
    profile,
    onChange,
    onSubmit,
    saving,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
                Profile Information
            </h2>

            <form
                onSubmit={onSubmit}
                className="space-y-5"
            >

                <div>

                    <label className="block mb-2 font-semibold">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={onChange}
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Email
                    </label>

                    <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />

                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {saving
                        ? "Saving..."
                        : "Save Profile"}
                </button>

            </form>

        </div>
    );
};

export default ProfileInfo;