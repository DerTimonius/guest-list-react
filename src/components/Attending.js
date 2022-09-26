function Attending({ guest, onAttending }) {
  return (
    <div>
      <label htmlFor="attending">Attending</label>
      <input
        aria-label={`${guest.firstName} ${guest.lastName} attending`}
        type="checkbox"
        name="attending"
        id="attending"
        checked={guest.attending}
        onChange={() => {
          guest.attending = !guest.attending;
          onAttending(guest.attending, guest.id);
        }}
      />
    </div>
  );
}

export default Attending;
