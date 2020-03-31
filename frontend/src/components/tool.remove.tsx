import React, { useContext, useState } from 'react';
import { ITool, ToolsService } from '../services/tools.service';
import { AppContext } from '../store';

type Props = {
    tool?: ITool,
}

const ToolRemove: React.FC<Props> = ({ tool }) => {
    const [service] = useState(new ToolsService());
    const { state, dispatch } = useContext(AppContext);

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (tool && tool.id) {
            await service.remove(tool!.id)
                .then(() => dispatch({ type: 'tools', values: state.tools.filter(value => value.id !== tool.id) })
                ).catch(err => dispatch({ type: 'error', error: err.message }));
            $('#toolRemove').modal('hide');
        }
    }

    return (
        <div id="toolRemove" className="modal fade hide" role="dialog" aria-labelledby="toolRemoveLabel" aria-hidden="true">
            <div className="modal-body">
                <h3 id="toolRemoveLabel">X Remove tool</h3>
                <form className="pure-form pure-form-stacked">
                    <fieldset>
                        <div className="pure-g">
                            <div className="pure-u-1">
                                Are you sure you want to remove {tool?.title}?
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1 rigth">
                                <button id="toolBack" role="link" className="pure-button pure-button-primary" data-dismiss="modal" aria-hidden="true">Cancel</button>
                                <button onClick={handleConfirm} className="pure-button pure-button-primary">Yes, remove</button><br />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
};


export default ToolRemove;
