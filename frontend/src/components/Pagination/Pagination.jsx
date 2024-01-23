import "./Pagination.css";

function Pagination({ listLength, handlePrevPageClick, handleNextPageClick, page }) {
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
        !listLength && (
          <h2 className="subheading no-results">
            No results found on this page <i className="fa-regular fa-face-frown"></i>
          </h2>
        )
      }
    </>
  );
}

export default Pagination;
