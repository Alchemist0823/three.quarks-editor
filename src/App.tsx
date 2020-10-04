import React, {useState} from 'react';
import {PiecewiseBezier} from "three.quarks";
import {Application} from "./components/Application";
import {Bezier} from "three.quarks";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from '@material-ui/core';
import {BezierCurvesEditor} from "./components/editors/bezier/BezierCurvesEditor";

const theme = createMuiTheme({
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
