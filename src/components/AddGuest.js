import { useEffect, useState } from 'react';
import ShowGuests from './ShowGuests';

const baseUrl =
  'https://express-guest-list-api-memory-data-store.dertimonius.repl.co';

function AddGuest() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch guest list from API
  async function fetchFromAPI() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setIsLoading(false);
    setGuests(allGuests);
  }
  useEffect(() => {
    fetchFromAPI().catch(() => {});
  }, []);

  // Add guest to API
  async function addToAPI() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const newGuest = await response.json();
    setGuests([...guests, newGuest]);
    setFirstName('');
    setLastName('');
  }

  // Delete guest
  async function deleteFromAPI(id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    setGuests(guests.filter((guest) => guest.id !== id));
    fetchFromAPI().catch(() => {});
  }
  const handleRemove = (id) => {
    deleteFromAPI(id).catch((err) => console.log(err));
    setGuests(guests.filter((guest) => guest.id !== id));
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
      body: JSON.stringify({ attending: value }),
    });
    fetchFromAPI().catch(() => {});
  }

  return (
    <div data-test-id="guest">
      <div className="addGuest">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToAPI().catch(() => {});
          }}
        >
          <label htmlFor="firstName">First name</label>
          <input
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            disabled={isLoading}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            disabled={isLoading}
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
