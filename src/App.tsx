import React, {useState} from 'react';
import {Application} from "./components/Application";
import blue from "@mui/material/colors/blue";
import red from "@mui/material/colors/red";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import "./Global.scss";

const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: red[500],
        },
    },
    typography: {
        fontSize: 12,
    }
});

const App: React.FC = () => {
  /*const [bezierCurves, setBezierCurves] = useState(
      new PiecewiseBezier([
        [new Bezier(0, 0.5 / 3, 0.5 / 3 * 2, 0.5), 0],
        [new Bezier(0.5, 0.5, 0.5, 0.5), 0.5],
      ])
  );return <div className="App">
        <header className="App-header">
            <BezierCurvesEditor width={200} height={100} value={bezierCurves} onChange={(bezierCurves) => {setBezierCurves(bezierCurves)}}/>
        </header>
    </div>;*/

    return (<ThemeProvider theme={theme}><Application /></ThemeProvider>);
};

export default App;
