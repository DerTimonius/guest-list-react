import Attending from './Attending';

function ShowGuests({ guests, onRemove, onAttending }) {
  return (
    <div>
      <p>These people are on the guest list:</p>
      <div>
        {guests.map((guest) => {
          return (
            <div key={guest.id} className="guest">
              <p>
                {guest.firstName} {guest.lastName}{' '}
              </p>
              <Attending guest={guest} onAttending={onAttending} />
              <button
                aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                onClick={() => onRemove(guest.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShowGuests;
