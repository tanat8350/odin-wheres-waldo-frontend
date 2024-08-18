import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Scoreboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:3000/score', { mode: 'cors' })
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <>
      <h1>Scoreboard</h1>
      <Link to="/">Back to home</Link>
      <table>
        <tr>
          <th>Date</th>
          <th>Player</th>
          <th>Image id</th>
          <th>Time (m)</th>
        </tr>
        {data &&
          data.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.finish).toLocaleString()}</td>
              <td>{item.player ? item.player : 'Anonymous'}</td>
              <td>{item.imageid}</td>
              <td>
                {Math.floor(
                  ((new Date(item.finish) - new Date(item.start)) /
                    (1000 * 60)) *
                    100
                ) / 100}
              </td>
            </tr>
          ))}
      </table>
    </>
  );
};

export default Scoreboard;
