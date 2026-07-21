const ChangePassword = ({
    passwordData,
    onChange,
    onSubmit,
    loading,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
                Change Password
            </h2>

            <form
                onSubmit={onSubmit}
                className="space-y-5"
            >

                <div>

                    <label className="block mb-2 font-semibold">
                        Current Password
                    </label>

                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={onChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        New Password
                    </label>

                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={onChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={onChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg disabled:bg-gray-400 transition"
                >
                    {loading
                        ? "Updating..."
                        : "Change Password"}
                </button>

            </form>

        </div>
    );
};

export default ChangePassword;