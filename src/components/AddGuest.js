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

  // Fetch guest list from API
  async function fetchFromAPI() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    setIsDisabled(false);
    setIsLoading(false);
  }
  useEffect(() => {
    fetchFromAPI().catch(() => {});
  }, []);

  // Add guest to API
  async function addToAPI(guest) {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guest),
    });
    const createdGuest = await response.json();
    setGuests([...guests, createdGuest]);
  }

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
  };

  // Delete guest
  async function deleteFromAPI(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    response.status === 200
      ? setGuests(guests.filter((guest) => guest !== deletedGuest))
      : alert('Unable to delete guest');
    fetchFromAPI().catch(() => {});
  }
  const handleRemove = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
    deleteFromAPI(id).catch((err) => console.log(err));
  };

  // Get single guest from API
  async function getGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`);
    const guest = await response.json();
    return guest;
  }

  // Update attending status
  async function toggleAttending(id) {
    const guestToggleAttending = await getGuest(id);
    const updatedGuest = {
      attending: !guestToggleAttending.attending,
    };
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGuest),
    });
    const updated = await response.json();
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, attending: updated.attending } : guest,
      ),
    );
    fetchFromAPI().catch(() => {});
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
