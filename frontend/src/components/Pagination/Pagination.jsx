import NoResultsFound from "../NoResultsFound";
import "./Pagination.css";

function Pagination({ list, page, setPage, searchMode }) {
  const handlePrevPageClick = () => {
    if (!searchMode && page > 1) {
      setPage(page - 1);
      document.querySelector(".page-prev").setAttribute("disabled", "");
      document.querySelector(".page-next").setAttribute("disabled", "");
    }
  }

  const handleNextPageClick = () => {
    if (!searchMode && page > 0 && list.length) {
      setPage(page + 1);
      document.querySelector(".page-prev").setAttribute("disabled", "");
      document.querySelector(".page-next").setAttribute("disabled", "");
    }
  }

  return (
    <>
      <button className="btn-accent page-prev" onClick={handlePrevPageClick}>Prev Page</button>
      <button className="btn-teal page-curr">Page {page}</button>
      <button className="btn-accent page-next" onClick={handleNextPageClick}>Next Page</button>
      {!searchMode && !list.length && <NoResultsFound />}
    </>
  );
}

export default Pagination;
