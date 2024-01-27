import { useState } from "react";
import NoResultsFound from "../NoResultsFound";
import "./Pagination.css";

function Pagination({ list, page, size, setPage, setSize, searchMode }) {
  const [pageInput, setPageInput] = useState(page);
  const [sizeInput, setSizeInput] = useState(size);

  const handlePrevPageClick = () => {
    if (!searchMode && page > 1) {
      setPage(page - 1);
      setPageInput(page - 1);
      document.querySelector(".page-prev").setAttribute("disabled", "");
      document.querySelector(".page-next").setAttribute("disabled", "");
    }
  }

  const handleNextPageClick = () => {
    if (!searchMode && page > 0 && list.length) {
      setPage(page + 1);
      setPageInput(page + 1);
      document.querySelector(".page-prev").setAttribute("disabled", "");
      document.querySelector(".page-next").setAttribute("disabled", "");
    }
  }

  const handlePageLoad = () => {
    if (+pageInput >= 1 && +sizeInput >= 5) {
      setPage(+pageInput);
      setSize(+sizeInput);
      document.querySelector('.input-page').setAttribute("disabled", "");
      document.querySelector('.input-size').setAttribute("disabled", "");
      document.querySelector('.page-load').setAttribute("disabled", "");
    }
  }

  return (
    <>
      <button className="btn-accent page-prev" onClick={handlePrevPageClick}>Prev Page</button>
      <button className="btn-teal page-curr">
        <span>Page</span>
        <input className="input-page" type="number" value={pageInput} onChange={e => setPageInput(e.target.value)} min="1" />
        <span>Size</span>
        <input className="input-size" type="number" value={sizeInput} onChange={e => setSizeInput(e.target.value)} min="5" />
        <a className="page-load" href="#" onClick={handlePageLoad}>Load</a>
      </button>
      <button className="btn-accent page-next" onClick={handleNextPageClick}>Next Page</button>
      {!searchMode && !list.length && <NoResultsFound />}
    </>
  );
}

export default Pagination;
