import React, {useCallback, useContext} from "react";
import {ApplicationContext} from "../ApplicationContext";
import {Modal} from "@mui/material";
import NodeGraphEditor from "./NodeGraphEditor";
import {Node, NodeGraph, NodeTypes, Wire} from "three.quarks";

interface NodeGraphDialogProps {
}

export const NodeGraphDialog: React.FC<NodeGraphDialogProps> = (props) => {

    const context = useContext(ApplicationContext)!;

    const onClose = useCallback(() => {
    }, []);

    const graph = new NodeGraph("test");
    const result = new Node(NodeTypes['mul']);
    const input1 = new Node(NodeTypes['add']);
    const input2 = new Node(NodeTypes['add']);
    const output = new Node(NodeTypes['output']);
    input1.inputs[0] = { getValue: () => 1 };
    input1.inputs[1] = { getValue: () => 2 };
    input2.inputs[0] = { getValue: () => 1 };
    input2.inputs[1] = { getValue: () => 2 };
    graph.addNode(result);
    graph.addNode(input1);
    graph.addNode(input2);
    graph.addNode(output);
    graph.addWire(new Wire(input1, 0, result, 0));
    graph.addWire(new Wire(input2, 0, result, 1));
    //result.inputs[1] = { getValue: () => 3 };
    graph.addWire(new Wire(result, 0, output, 0));


    return (
        <div>
            <Modal
                open={false}
                onClose={onClose}
                //maxWidth={false}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                    <NodeGraphEditor nodeGraph={graph}/>
            </Modal>
        </div>
    );
}
