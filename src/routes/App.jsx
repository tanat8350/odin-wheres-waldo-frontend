import { Link } from 'react-router-dom';
function App() {
  return (
    <>
      <h1>Odin Where's Waldo</h1>
      <div className="card">
        <Link to="/game">Start game</Link>
      </div>
    </>
  );
}

export default App;
