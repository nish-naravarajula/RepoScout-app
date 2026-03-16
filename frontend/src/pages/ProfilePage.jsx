import { useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar.jsx";
import ProfileCard from "../components/ProfileCard/ProfileCard.jsx";
import TechSelectModal from "../components/TechSelectModal/TechSelectModal.jsx";
import { TECHNOLOGIES } from "../data/technologies.js";
import "./ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "First_name",
    lastName: "Last_name",
    username: "github_username",
    profileImage: "",
    languages: [],
    tools: [],
    databases: [],
  });

  const [activeModal, setActiveModal] = useState("");

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

  const handleEditInfo = () => {
    alert("Later we can connect this to an edit profile info modal.");
  };

  const handleAddImage = () => {
    alert("Later we can connect this to image upload.");
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="container-fluid profile-page-content py-4 px-4 mt-5">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-4">
            <ProfileSidebar
              firstName={profile.firstName}
              lastName={profile.lastName}
              username={profile.username}
              profileImage={profile.profileImage}
              onEditInfo={handleEditInfo}
              onAddImage={handleAddImage}
            />
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
    </div>
  );
}

export default ProfilePage;
