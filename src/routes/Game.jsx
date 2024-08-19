import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Timer from '../components/Timer';
import { timeFormat } from '../helpers/timerFormat';
import Dropdown from '../components/Dropdown';

const MAX_DIFF_X = 50;
const MAX_DIFF_Y = 100;
const MARK_SIZE = 50;
const STICKY_SIZE = 100;

const Game = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [circles, setCircles] = useState([]);
  const locations = useRef(null);
  const results = useRef(null);
  const modal = useRef(null);
  const [timer, setTimer] = useState(false);
  const refSec = useRef(0);
  const [dropdownCoord, setDropdownCoord] = useState(null);
  const [chosen, setChosen] = useState(null);

  const clickImage = async (e) => {
    const px = e.pageX;
    const py = e.pageY;
    if (!dropdownCoord) {
      setDropdownCoord({ x: px, y: py });
    } else {
      setDropdownCoord(null);
    }
    const copy = [...locations.current];
    let found = null;
    let originalIndex = null;
    for (const [index, value] of locations.current.entries()) {
      const [i, x, y] = value.split(',');
      if (Math.abs(x - px) < MAX_DIFF_X && Math.abs(y - py) < MAX_DIFF_Y) {
        found = index;
        originalIndex = i;
        break;
      }
    }
    if (found === 0 || found) {
      results.current[originalIndex] = `${px},${py}`;
      copy.splice(found, 1);
      locations.current = copy;
      setCircles([
        ...circles,
        { key: found, x: px - MARK_SIZE / 2, y: py - MARK_SIZE / 2 },
      ]);
    }
    if (locations.current.length === 0) {
      const res = await fetch(`http://localhost:3000/game/${data.gameid}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageid: data.id,
          results: results.current,
          duration: refSec.current,
        }),
        mode: 'cors',
      });
      const json = await res.json();
      if (json.success) {
        modal.current.showModal();
        setTimer(false);
        return;
      }
      // to maybe show error msg
      navigate('/');
    }
  };

  const submitName = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/game/${data.gameid}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: e.target.name.value }),
      mode: 'cors',
    });
    const json = await res.json();
    if (json.success) {
      navigate('/score');
    }
  };

  useEffect(() => {
    fetch('http://localhost:3000/game', { mode: 'cors' })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        locations.current = json.locations.map((value, index) => {
          return `${index},${value}`;
        });
        results.current = new Array(json.locations.length);
        setData(json);
        setTimer(true);
      });
  }, []);
  return (
    <>
      <h1>Odin Where's Waldo</h1>
      {/* // to delete game session before navigate */}
      <Link to="/">Back to home</Link>
      {data && (
        <>
          <h2>Image Name: {data.name}</h2>
          {data && <Timer isRunning={timer} refSec={refSec} />}
          <div>
            <div className="sticky">
              {data &&
                data.locations.map((_, i) => {
                  return (
                    <img
                      key={i}
                      src={`http://localhost:3000/images/${data.id}/${i + 1}.jpg`}
                      alt={i}
                      className={results.current[i] && 'found'}
                      style={{ height: `${STICKY_SIZE}px` }}
                    />
                  );
                })}
            </div>
            <img
              src={'http://localhost:3000/images/' + data.id + '/game.jpg'}
              alt="game"
              onClick={clickImage}
            />
            {circles.length > 0 &&
              circles.map((c, i) => {
                return (
                  <FontAwesomeIcon
                    key={i}
                    icon={faCircleCheck}
                    bounce
                    className="mark"
                    style={{
                      position: 'absolute',
                      top: `${c.y}`,
                      left: `${c.x}`,
                      color: '#00ff00',
                      height: `${MARK_SIZE}px`,
                    }}
                  />
                );
              })}
          </div>
          {data && dropdownCoord && (
            <Dropdown
              data={data}
              results={results}
              coord={dropdownCoord}
              setChosen={setChosen}
            />
          )}
          <dialog
            ref={modal}
            onCancel={(e) => e.preventDefault()}
            onKeyDown={(e) => e.key === 'Escape' && e.preventDefault()}
          >
            <h1>Congratulations!</h1>
            <p>Enter your name</p>
            <p>Time: {timeFormat(refSec.current)}</p>
            <form onSubmit={submitName}>
              <input type="text" name="name" id="name" />
              <button type="submit">Save</button>
              <button onClick={() => navigate('/')}>Close without save</button>
            </form>
          </dialog>
        </>
      )}
    </>
  );
};
export default Game;
