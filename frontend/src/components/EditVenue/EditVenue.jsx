import VenueFormModal from "../VenueFormModal";

function EditVenue({ apiKey, groupId, venue }) {
  return (
    <>
      <h2 className="subheading">Edit Venue</h2>
      <VenueFormModal apiKey={apiKey} groupId={groupId} venue={venue} />
    </>
  );
}

export default EditVenue;
