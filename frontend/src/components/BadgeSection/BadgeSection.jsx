import PropTypes from "prop-types";
import "./BadgeSection.css";

function BadgeSection(props) {
  const { title, badges, onEdit, onRemoveBadge } = props;

  let sectionContent;

  if (badges.length === 0) {
    sectionContent = (
      <p className="badge-section-empty-text mb-0">No items added yet.</p>
    );
  } else {
    sectionContent = (
      <div className="d-flex flex-wrap gap-2 mt-2">
        {badges.map((badge) => {
          return (
            <div key={badge.id} className="badge-section-badge-wrapper">
              <img
                src={badge.badgeUrl}
                alt={badge.name}
                className="badge-section-image"
              />

              <button
                type="button"
                className="badge-section-delete-btn"
                onClick={() => onRemoveBadge(badge.id)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="badge-section">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="badge-section-title mb-0">{title}</h3>

        <button
          type="button"
          className="btn btn-sm btn-light border"
          onClick={onEdit}
        >
          <i className="bi bi-pencil"></i>
        </button>
      </div>

      {sectionContent}
    </section>
  );
}

BadgeSection.propTypes = {
  title: PropTypes.string.isRequired,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      badgeUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemoveBadge: PropTypes.func.isRequired,
};

export default BadgeSection;
