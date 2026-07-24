const ProfileInfo = ({ profile, onChange, onSubmit, saving }) => {
    return (
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-8 text-text-primary dark:text-dark-card-foreground">
            <h2 className="text-2xl font-serif font-bold mb-6">
                Profile Information
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={onChange}
                        className="w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 py-3 text-text-primary dark:text-dark-card-foreground placeholder:text-text-muted dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-text-secondary dark:text-dark-muted-foreground">
                        Email
                    </label>

                    <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-xl px-4 py-3 text-text-secondary dark:text-dark-muted-foreground"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfileInfo;