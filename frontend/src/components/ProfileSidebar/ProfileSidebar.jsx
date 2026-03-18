import PropTypes from "prop-types";
import "./ProfileSidebar.css";

function ProfileSidebar(props) {
  const {
    firstName,
    lastName,
    username,
    profileImage,
    onEditInfo,
    onEditUsername,
    onAddImage,
  } = props;

  let imageContent;

  if (profileImage) {
    imageContent = (
      <img src={profileImage} alt="Profile" className="profile-sidebar-image" />
    );
  } else {
    imageContent = (
      <div className="profile-sidebar-empty-image">
        <i className="bi bi-person-fill profile-sidebar-empty-icon"></i>
      </div>
    );
  }

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar-image-container">
        {imageContent}

        <button
          type="button"
          className="btn btn-light border profile-sidebar-image-edit-button"
          onClick={onAddImage}
        >
          <i className="bi bi-pencil"></i>
        </button>
      </div>

      <div className="mt-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <h1 className="profile-sidebar-name">
            {firstName}, {lastName}
          </h1>

          <button
            type="button"
            className="btn btn-sm btn-light border"
            onClick={onEditInfo}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <h2 className="profile-sidebar-username">@{username}</h2>

          <button
            type="button"
            className="btn btn-sm btn-light border"
            onClick={onEditUsername}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}

ProfileSidebar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  onEditInfo: PropTypes.func.isRequired,
  onEditUsername: PropTypes.func.isRequired,
  onAddImage: PropTypes.func.isRequired,
};

export default ProfileSidebar;
