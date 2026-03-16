import PropTypes from "prop-types";
import BadgeSection from "../BadgeSection/BadgeSection";
import "./ProfileCard.css";

function ProfileCard(props) {
  const {
    firstName,
    languages,
    tools,
    databases,
    onEditLanguages,
    onEditTools,
    onEditDatabases,
    onRemoveLanguage,
    onRemoveTool,
    onRemoveDatabase,
  } = props;

  return (
    <div>
      <div className="card profile-card shadow-sm">
        <div className="card-body p-4">

          <h2 className="profile-card-title">Hello, {firstName}! Add your skills here:</h2>

          <hr />

          <BadgeSection
            title="Languages"
            badges={languages}
            onEdit={onEditLanguages}
            onRemoveBadge={onRemoveLanguage}
          />

          <BadgeSection
            title="Frameworks, Libraries, and Tools"
            badges={tools}
            onEdit={onEditTools}
            onRemoveBadge={onRemoveTool}
          />

          <BadgeSection
            title="Database Management"
            badges={databases}
            onEdit={onEditDatabases}
            onRemoveBadge={onRemoveDatabase}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button type="button" className="profile-sidebar-dashboard-btn mt-4">
          Open-Source Dashboard
        </button>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  firstName: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      badgeUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      badgeUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  databases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      badgeUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onEditLanguages: PropTypes.func.isRequired,
  onEditTools: PropTypes.func.isRequired,
  onEditDatabases: PropTypes.func.isRequired,
  onRemoveLanguage: PropTypes.func.isRequired,
  onRemoveTool: PropTypes.func.isRequired,
  onRemoveDatabase: PropTypes.func.isRequired,
};

export default ProfileCard;
