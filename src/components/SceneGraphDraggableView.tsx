import {SetStateAction, useState} from "react";
import {Tree} from "@minoru/react-dnd-treeview";

interface SceneGraphDraggableViewProps {

}

export const SceneGraphDraggableView: React.FC<SceneGraphDraggableViewProps> = (props) => {
    const [treeData, setTreeData] = useState([]);
    const handleDrop = (newTreeData: SetStateAction<any>) => setTreeData(newTreeData);

    return <Tree
        tree={treeData}
        rootId={0}
        onDrop={handleDrop}
        render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginLeft: depth * 10 }}>
                {node.droppable && (
                    <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
                )}
                {node.text}
            </div>
        )}
    />;
}


