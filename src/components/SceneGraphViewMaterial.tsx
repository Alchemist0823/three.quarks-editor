import React from "react";
import {AppContext, ApplicationContextConsumer} from "./ApplicationContext";
import {Object3D, Scene} from "three";
import {ParticleSystem} from "three.quarks";
import {ParticleEmitter} from "three.quarks";
import './SceneGraphView.scss';
import {Item, Menu, MenuProvider, Separator, Submenu} from "react-contexify";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import 'react-contexify/dist/ReactContexify.min.css';
import {TreeView} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {makeStyles, createStyles} from "@material-ui/core";
import TreeItem from "@material-ui/lab/TreeItem";
import {Theme, Typography} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 240,
            flexGrow: 1,
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

/*
interface SceneGraphItemViewProps {
    selected: boolean;
    object3d: Object3D;
    onClick: (a: React.MouseEvent) => void;
    indent: number;
}*/
/*
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
};*/

interface SceneGraphViewMaterialProps {
    context: AppContext
    scene: Scene;
}

export function SceneGraphViewMaterial(props: SceneGraphViewMaterialProps) {
    const classes = useStyles();

    const [selected, setSelected] = React.useState<string[]>([]);

    const countIndex = (index: number, object3d: Object3D): Object3D | null => {
        if (index == 0)
            return object3d;
        index --;
        for (let child of object3d.children) {
            let res = countIndex(index, child);
            if (res)
                return res;
            index --;
        }
        return null;
    }
    const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        if (nodeIds.length > 0) {
            let index = parseInt(nodeIds[0]);
            let object3d = countIndex(index, props.scene);
            if (object3d)
                props.context.actions.select(object3d);
        }
        setSelected(nodeIds);
    };

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

    const renderObject = (context: AppContext, object3d: THREE.Object3D, index: number): [React.ReactNode, number] => {
        let items = [];

        let originIndex = index;
        index ++;
        for (let child of object3d.children) {
            const result = renderObject(context, child, index);
            items.push(result[0]);
            index = result[1];
        }
        //selected={context.selection.indexOf(object3d) !== -1}
        return  [<TreeItem key={object3d.uuid} nodeId={"" + originIndex} label={getObjectName(object3d)} >
            {items}
        </TreeItem>, index];
    }

    const onContextMenuClick = ({event, props}: MenuItemEventHandler) => console.log(event,props);

    const onContextMenuAddParticleSystem = ({event, props: sceneObj}: MenuItemEventHandler) => {
        if ((sceneObj as any).object3d) {
            props.context.actions.addObject3d('particle', (props! as any).object3d);
        }
    };
    const onContextMenuRemove = ({event, props: sceneObj}: MenuItemEventHandler) => {
        if ((sceneObj as any).object3d) {
            props.context.actions.removeObject3d((props! as any).object3d);
        }
    };

    const onContextMenuExport = ({event, props: sceneObj}: MenuItemEventHandler) => {
        if ((sceneObj! as any).object3d) {
            const a = document.createElement("a");
            const json = (props! as any).object3d.toJSON();
            //json.images.forEach((image: any) => image.url = "http://localhost:3000/textures/texture1.png");
            const file = new Blob([JSON.stringify(json)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "scene.json";
            a.click();
        }
    };

    const renderScene = (context: AppContext, scene: THREE.Scene) => {
        return <TreeView
            className={classes.root}
            selected={selected}
            onNodeSelect={handleSelect}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderObject(context, scene, 0)[0]}
        </TreeView>;
    }

    return <div>
        <Typography className={classes.heading}> Scene Graph </Typography>
        {renderScene(props.context, props.scene)}
        <Menu id="scene-graph-menu">
            <Submenu label="Add">
                <Item onClick={onContextMenuAddParticleSystem}>Particle System</Item>
                <Item onClick={onContextMenuClick}>Ball</Item>
            </Submenu>
            <Separator />
            <Item onClick={onContextMenuRemove}>Remove</Item>
            <Separator />
            <Item onClick={onContextMenuExport}>Export</Item>
            <Item disabled>Dolor</Item>
        </Menu>
    </div>;
}
