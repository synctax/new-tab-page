import "./App.css";
import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

import MomCircles from "./sketches/MomCircles";
import Cityscape from "./sketches/Cityscape";
import Plants from "./sketches/plants";

function App() {
	return (
		<div className="App">
			<ReactP5Wrapper sketch={Plants} />
		</div>
	);
}

export default App;
