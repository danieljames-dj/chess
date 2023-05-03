import React from 'react';
import './App.css';
import axios from 'axios';
import { Chessboard } from "react-chessboard";

function App() {

  const [positionNumber, setPositionNumber] = React.useState(parseInt(window.location.pathname.split('/').slice(-1)[0]) || 1);
  const [fen, setFen] = React.useState('');
  const [soln, setSoln] = React.useState(null);
  const [solutionMode, setSolutionMode] = React.useState(false);

  React.useEffect(() => {
    setSolutionMode(false);
    axios.get(`${process.env.REACT_APP_S3_URL}/endgame_${positionNumber}`).then(response => {
      setFen(response.data.fen);
      if (response.data.solution) {
        setSoln(response.data.solution);
      }
    });
  }, [positionNumber]);

  return (
    <div>
      <h2>Study {positionNumber}</h2>
      <Chessboard
        position={fen}
        boardWidth={300}
      />
      {solutionMode === true ?
        <div>
          <textarea id="solution"></textarea>
          <button onClick={async () => {
            const solution = (document.getElementById('solution') as HTMLInputElement)?.value;
            const url = new URL(process.env.REACT_APP_FUNCTION_URL || '');
            console.log(JSON.stringify({
              fen: fen,
              solution: solution
            }));
            url.searchParams.append('index', positionNumber.toString());
            url.searchParams.append('object', JSON.stringify({
              fen: fen,
              solution: solution
            }));
            await axios.get(url.href);
          }}>Submit</button>
        </div>
       : null}
       {soln != null ?
       <div style={{
        whiteSpace: 'pre-wrap',
        paddingBottom: '20px',
       }}>
        <h3>Solution</h3>
        <div>{soln}</div>
       </div>
        : null}
      <div style={{
        display: 'flex',
      }}>
        <button onClick={() => {
          window.location.href = `${window.location.origin}/${positionNumber-1}`;
        }}>Previous</button>
        <button onClick={() => {
          window.location.href = `${window.location.origin}/${positionNumber+1}`;
        }}>Next</button>
        {solutionMode === false ? <button onClick={() => {
          const password = window.prompt("Enter password");
          if (password === 'end') {
            setSolutionMode(true);
          }
        }}>Overwrite solution</button> : null}
      </div>
    </div>
  );
}

export default App;
