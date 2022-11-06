import { useState } from 'react';
import { Guest } from './AddGuest';
import Attending from './Attending';

function capitalizeName(name: string) {
  return name
    .split(' ')
    .map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    })
    .join(' ');
}

type Props = {
  guests: Guest[];
  onAttending: (value: boolean, id: number) => void;
  onRemove: (id: number) => void;
};

function ShowGuests({ guests, onRemove, onAttending }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  return (
    <div>
      <p>These people are on the guest list:</p>
      <div>
        {guests
          .filter((guest) => {
            switch (filter) {
              case null:
                return true;
              case 'attending':
                return guest.attending;
              case 'not-attending':
                return !guest.attending;
              default:
                return null;
            }
          })
          .map((guest) => {
            return (
              <div key={guest.id} className="guest" data-test-id="guest">
                <p>
                  {capitalizeName(guest.firstName)}{' '}
                  {capitalizeName(guest.lastName)}{' '}
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
        <button onClick={() => setFilter(null)}>Show all guests</button>
        <button onClick={() => setFilter('attending')}>Show attending</button>
        <button onClick={() => setFilter('not-attending')}>
          Show not attending
        </button>
      </div>
    </div>
  );
}

export default ShowGuests;
