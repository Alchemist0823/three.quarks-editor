import * as React from "react";
import {Euler, Object3D, Vector3} from "three";
import {Vector3Editor} from "./editors/Vector3Editor";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {StringInput} from "./editors/StringInput";
import {ScriptEditor} from "./editors/ScriptEditor";
import {Typography} from "@mui/material";

interface ScriptPropertiesProps {
    object3d: Object3D,
    updateProperties: () => void,
}


export class ScriptProperties extends React.PureComponent<ScriptPropertiesProps> {
    constructor(props: Readonly<ScriptPropertiesProps>) {
        super(props);
    }

    onChangeScript = (script: string) => {
        if (this.props.object3d.userData === null) {
            this.props.object3d.userData = {};
        }
        this.props.object3d.userData.script = script;
        this.props.object3d.userData.func = new Function("delta", script);
        this.props.updateProperties();
    };

    render() {
        return (
            <div>
                <ApplicationContextConsumer>
                    {context => context &&
                        <React.Fragment>
                        <Typography component={"label"} className="script">Script:</Typography> <br/>
                        <Typography component={"code"} className="script">function update(delta) &#123;</Typography>
                        <ScriptEditor className="editor" value={this.props.object3d.userData.script || ""} onChange={this.onChangeScript}/>
                        <Typography component={"code"} className="script">&#125;</Typography>
                        </React.Fragment>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
