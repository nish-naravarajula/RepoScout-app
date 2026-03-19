import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  function getPageNumbers() {
    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.add(i);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  const pageNumbers = getPageNumbers();

  const items = [];
  for (let i = 0; i < pageNumbers.length; i++) {
    if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${i}` });
    }
    items.push({ type: "page", number: pageNumbers[i], key: `page-${pageNumbers[i]}` });
  }

  return (
    <nav className="pagination-container" aria-label="Page navigation">
      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="pagination-btn pagination-prev"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <i className="bi bi-chevron-left"></i> Previous
          </button>
        </li>

        {items.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <li key={item.key}>
                <span className="pagination-ellipsis">…</span>
              </li>
            );
          }
          return (
            <li key={item.key}>
              <button
                type="button"
                className={`pagination-btn pagination-num ${item.number === currentPage ? "pagination-num-active" : ""}`}
                onClick={() => onPageChange(item.number)}
              >
                {item.number}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className="pagination-btn pagination-next"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;