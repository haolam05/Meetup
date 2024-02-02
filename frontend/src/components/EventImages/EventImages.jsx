import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import ImageGallery from "../ImageGallery";
import { useModal } from "../../context/Modal";
import * as eventActions from "../../store/event";

function EventImages() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const images = useSelector(eventActions.getCurrentEventImages(eventId));
  const [isLoaded, setIsLoaded] = useState(false);
  const { setModalContent } = useModal();

  useEffect(() => {
    const loadEventImages = async () => {
      const { errors } = await dispatch(eventActions.loadEventImages(eventId));
      if (errors) {
        setModalContent(<h2 className="subheading modal-errors">{errors.message}</h2>)
        navigate("/", { replace: true });
      }
      setIsLoaded(true);
    }
    loadEventImages();
  }, [dispatch, eventId, navigate, setModalContent]);

  if (!isLoaded) return <Loading />;
  if (!images) return;

  return <ImageGallery eventId={eventId} images={images} />;
}

export default EventImages;
