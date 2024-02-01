import { useModal } from "../../context/Modal";
import BackButton from "../BackButton";
import ImageActionsModal from "../ImageActionsModal/ImageActionsModal";
import "./ImageGallery.css";

function ImageGallery({ groupId, images }) {
  const { setModalContent } = useModal();

  return (
    <div id="lists-container">
      <div id="lists">
        <BackButton url={`/groups/${groupId}`} btnText="Group" />
        <div>
          <h1 className="group-name heading gallery-header">Manage Gallery</h1>
        </div>
        <div className="group details gallery">
          {images.map(image => (
            <div className="group-image gallery-image" key={image.id}>
              <div className="group-thumbnail gallery-thumbnail">
                <img
                  src={image.url}
                  alt="gallery-image"
                  onClick={() => setModalContent(<ImageActionsModal groupId={groupId} imageId={image.id} />)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
