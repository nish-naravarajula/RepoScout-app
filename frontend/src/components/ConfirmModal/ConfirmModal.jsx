import PropTypes from "prop-types";
import "./ConfirmModal.css";

function ConfirmModal(props) {
  const { show, title, message, confirmLabel, confirmVariant, onConfirm, onCancel } = props;

  if (!show) {
    return null;
  }

  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="confirm-modal-title mb-0">{title}</h3>

          <button
            type="button"
            className="btn btn-light border"
            onClick={onCancel}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <p className="confirm-modal-message">{message}</p>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`btn btn-${confirmVariant || "danger"}`}
            onClick={onConfirm}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  confirmVariant: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;