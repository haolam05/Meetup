import "./ImageSlider.css";

function ImageSlider({ images, slide, setSlide }) {
  const handleClick = () => {
    const image = document.querySelector('.slider-image>img');
    if (!image.classList.contains("slide-up")) {
      nextSlide(image);
      image.classList.add("slide-up");
      setTimeout(() => image.classList.remove("slide-up"), 1500);
    }
  }

  const nextSlide = image => {
    const nextSlide = (slide + 1) % images.length;
    setSlide(nextSlide);
    image.src = images[nextSlide].url;
  }

  return (
    <>
      <div className="group-thumbnail slider-image">
        <img
          src={images[slide].url}
          alt="image"
          className="fade"
          onClick={handleClick}
        />
      </div>
    </>
  );
}

export default ImageSlider;
