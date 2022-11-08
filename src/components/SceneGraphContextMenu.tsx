import React, {useContext} from "react";
import {CodeExporter} from "../util/CodeExporter";
import {ApplicationContext} from "./ApplicationContext";
import {Object3D} from "three";
import {ClickAwayListener, Divider, Grow, Menu, MenuItem, MenuList, Paper, Popover, Popper} from "@mui/material";
import {NestedMenuItem} from "mui-nested-menu";

interface SceneGraphContextMenuProps {
    open: boolean;
    object3d: Object3D | null;
    mouseX: number;
    mouseY: number;
    close: ()=>void;
}

export const SceneGraphContextMenu: React.FC<SceneGraphContextMenuProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const onContextMenuClick = () => console.log(props);

    const onContextMenuAddGroup = () => {
        if (props.object3d) {
            context.actions.addObject3d('group', props.object3d);
        }
        props.close();
    };

    const onContextMenuAddParticleSystem = () => {
        if (props.object3d) {
            context.actions.addObject3d('particle', props.object3d);
        }
        props.close();
    };
    const onContextMenuRemove = () => {
        if (props.object3d) {
            context.actions.removeObject3d(props.object3d);
        }
        props.close();
    };

    const onContextMenuRemoveParent = () => {
        if (props.object3d) {
            context.scene.attach(props.object3d as Object3D);
            context.updateProperties();
        }
        props.close();
    };

    const onContextMenuDuplicate = () => {
        if (props.object3d) {
            context.actions.duplicateObject3d(props.object3d);
        }
        props.close();
    };

    const onContextMenuExport = () => {
        if (props.object3d) {
            const a = document.createElement("a");
            const json = props.object3d.toJSON();
            //json.images.forEach((image: any) => image.url = "http://localhost:3000/textures/texture1.png");
            const file = new Blob([JSON.stringify(json)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "scene.json";
            a.click();
        }
        props.close();
    };

    /*const onContextMenuCopyCode = ({event, props: contextProps}: MenuItemEventHandler) => {
        if (props.object3d) {
            setCode(CodeExporter.exportCode(props.object3d));
        }
    }*/

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            props.close();
        } else if (event.key === 'Escape') {
            props.close();
        }
    }

    let handler = -1;
    const delayedClose = () => {
        if (handler === -1) {
            handler = window.setTimeout(() => props.close(), 200);
            console.log("close");
        }
    }

    const cancelClose = () => {
        if (handler !== -1) {
            window.clearTimeout(handler);
            handler = -1;
            console.log("cancel");
        }
    }

    return <Popover
            open={props.open}
            anchorReference="anchorPosition"
            anchorPosition={
                props.open
                    ? { top: props.mouseY, left: props.mouseX }
                    : undefined
            }
            role={undefined}
            disablePortal
        >
            <Paper onMouseLeave={delayedClose} onMouseEnter={cancelClose}>
                <ClickAwayListener onClickAway={props.close}>
                    <MenuList
                        autoFocusItem={props.open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                    >
                        <NestedMenuItem
                            label={"Add"}
                            parentMenuOpen={props.open}
                            nonce={undefined}>
                            <MenuItem onClick={onContextMenuAddGroup}>Group</MenuItem>
                            <MenuItem onClick={onContextMenuAddParticleSystem}>Particle System</MenuItem>
                        </NestedMenuItem>
                        <Divider/>
                        <MenuItem onClick={onContextMenuDuplicate}>Duplicate</MenuItem>
                        <MenuItem onClick={onContextMenuRemove}>Remove</MenuItem>
                        <MenuItem onClick={onContextMenuRemoveParent}>Remove Parent</MenuItem>
                        <Divider/>
                        <MenuItem onClick={onContextMenuExport}>Export</MenuItem>
                    </MenuList>
                </ClickAwayListener>
            </Paper>
        </Popover>;
}
