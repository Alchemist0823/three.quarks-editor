import * as React from "react";
import MainMenu from "./MainMenu";
import {ThreejsViewport} from "./ThreejsViewport";
import PropertiesEditor from "./PropertiesEditor";

import './layout.scss';
import {ApplicationContextConsumer, ApplicationContextProvider} from "./ApplicationContext";
import {SceneGraphTreeView} from "./SceneGraphTreeView";

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
                        <ThreejsViewport width={600} height={600}/>
                    </div>
                    <div className="sidebar">
                        <SceneGraphTreeView/>
                        <ApplicationContextConsumer>
                            {context => context && context.selection.length > 0 &&
                                <PropertiesEditor object3d={context.selection[0]}/>
                            }
                        </ApplicationContextConsumer>
                    </div>
                </div>
            </div>
        </ApplicationContextProvider>);
}
