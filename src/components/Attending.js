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
          onAttending(guest.id);
        }}
      />
    </div>
  );
}

export default Attending;
