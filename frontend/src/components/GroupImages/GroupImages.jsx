import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import ImageGallery from "../ImageGallery";
import * as groupActions from "../../store/group";

function GroupImages() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const images = useSelector(groupActions.getCurrentGroupImages(groupId));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadGroupImages = async () => {
      await dispatch(groupActions.loadGroupImages(groupId));
      setIsLoaded(true);
    }
    loadGroupImages();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;
  if (!images) return;

  return <ImageGallery groupId={groupId} images={images} />;
}

export default GroupImages;
