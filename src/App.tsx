import './App.css';
import AddGuest from './components/AddGuest';

function App() {
  return (
    <div className="App">
      <h1>The Guest List</h1>
      <div className="container">
        <p>Add a new guest</p>
        <AddGuest />
      </div>
    </div>
  );
}

export default App;
