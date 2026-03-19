import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar.jsx";
import ProfileCard from "../components/ProfileCard/ProfileCard.jsx";
import TechSelectModal from "../components/TechSelectModal/TechSelectModal.jsx";
import InputModal from "../components/InputModal/InputModal.jsx";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal.jsx";
import { TECHNOLOGIES } from "../data/technologies.js";
import "./ProfilePage.css";

const DEFAULT_PROFILE = {
  firstName: "first_name",
  lastName: "last_name",
  username: "github_username",
  profileImage: "",
  languages: [],
  tools: [],
  databases: [],
};

function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [activeModal, setActiveModal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Modal state
  const [showEditName, setShowEditName] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getSelectedBadges = (categoryKey, selectedIds) => {
    return TECHNOLOGIES[categoryKey].filter((technology) => {
      return selectedIds.includes(technology.id);
    });
  };

  const selectedLanguages = useMemo(() => {
    return getSelectedBadges("languages", profile.languages);
  }, [profile.languages]);

  const selectedTools = useMemo(() => {
    return getSelectedBadges("tools", profile.tools);
  }, [profile.tools]);

  const selectedDatabases = useMemo(() => {
    return getSelectedBadges("databases", profile.databases);
  }, [profile.databases]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/profile");

      if (response.status === 404) {
        setProfile(DEFAULT_PROFILE);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        profileImage: data.profileImage || "",
        languages: Array.isArray(data.languages) ? data.languages : [],
        tools: Array.isArray(data.tools) ? data.tools : [],
        databases: Array.isArray(data.databases) ? data.databases : [],
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const savedProfile = await response.json();

      setProfile({
        firstName: savedProfile.firstName || "",
        lastName: savedProfile.lastName || "",
        username: savedProfile.username || "",
        profileImage: savedProfile.profileImage || "",
        languages: Array.isArray(savedProfile.languages)
          ? savedProfile.languages
          : [],
        tools: Array.isArray(savedProfile.tools) ? savedProfile.tools : [],
        databases: Array.isArray(savedProfile.databases)
          ? savedProfile.databases
          : [],
      });

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSelection = (category, id) => {
    setProfile((previousProfile) => {
      const currentCategoryItems = previousProfile[category];
      let updatedCategoryItems;

      if (currentCategoryItems.includes(id)) {
        updatedCategoryItems = currentCategoryItems.filter((itemId) => {
          return itemId !== id;
        });
      } else {
        updatedCategoryItems = [...currentCategoryItems, id];
      }

      return {
        ...previousProfile,
        [category]: updatedCategoryItems,
      };
    });
  };

  const handleRemoveBadge = (category, id) => {
    setProfile((previousProfile) => {
      return {
        ...previousProfile,
        [category]: previousProfile[category].filter((itemId) => {
          return itemId !== id;
        }),
      };
    });
  };

  const handleEditInfo = (values) => {
    setProfile((prev) => ({
      ...prev,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    }));
    setShowEditName(false);
  };

  const handleEditUsername = (values) => {
    setProfile((prev) => ({
      ...prev,
      username: values.username.trim(),
    }));
    setShowEditUsername(false);
  };

  const handleAddImage = (values) => {
    setProfile((prev) => ({
      ...prev,
      profileImage: values.profileImage.trim(),
    }));
    setShowEditImage(false);
  };

  const handleDeleteProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Failed to delete account.");
      setShowDeleteConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="container py-5 mt-5">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="container-fluid profile-page-content py-4 px-4 mt-5">
        {message && <div className="alert alert-info">{message}</div>}
        {saving && (
          <div className="alert alert-secondary">Saving changes...</div>
        )}
        <div className="d-flex align-items-center mb-4 profile-page-icon">
          <h1 className="profile-page-title mb-0 bi-person-circle"> Your Profile</h1>
        </div>
        <div className="row g-4 justify-content-center align-items-stretch">
          <div className="col-lg-4 d-flex flex-column">
            <ProfileSidebar
              firstName={profile.firstName}
              lastName={profile.lastName}
              username={profile.username}
              profileImage={profile.profileImage}
              onEditInfo={() => setShowEditName(true)}
              onEditUsername={() => setShowEditUsername(true)}
              onAddImage={() => setShowEditImage(true)}
            />

            <div className="mt-auto pt-3 d-flex gap-2 justify-content-left">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSaveProfile}
              >
                Save Profile
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Profile
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <ProfileCard
              firstName={profile.firstName}
              languages={selectedLanguages}
              tools={selectedTools}
              databases={selectedDatabases}
              onEditLanguages={() => setActiveModal("languages")}
              onEditTools={() => setActiveModal("tools")}
              onEditDatabases={() => setActiveModal("databases")}
              onRemoveLanguage={(id) => handleRemoveBadge("languages", id)}
              onRemoveTool={(id) => handleRemoveBadge("tools", id)}
              onRemoveDatabase={(id) => handleRemoveBadge("databases", id)}
            />
          </div>
        </div>
      </div>

      <TechSelectModal
        show={activeModal === "languages"}
        title="Edit Languages"
        options={TECHNOLOGIES.languages}
        selectedIds={profile.languages}
        onClose={() => setActiveModal("")}
        onToggle={(id) => handleToggleSelection("languages", id)}
        onSave={() => setActiveModal("")}
      />

      <TechSelectModal
        show={activeModal === "tools"}
        title="Edit Frameworks, Libraries, and Tools"
        options={TECHNOLOGIES.tools}
        selectedIds={profile.tools}
        onClose={() => setActiveModal("")}
        onToggle={(id) => handleToggleSelection("tools", id)}
        onSave={() => setActiveModal("")}
      />

      <TechSelectModal
        show={activeModal === "databases"}
        title="Edit Database Management"
        options={TECHNOLOGIES.databases}
        selectedIds={profile.databases}
        onClose={() => setActiveModal("")}
        onToggle={(id) => handleToggleSelection("databases", id)}
        onSave={() => setActiveModal("")}
      />

      <InputModal
        show={showEditName}
        title="Edit Name"
        fields={[
          { key: "firstName", label: "First Name", placeholder: "Enter first name" },
          { key: "lastName", label: "Last Name", placeholder: "Enter last name" },
        ]}
        initialValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
        }}
        submitLabel="Save"
        onSubmit={handleEditInfo}
        onCancel={() => setShowEditName(false)}
      />

      <InputModal
        show={showEditUsername}
        title="Edit GitHub Username"
        fields={[
          { key: "username", label: "GitHub Username", placeholder: "Enter your GitHub username" },
        ]}
        initialValues={{ username: profile.username }}
        submitLabel="Save"
        onSubmit={handleEditUsername}
        onCancel={() => setShowEditUsername(false)}
      />

      <InputModal
        show={showEditImage}
        title="Edit Profile Image"
        fields={[
          {
            key: "profileImage",
            label: "Image URL",
            placeholder: "Paste a profile image URL",
            required: false,
          },
        ]}
        initialValues={{ profileImage: profile.profileImage }}
        submitLabel="Save"
        onSubmit={handleAddImage}
        onCancel={() => setShowEditImage(false)}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This will permanently remove your profile, tracked repos, and all data. This cannot be undone."
        confirmLabel="Delete Account"
        confirmVariant="danger"
        onConfirm={handleDeleteProfile}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default ProfilePage;