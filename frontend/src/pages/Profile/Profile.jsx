import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getUserProfile,
    updateUserProfile,
    changePassword,
} from "../../services/authService";

import { uploadAvatar } from "../../services/uploadService";

import { useAuth } from "../../context/AuthContext";

import AvatarUpload from "../../components/profile/AvatarUpload";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ChangePassword from "../../components/profile/ChangePassword";

const Profile = () => {
    const { token, updateUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: null,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await getUserProfile(token);

            setProfile({
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            });

            updateUser(user);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfile((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ====================== AVATAR UPLOAD ======================
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);

            const uploadedAvatar = await uploadAvatar(file, token);

            const response = await updateUserProfile(
                { avatar: uploadedAvatar },
                token
            );

            const updatedUser = {
                ...profile,
                avatar: response.user.avatar,
            };

            setProfile(updatedUser);
            updateUser(response.user);

            toast.success("Profile picture updated successfully.");
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to update profile picture."
            );
        } finally {
            setUploadingAvatar(false);
            e.target.value = ""; // reset input
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            setSavingProfile(true);

            const response = await updateUserProfile(
                {
                    name: profile.name,
                },
                token
            );

            updateUser(response.user);

            setProfile((prev) => ({
                ...prev,
                name: response.user.name,
                avatar: response.user.avatar,
            }));

            toast.success(response.message);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to update profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setChangingPassword(true);

            const response = await changePassword(
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                token
            );

            toast.success(response.message);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to change password."
            );
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-2xl">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>

            <div className="grid gap-8">
                {/* Avatar Section */}
                <AvatarUpload
                    avatar={profile.avatar}
                    uploading={uploadingAvatar}
                    onImageChange={handleAvatarChange}
                />

                {/* Profile Information */}
                <ProfileInfo
                    profile={profile}
                    onChange={handleProfileChange}
                    onSubmit={handleProfileSubmit}
                    saving={savingProfile}
                />

                {/* Change Password */}
                <ChangePassword
                    passwordData={passwordData}
                    onChange={handlePasswordChange}
                    onSubmit={handlePasswordSubmit}
                    loading={changingPassword}
                />
            </div>
        </div>
    );
};

export default Profile;