import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import Loading from "../Loading";
import ImageGallery from "../ImageGallery";
import * as groupActions from "../../store/group";

function GroupImages() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const images = useSelector(groupActions.getCurrentGroupImages(groupId));
  const [isLoaded, setIsLoaded] = useState(false);
  const { setModalContent } = useModal();

  useEffect(() => {
    const loadGroupImages = async () => {
      const { errors } = await dispatch(groupActions.loadGroupImages(groupId));
      if (errors) {
        setModalContent(<h2 className="subheading modal-errors">{errors.message}</h2>)
        navigate("/", { replace: true });
      }
      setIsLoaded(true);
    }
    loadGroupImages();
  }, [dispatch, groupId, navigate, setModalContent]);

  if (!isLoaded) return <Loading />;
  if (!images) return;

  return <ImageGallery groupId={groupId} images={images} />;
}

export default GroupImages;
