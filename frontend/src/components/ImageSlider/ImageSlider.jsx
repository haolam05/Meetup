import { useState } from "react";
import "./ImageSlider.css";

function ImageSlider({ images }) {
  const [slide, setSlide] = useState(0);

  const handleClick = () => {
    if (images.length) {
      const image = document.querySelector('.slider-image>img');
      if (!image.classList.contains("fade")) {
        nextSlide(image);
        image.classList.add("fade");
        setTimeout(() => image.classList.remove("fade"), 1500);
      }
    }
  }

  const nextSlide = image => {
    const nextSlide = (slide + 1) % images.length;
    setSlide(nextSlide);
    image.src = images[nextSlide].url;
  }

  return (
    <img
      src={images.length && images[slide].url ? images[slide].url : '/images/no-preview-available.jpg'}
      alt="image"
      onClick={handleClick}
    />
  );
}

export default ImageSlider;
