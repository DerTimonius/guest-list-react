import { useState } from 'react';
import Attending from './Attending';

function ShowGuests({ guests, onRemove, onAttending }) {
  const [guestArr, setGuestArr] = useState(guests);

  function handleClick(bool) {
    const newArr = guests.filter((guest) => {
      return guest.attending === bool;
    });
    setGuestArr(newArr);
  }

  return (
    <div>
      <p>These people are on the guest list:</p>
      <div>
        {guestArr.map((guest) => {
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
      <div className="filter">
        <h4>Filter</h4>
        <button onClick={() => setGuestArr(guests)}>Show all guests</button>
        <button onClick={() => handleClick(true)}>Show attending</button>
        <button onClick={() => handleClick(false)}>Show not attending</button>
      </div>
    </div>
  );
}

export default ShowGuests;
