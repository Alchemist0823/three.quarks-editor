import React from "react";
import {AppContext, ApplicationContextConsumer} from "./ApplicationContext";
import {Object3D, Scene} from "three";
import {ParticleSystem} from "three.quarks";
import {ParticleEmitter} from "three.quarks";
import './SceneGraphView.scss';
import {Item, Menu, MenuProvider, Separator, Submenu} from "react-contexify";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import 'react-contexify/dist/ReactContexify.min.css';

interface SceneGraphItemViewProps {
    selected: boolean;
    object3d: Object3D;
    onClick: (a: React.MouseEvent) => void;
    indent: number;
}

const SceneGraphItemView: React.FC<SceneGraphItemViewProps> = (props) => {

    const getObjectName = (object3d: Object3D) => {
        let type = 'object';
        if (object3d instanceof ParticleEmitter) {
            type = 'ParticleSystem';
        } else {
            type =  object3d.type;
        }
        let name = 'unnamed';
        if (object3d.name) {
            name = object3d.name;
        }
        return `[${type}] ${name}`;
    };

    let className = 'item';
    if (props.selected) {
        className += ' selected';
    }

    return <MenuProvider id="scene-graph-menu" data={{object3d: props.object3d}}>
        <li className={className} onClick={props.onClick} style={{marginLeft: props.indent + 'em'}}>
        {getObjectName(props.object3d)}
        </li>
    </MenuProvider>;
};

interface SceneGraphViewProps {
    context: AppContext
    scene: Scene;
}

interface SceneGraphViewState {
    openedIndex: Array<number>
}

export class SceneGraphView extends React.Component<SceneGraphViewProps, SceneGraphViewState> {

    shouldComponentUpdate(nextProps: Readonly<SceneGraphViewProps>, nextState: Readonly<SceneGraphViewState>, nextContext: any): boolean {
        //TODO
        return true;
    }

    constructor(props: Readonly<SceneGraphViewProps>) {
        super(props);
        this.state = {
            openedIndex: [0]
        }
    }

    renderObject(context: AppContext, object3d: THREE.Object3D, index: number, indent: number): [React.ReactNodeArray, number] {
        let items = [];
        items.push(
            <SceneGraphItemView key={object3d.uuid} onClick={()=>this.onClick(context, object3d)} object3d={object3d} selected={context.selection.indexOf(object3d) !== -1} indent={indent}>
            </SceneGraphItemView>);
        index ++;
        for (let child of object3d.children) {
            const result = this.renderObject(context, child, index, indent + 1);
            items.push(result[0]);
            index = result[1];
        }
        return ([items, index]);
    }

    onContextMenuClick = ({event, props}: MenuItemEventHandler) => console.log(event,props);

    onContextMenuAddParticleSystem = ({event, props}: MenuItemEventHandler) => {
        if ((props! as any).object3d) {
            this.props.context.actions.addObject3d('particle', (props! as any).object3d);
        }
    };
    onContextMenuRemove = ({event, props}: MenuItemEventHandler) => {
        if ((props! as any).object3d) {
            this.props.context.actions.removeObject3d((props! as any).object3d);
        }
    };

    onContextMenuExport = ({event, props}: MenuItemEventHandler) => {
        if ((props! as any).object3d) {
            const a = document.createElement("a");
            const json = (props! as any).object3d.toJSON();
            //json.images.forEach((image: any) => image.url = "http://localhost:3000/textures/texture1.png");
            const file = new Blob([JSON.stringify(json)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "scene.json";
            a.click();
        }
    };

    renderScene(context: AppContext, scene: THREE.Scene) {
        return <ul> {this.renderObject(context, scene, 0, 0)[0]} </ul>;
    }

    render() {
        return <div>.
            {this.renderScene(this.props.context, this.props.scene)}
            <Menu id="scene-graph-menu">
                <Submenu label="Add">
                    <Item onClick={this.onContextMenuAddParticleSystem}>Particle System</Item>
                    <Item onClick={this.onContextMenuClick}>Ball</Item>
                </Submenu>
                <Separator />
                <Item onClick={this.onContextMenuRemove}>Remove</Item>
                <Separator />
                <Item onClick={this.onContextMenuExport}>Export</Item>
                <Item disabled>Dolor</Item>
            </Menu>
        </div>;
    }

    onClick = (context: AppContext, object3d: Object3D) => {
        //if (object3d.children.length === 0)
        context.actions.select(object3d);
    };
}
