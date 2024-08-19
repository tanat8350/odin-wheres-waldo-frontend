const Dropdown = ({ data, results, coord, setChosen }) => {
  return (
    <div
      className="dropdown"
      style={{ top: `${coord.y}px`, left: `${coord.x}px` }}
    >
      {data &&
        data.locations.map((_, i) => {
          return (
            <div>
              <img
                key={i}
                className={results.current[i] && 'found'}
                src={`http://localhost:3000/images/${data.id}/${i + 1}.jpg`}
                alt={i}
                onClick={() => setChosen(i)}
              />
            </div>
          );
        })}
    </div>
  );
};
export default Dropdown;
