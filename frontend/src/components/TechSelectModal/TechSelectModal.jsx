import PropTypes from "prop-types";
import "./TechSelectModal.css";

function TechSelectModal(props) {
  const { show, title, options, selectedIds, onClose, onToggle, onSave } =
    props;

  if (!show) {
    return null;
  }

  return (
    <div className="tech-select-modal-backdrop">
      <div className="tech-select-modal-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{title}</h3>

          <button
            type="button"
            className="btn btn-light border"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <p className="tech-select-modal-description">
          Select the items you want displayed on your profile.
        </p>

        <div className="d-flex flex-wrap gap-3 mt-4">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);

            let optionClassName = "tech-select-modal-option";
            if (isSelected) {
              optionClassName += " tech-select-modal-option-selected";
            }

            return (
              <button
                key={option.id}
                type="button"
                className={optionClassName}
                onClick={() => onToggle(option.id)}
              >
                <img
                  src={option.badgeUrl}
                  alt={option.name}
                  className="tech-select-modal-image"
                />

                {isSelected ? (
                  <span className="tech-select-modal-check">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="button" className="btn btn-dark" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

TechSelectModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      badgeUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TechSelectModal;
