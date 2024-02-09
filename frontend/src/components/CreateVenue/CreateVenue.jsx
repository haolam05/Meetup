import VenueFormModal from "../VenueFormModal";

function CreateVenue({ apiKey, groupId }) {
  return (
    <>
      <h2 className="subheading">Create New Venue</h2>
      <VenueFormModal apiKey={apiKey} groupId={groupId} />
    </>
  );
}

export default CreateVenue;
