import "./Pagination.css";

function Pagination({ list, page, setPage }) {
  const handlePrevPageClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  const handleNextPageClick = () => {
    if (page > 0 && list.length) {
      setPage(page + 1);
    }
  }

  return (
    <>
      <div id="pagination">
        <div id="pagination-btns">
          <button className="btn-accent page-prev" onClick={handlePrevPageClick}>Prev Page</button>
          <button className="btn-teal page-curr">Page {page}</button>
          <button className="btn-accent page-next" onClick={handleNextPageClick}>Next Page</button>
        </div>
      </div>
      {
        !list.length && (
          <h2 className="subheading no-results">
            No results found on this page <i className="fa-regular fa-face-frown"></i>
          </h2>
        )
      }
    </>
  );
}

export default Pagination;
