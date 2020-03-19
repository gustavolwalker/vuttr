import React from 'react';
import { ITool } from '../service/tools.service';
import { isAuthenticated } from '../service/auth';

type Props = {
    tool: ITool,
    handleRemove: (tool: ITool) => void
}

const Tool: React.FC<Props> = ({ tool, handleRemove }) => (
    <div className="card elevation1">
        <div className="pure-g">
            <div className="pure-u-21-24">
                <a href={tool.link} target="_blank" rel="noopener noreferrer">{tool.title}</a>
            </div>
            <div className="pure-u-3-24 center">
                <button type="button" className="button-xsmall pure-button" role="link" onClick={() => handleRemove(tool)} hidden={!isAuthenticated()}>X remove</button>
            </div>
        </div>
        <div className="pure-g">
            <div className="pure-u-1">
                {tool.description}
            </div>
        </div>
        <div className="pure-g">
            <div className="pure-u-1">
                <b>{tool.tags.map(tag => "#".concat(tag)).join(" ")}</b>
            </div>
        </div>
    </div >
);

export default Tool;
