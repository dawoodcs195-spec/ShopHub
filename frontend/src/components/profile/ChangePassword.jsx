const ChangePassword = ({ passwordData, onChange, onSubmit, loading }) => {
    return (
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-8 text-text-primary dark:text-dark-card-foreground">
            <h2 className="text-2xl font-serif font-bold mb-6">
                Change Password
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        Current Password
                    </label>

                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={onChange}
                        className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                        placeholder="Enter current password"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        New Password
                    </label>

                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={onChange}
                        className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                        placeholder="Enter new password"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={onChange}
                        className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                        placeholder="Confirm new password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;