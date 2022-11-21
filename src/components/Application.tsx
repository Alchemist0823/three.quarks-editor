import * as React from "react";
import MainMenu from "./MainMenu";
import {ThreejsViewport} from "./ThreejsViewport";
import PropertiesEditor from "./PropertiesEditor";
import './layout.scss';
import {ApplicationContextConsumer, ApplicationContextProvider} from "./ApplicationContext";
import {SceneGraphDraggableView} from "./SceneGraphDraggableView";
import {BezierCurveDialog} from "./editors/BezierCurveDialog";
import {NodeGraphDialog} from "./nodes/NodeGraphDialog";

export interface ApplicationProps {

}

export const Application: React.FC<ApplicationProps> = (props) => {

    return (
        <ApplicationContextProvider>
            <div className="application">
                <div className="main-menu">
                    <ApplicationContextConsumer>
                        {context => context &&
                            <MainMenu onSaveAs={context.actions.onSaveAs}
                                      onImport={context.actions.onImport}
                                      onOpenDemo={context.actions.onOpenDemo}/>
                        }
                    </ApplicationContextConsumer>
                </div>
                <div className="main">
                    <div className="viewport">
                        <ThreejsViewport/>
                    </div>
                    <div className="sidebar">
                        <SceneGraphDraggableView/>
                        <ApplicationContextConsumer>
                            {context => context && context.selection.length > 0 &&
                                <PropertiesEditor object3d={context.selection[0]}/>
                            }
                        </ApplicationContextConsumer>
                    </div>
                    <BezierCurveDialog/>
                    <NodeGraphDialog/>
                </div>
            </div>
        </ApplicationContextProvider>);
}
