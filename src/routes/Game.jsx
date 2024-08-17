import { useEffect, useRef, useState } from 'react';

const MAX_DIFF_X = 50;
const MAX_DIFF_Y = 100;

const Game = () => {
  const [data, setData] = useState(null);
  // const [circle, setCircle]
  const locations = useRef(null);

  const onClick = (e) => {
    const t = e.target.getBoundingClientRect();
    const xx = e.clientX - t.left;
    const yy = e.clientY - t.left;
    console.log(t, xx, yy);
    const copy = [...locations.current];
    let found = null;
    for (const [index, value] of locations.current.entries()) {
      const [x, y] = value.split(',');
      if (
        Math.abs(x - e.pageX) < MAX_DIFF_X &&
        Math.abs(y - e.pageY) < MAX_DIFF_Y
      ) {
        found = index;
        break;
      }
    }
    if (found === 0 || found) copy.splice(found, 1);
    locations.current = copy;
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
        locations.current = json.locations;
        console.log(json);
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
              <img
                src={'http://localhost:3000/images/' + data.id + '/1.jpg'}
                alt="1"
              />
              <img
                src={'http://localhost:3000/images/' + data.id + '/2.jpg'}
                alt="2"
              />
              <img
                src={'http://localhost:3000/images/' + data.id + '/3.jpg'}
                alt="3"
              />
            </div>
            <img
              src={'http://localhost:3000/images/' + data.id + '/game.jpg'}
              alt="game"
              onClick={onClick}
            />
          </div>
        </>
      )}
      <button onClick={() => console.log(data)}>click</button>
    </>
  );
};
export default Game;
