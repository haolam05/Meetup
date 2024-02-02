import { useModal } from "../../context/Modal";
import BackButton from "../BackButton";
import ImageActionsModal from "../ImageActionsModal";
import ImageFormModal from "../ImageFormModal";
import NoResultsFound from "../NoResultsFound";
import "./ImageGallery.css";

function ImageGallery({ groupId, eventId, images }) {
  const { setModalContent } = useModal();

  return (
    <div id="lists-container">
      <div id="lists">
        {groupId ? (
          <BackButton url={`/groups/${groupId}`} btnText="Group" />
        ) : (
          <BackButton url={`/events/${eventId}`} btnText="Event" />
        )}
        <div>
          <h1 className="group-name heading gallery-header">
            {groupId ? 'Group' : 'Event'} Gallery <i
              className="fa-solid fa-cloud-arrow-up"
              onClick={() => setModalContent(
                <ImageFormModal
                  groupId={groupId}
                  eventId={eventId}
                />
              )}
            >
            </i>
          </h1>
        </div>
        <div className="group details gallery">
          {images.length ? (
            images.map(image => (
              <div className="group-image gallery-image" key={image.id}>
                <div className="group-thumbnail gallery-thumbnail">
                  <img
                    src={image.url}
                    alt="gallery-image"
                    onClick={() => setModalContent(
                      <ImageActionsModal
                        eventId={eventId}
                        groupId={groupId}
                        imageId={image.id}
                      />
                    )}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="gallery-results-not-found">
              <NoResultsFound />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
