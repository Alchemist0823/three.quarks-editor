import * as React from "react";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {
    ParticleSystem,
    FunctionValueGenerator,
    ValueGenerator,
    ColorGenerator,
    FunctionColorGenerator,
    ParticleEmitter
} from "three.quarks";
import {Button} from "semantic-ui-react";
import {Object3D} from "three";

interface ParticleSystemControllerProps {
    object3d: Object3D,
    updateProperties: Function,
}

interface ParticleSystemControllerState {

}

export class ParticleSystemController extends React.PureComponent<ParticleSystemControllerProps, ParticleSystemControllerState> {
    constructor(props: Readonly<ParticleSystemControllerProps>) {
        super(props);
    }

    getSystems = () => {
        let systems: Array<ParticleSystem> = [];
        if (this.props.object3d instanceof ParticleEmitter) {
            systems.push(this.props.object3d.system);
        }
        this.props.object3d.traverse(object => {
            if (object instanceof ParticleEmitter) {
                systems.push(object.system);
            }
        });
        return systems;
    };

    checkPause = (systems: Array<ParticleSystem>) => {
        let paused = true;
        systems.forEach(system => {
            if (!system.paused) {
                paused = false;
            }
        });
        return paused;
    };

    togglePause = () => {
        let systems: Array<ParticleSystem> = this.getSystems();
        let paused = this.checkPause(systems);

        if (paused) {
            systems.forEach(system => {
                system.play();
            });
        } else {
            systems.forEach(system => {
                system.pause();
            });
        }
        this.props.updateProperties();
    };

    onRestart = () => {
        this.getSystems().forEach((system) => {
            system.restart();
        });
        this.props.updateProperties();
    };

    onStop = () => {
        this.getSystems().forEach((system) => {
            system.restart();
            system.pause();
        });
        this.props.updateProperties();
    };

    render() {
        return (
            <div>
                <Button.Group>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <Button toggle active={this.checkPause(this.getSystems())} onClick={this.togglePause}>Pause</Button>}
                    </ApplicationContextConsumer>
                    <Button onClick={this.onRestart}>Restart</Button>
                    <Button onClick={this.onStop}>Stop</Button>
                </Button.Group>
            </div>
        );
    }
}
