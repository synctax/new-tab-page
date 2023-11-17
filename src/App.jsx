import "./App.css";
import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

import MomCircles from "./sketches/MomCircles";
import Cityscape from "./sketches/Cityscape";

function App() {
	return (
		<div className="App">
			<ReactP5Wrapper sketch={Cityscape} />
		</div>
	);
}

export default App;
