import React, { memo } from 'react';
import {Handle, Node, Position, useReactFlow, useStoreApi} from 'reactflow';
import {ConstInput, Node as GraphNode, NodeGraph, Wire} from 'three.quarks';

/*
function Select({ value, handleId, nodeId }) {
    const { setNodes } = useReactFlow();
    const store = useStoreApi();

    const onChange = (evt) => {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        selects: {
                            ...node.data.selects,
                            [handleId]: evt.target.value,
                        },
                    };
                }

                return node;
            })
        );
    };

    return (
        <div className="custom-node__select">
            <div>Edge Type</div>
            <select className="nodrag" onChange={onChange} value={value}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Handle type="source" position="right" id={handleId} />
        </div>
    );
}*/


const CustomNode: React.FC<{data: GraphNode}> = (props) => {

    const handleCount = Math.max(props.data.type.inputTypes.length, props.data.type.outputTypes.length);

    return (
        <>
            <div className={"left-handles"}>
                {props.data.type.inputTypes.map(
                    (type, i) =>
                        <div className="handle-holder">
                            <Handle
                                id={"handle-t" + i}
                                type="target"
                                position={Position.Left}
                                style={{background: '#555'/*, top: (i + 1) / (handleCount + 1) * 100 + "%"*/}}
                                onConnect={(params) => console.log('handle onConnect', params)}
                                isConnectable={true}
                            />
                            {!(props.data.inputs[i] instanceof Wire) && <div className={"default-value"}>
                                {(props.data.inputs[i] as ConstInput).getValue({inputs: [], outputs: []})}
                            </div>}
                        </div>
                )}
            </div>
            <div className={"custom-body"}>
                <strong>{props.data.type.name}</strong>
            </div>
            <div className={"right-handles"}>
            {props.data.type.outputTypes.map(
                (type, i) =>
                    <div className="handle-holder">
                        <Handle
                            id={"handle-s" + i}
                            type="source"
                            position={Position.Right}
                            style={{background: '#555'/*, top: (i + 1) / (handleCount + 1) * 100 + "%"*/}}
                            onConnect={(params) => console.log('handle onConnect', params)}
                            isConnectable={true}
                        />
                    </div>
            )}
            </div>
        </>
    );
}

export default memo(CustomNode);
