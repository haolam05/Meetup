import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import ImageGallery from "../ImageGallery";
import * as eventActions from "../../store/event";

function EventImages() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const images = useSelector(eventActions.getCurrentEventImages(eventId));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadEventImages = async () => {
      await dispatch(eventActions.loadEventImages(eventId));
      setIsLoaded(true);
    }
    loadEventImages();
  }, [dispatch, eventId]);

  if (!isLoaded) return <Loading />;
  if (!images) return;

  return <ImageGallery eventId={eventId} images={images} />;
}

export default EventImages;
