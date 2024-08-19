import { Link } from 'react-router-dom';
function App() {
  return (
    <>
      <h1>Odin Where's Waldo</h1>
      <div className="card">
        <div>
          <Link className="button" to="/game">
            Start game
          </Link>
          <Link className="button" to="/score">
            Scoreboard
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;
