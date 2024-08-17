import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

const MAX_DIFF_X = 50;
const MAX_DIFF_Y = 100;
const MARK_SIZE = 50;
const STICKY_SIZE = 100;

const Game = () => {
  const [data, setData] = useState(null);
  const [circles, setCircles] = useState([]);
  const locations = useRef(null);
  const result = useRef(null);

  const onClick = (e) => {
    const px = e.pageX;
    const py = e.pageY;
    console.log(px, py);
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
      result.current[originalIndex] = `${px},${py}`;
      copy.splice(found, 1);
      locations.current = copy;
      console.log('result', result.current);
      setCircles([
        ...circles,
        { key: found, x: px - MARK_SIZE / 2, y: py - MARK_SIZE / 2 },
      ]);
    }
    if (locations.current.length === 0) {
      console.log('you won');
    }
  };
  useEffect(() => {
    fetch('http://localhost:3000/game', { mode: 'cors' })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setData(json);
        locations.current = json.locations.map((value, index) => {
          return `${index},${value}`;
        });
        result.current = new Array(json.locations.length);
      });
  }, []);
  return (
    <>
      <h1>Odin Where's Waldo</h1>
      {data && (
        <>
          <h2>Image Name: {data.name}</h2>
          <div>
            <div className="sticky">
              {data &&
                data.locations.map((_, i) => {
                  return (
                    <img
                      src={`http://localhost:3000/images/${data.id}/${i + 1}.jpg`}
                      alt={i}
                      className={result.current[i] && 'found'}
                      style={{ height: `${STICKY_SIZE}px` }}
                    />
                  );
                })}
            </div>
            <img
              src={'http://localhost:3000/images/' + data.id + '/game.jpg'}
              alt="game"
              onClick={onClick}
            />
            {circles.length > 0 &&
              circles.map((c) => {
                return (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    bounce
                    className="fail-mark"
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
        </>
      )}
    </>
  );
};
export default Game;
