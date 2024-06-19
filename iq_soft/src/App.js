import React from "react";
import "./App.css";
import { readNIFTI, drawCanvas, readFile } from "./niftiUtils";

function App() {
  function handleFileSelect(evt) {
    const files = evt.target.files;
    readFile(files[0], readNIFTI, drawCanvas);
  }

  return (
    <div className="App">
      <h1>IQSOFT Technologies Task</h1>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input
          type="file"
          id="upload"
          accept=".nii,.nii.gz"
          onChange={handleFileSelect}
        />
      </div>

      <div id="results">
        <canvas id="myCanvas" width="100" height="100"></canvas>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          value="50"
          className="slider"
          id="myRange"
        />
      </div>
    </div>
  );
}

export default App;
