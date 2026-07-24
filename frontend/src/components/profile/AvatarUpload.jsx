const AvatarUpload = ({ avatar, uploading, onImageChange }) => {
    return (
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-soft p-8 text-text-primary dark:text-dark-card-foreground">
            <h2 className="text-2xl font-serif font-bold mb-6">
                Profile Picture
            </h2>

            <div className="flex flex-col items-center">
                <img
                    src={avatar?.url || "https://placehold.co/200x200?text=Avatar"}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
                />

                <label className="mt-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                    />

                    <span className="inline-flex cursor-pointer bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-hover transition-colors">
                        {uploading ? "Uploading..." : "Choose Image"}
                    </span>
                </label>

                <p className="text-text-secondary dark:text-dark-muted-foreground text-sm mt-4 text-center leading-6">
                    JPG, PNG or WEBP
                    <br />
                    Maximum file size: 5 MB
                </p>
            </div>
        </div>
    );
};

export default AvatarUpload;