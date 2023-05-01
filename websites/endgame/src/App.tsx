import React from 'react';
import logo from './logo.svg';
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
    axios.get(`https://danieljamesin-backup-public.s3.amazonaws.com/endgame_${positionNumber}`).then(response => {
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
      {solutionMode === false ?
        <div>
          <textarea id="solution"></textarea>
          <button onClick={() => {
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
            // https://hymj3gzswtkqrn6fhtl5zjouku0uoumy.lambda-url.us-east-1.on.aws/?index=1&object="{\"fen\":\"8/8/b2K4/kp2N3/p7/P1P5/8/8 w - - 0 1\",\"solution\":\"Testing\"}"
            // https://hymj3gzswtkqrn6fhtl5zjouku0uoumy.lambda-url.us-east-1.on.aws/?index=1&object=%7B%22fen%22%3A%228%2F8%2Fb2K4%2Fkp2N3%2Fp7%2FP1P5%2F8%2F8+w+-+-+0+1%22%2C%22solution%22%3A%22%22%7D
            // https://hymj3gzswtkqrn6fhtl5zjouku0uoumy.lambda-url.us-east-1.on.aws/?index=1&object=%7B%5C%22fen%5C%22%3A%5C%228%2F8%2Fb2K4%2Fkp2N3%2Fp7%2FP1P5%2F8%2F8+w+-+-+0+1%5C%22%2C%5C%22solution%5C%22%3A%5C%22test%5C%22%7D
            console.log(url.href);
            console.log(url.searchParams);
          }}>Submit</button>
        </div>
       : null}
       {soln != null ?
       <div>
        <h3>Solution</h3>
        <div>{soln}</div>
       </div>
        : null}
    </div>
  );
}

export default App;
