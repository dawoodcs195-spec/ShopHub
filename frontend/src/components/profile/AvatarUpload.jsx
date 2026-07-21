const AvatarUpload = ({
    avatar,
    uploading,
    onImageChange,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
                Profile Picture
            </h2>

            <div className="flex flex-col items-center">

                <img
                    src={
                        avatar?.url ||
                        "https://placehold.co/200x200?text=Avatar"
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />

                <label className="mt-6">

                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                    />

                    <span className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                        {uploading
                            ? "Uploading..."
                            : "Choose Image"}
                    </span>

                </label>

                <p className="text-gray-500 text-sm mt-4 text-center">
                    JPG, PNG or WEBP
                    <br />
                    Maximum file size: 5 MB
                </p>

            </div>

        </div>
    );
};

export default AvatarUpload;