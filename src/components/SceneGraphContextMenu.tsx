import {Item, Menu, Separator, Submenu} from "react-contexify";
import React, {useContext} from "react";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {CodeExporter} from "../util/CodeExporter";
import {ApplicationContext} from "./ApplicationContext";

interface SceneGraphContextMenuProps {

}

export const SceneGraphContextMenu: React.FC<SceneGraphContextMenuProps> = (props) => {
    const context = useContext(ApplicationContext)!;

    const onContextMenuClick = ({event, props}: MenuItemEventHandler) => console.log(event,props);

    const onContextMenuAddParticleSystem = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            context.actions.addObject3d('particle', (contextProps! as any).object3d);
        }
    };
    const onContextMenuRemove = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            context.actions.removeObject3d((contextProps! as any).object3d);
        }
    };

    const onContextMenuDuplicate = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps as any).object3d) {
            context.actions.duplicateObject3d((contextProps! as any).object3d);
        }
    };

    const onContextMenuExport = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps! as any).object3d) {
            const a = document.createElement("a");
            const json = (contextProps! as any).object3d.toJSON();
            //json.images.forEach((image: any) => image.url = "http://localhost:3000/textures/texture1.png");
            const file = new Blob([JSON.stringify(json)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "scene.json";
            a.click();
        }
    };

    /*const onContextMenuCopyCode = ({event, props: contextProps}: MenuItemEventHandler) => {
        if ((contextProps! as any).object3d) {
            setCode(CodeExporter.exportCode((contextProps! as any).object3d));
        }
    }*/

    return <Menu id="scene-graph-menu">
        <Submenu label="Add">
            <Item onClick={onContextMenuAddParticleSystem}>Particle System</Item>
            <Item onClick={onContextMenuClick}>Ball</Item>
        </Submenu>
        <Separator />
        <Item onClick={onContextMenuDuplicate}>Duplicate</Item>
        <Item onClick={onContextMenuRemove}>Remove</Item>
        <Separator />
        <Item onClick={onContextMenuExport}>Export</Item>
    </Menu>;
}
