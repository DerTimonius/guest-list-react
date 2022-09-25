import { useEffect, useState } from 'react';
import ShowGuests from './ShowGuests';

const baseUrl =
  'https://express-guest-list-api-memory-data-store.dertimonius.repl.co';

function capitalizeName(name) {
  return name
    .split(' ')
    .map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    })
    .join(' ');
}

function AddGuest() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [changed, setChanged] = useState(false);

  // Fetch guest list from API
  async function fetchFromAPI() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    return allGuests;
  }
  useEffect(() => {
    fetchFromAPI().catch(() => {});
    setIsDisabled(false);
    setIsLoading(false);
  }, []);

  // Add guest to API
  async function addToAPI(guest) {
    await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guest),
    });
  }
  useEffect(() => {
    fetchFromAPI().catch(() => {});
  }, [changed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGuest = {
      firstName: capitalizeName(firstName),
      lastName: capitalizeName(lastName),
      attending: false,
    };
    addToAPI(newGuest).catch((err) => console.log(err));
    setFirstName('');
    setLastName('');
    setChanged(!changed);
  };

  // Delete guest
  async function deleteFromAPI(id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    fetchFromAPI().catch(() => {});
  }
  const handleRemove = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
    deleteFromAPI(id).catch((err) => console.log(err));
  };

  // Delete all guests
  async function deleteAllGuest() {
    await Promise.all(
      guests.map(async (guest) => {
        const response = await fetch(`${baseUrl}/guests/${guest.id}`, {
          method: 'DELETE',
        });
        await response.json();
      }),
    ).then(() => setGuests([]));
  }

  // Update attending status
  async function toggleAttending(value, id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !value }),
    });
    setChanged(!changed);
  }

  return (
    <div data-test-id="guest">
      <div className="addGuest">
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First name</label>
          <input
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            disabled={isDisabled}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            disabled={isDisabled}
          />
          <button className="disable">Add Guest</button>
        </form>
      </div>
      <button onClick={deleteAllGuest}>Delete all</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : guests.length ? (
        <ShowGuests
          guests={guests}
          onRemove={handleRemove}
          onAttending={toggleAttending}
        />
      ) : (
        <div>There are currently no guests on the list</div>
      )}
    </div>
  );
}

export default AddGuest;
