import * as React from "react";
import {Euler, Object3D, Vector3} from "three";
import {Vector3Editor} from "./editors/Vector3Editor";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {StringInput} from "./editors/StringInput";
import {ScriptEditor} from "./editors/ScriptEditor";

interface ScriptPropertiesProps {
    object3d: Object3D,
    updateProperties: Function,
}

interface ScriptPropertiesState {

}

export class ScriptProperties extends React.PureComponent<ScriptPropertiesProps, ScriptPropertiesState> {
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
                        <div className="property">
                        <label className="script">Script:</label>
                        <ScriptEditor value={this.props.object3d.userData.script || ""} onChange={this.onChangeScript}/>
                        </div>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
