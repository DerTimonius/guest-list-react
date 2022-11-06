import { Guest } from './AddGuest';

type Props = {
  guest: Guest;
  onAttending: (value: boolean, id: number) => void;
};

function Attending({ guest, onAttending }: Props) {
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
          onAttending(guest.attending, guest.id);
        }}
      />
    </div>
  );
}

export default Attending;
