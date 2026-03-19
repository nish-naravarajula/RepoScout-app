import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./InputModal.css";

function InputModal(props) {
  const {
    show, title, fields, initialValues, submitLabel, onSubmit, onCancel,
  } = props;

  const [values, setValues] = useState({});

  useEffect(() => {
    if (show) {
      const init = {};
      for (const field of fields) {
        init[field.key] = initialValues?.[field.key] || "";
      }
      setValues(init);
    }
  }, [show, initialValues, fields]);

  if (!show) {
    return null;
  }

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  const allFilled = fields.every((field) => {
    if (field.required === false) {
      return true;
    }
    return (values[field.key] || "").trim().length > 0;
  });

  return (
    <div className="input-modal-backdrop" onClick={onCancel}>
      <div className="input-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="input-modal-title mb-0">{title}</h3>
          <button
            type="button"
            className="btn btn-light border"
            onClick={onCancel}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className="mb-3">
              <label className="input-modal-label">{field.label}</label>
              <input
                type={field.type || "text"}
                className="form-control input-modal-input"
                placeholder={field.placeholder || ""}
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${allFilled ? "input-modal-submit-ready" : "btn-secondary"}`}
              disabled={!allFilled}
            >
              {submitLabel || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InputModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      required: PropTypes.bool,
    }),
  ).isRequired,
  initialValues: PropTypes.object,
  submitLabel: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default InputModal;