import { AxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { ITool, ToolsService } from '../services/tools.service';
import { IValidate } from '../services/validate.service';
import Alert from './alert';

const ToolForm: React.FC = () => {
    const [service] = useState(new ToolsService());
    const [title, setTitle] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);

    const [error, setError] = useState<string>();
    const [inputErrors, setInputErrors] = useState<IValidate[]>();
    const toolForm = useRef<HTMLFormElement>(null);

    useEffect(() => {
        toolForm.current?.reset();
    }, []);

    const handleTags = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = ev.target;
            setTags(value.replace(", ", " ").replace(",", "").split(" "));        
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const tool: ITool = {
            title,
            link,
            description,
            tags
        }
        console.log(tool)        
        await service.create(tool)
            .then(response => {
                if (response.status === 201) {
                    toolForm.current?.reset();
                    $('#tool').modal('hide');
                }
            }).catch((err: AxiosError) => {
                if (err.response && err.response.status === 400) {
                    console.log(err.response.data)
                    setInputErrors(err.response.data);
                } else {
                    setError("Server error or unavalible.")
                }
            });
    }

    return (
        <div id="tool" className="modal fade hide" role="dialog" aria-labelledby="toolLabel" aria-hidden="true">
            <div className="modal-body">
                <h3 id="toolLabel">+ Add new tool</h3>
                <form ref={toolForm} className="pure-form pure-form-stacked">
                    <fieldset>
                        <Alert message={error} type="error" />
                        <div className="pure-g">
                            <div className="pure-u-1">
                                <label htmlFor="title">Tool Name *</label>
                                <input id="title" name="title" type="text" placeholder="Required..." onChange={e => setTitle(e.target.value)} required className="pure-u-1" />
                                {inputErrors && inputErrors.map(erro =>
                                    (erro.property === "title" &&
                                        Object.values(erro.constraints).map((value) => (
                                            <div className="pure-u-1 rigth"><div className="pure-u-1 rigth"><small className="error">{value}</small></div></div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1">
                                <label htmlFor="link">Tool Link *</label>
                                <input id="link" name="link" type="text" placeholder="Required..." onChange={e => setLink(e.target.value)} required className="pure-u-1" />
                                {inputErrors && inputErrors.map(erro =>
                                    (erro.property === "link" &&
                                        Object.values(erro.constraints).map((value) => (
                                            <div className="pure-u-1 rigth"><small className="error">{value}</small></div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1">
                                <label htmlFor="description">Tool description *</label>
                                <textarea id="description" name="description" onChange={e => setDescription(e.target.value)} required className="pure-u-1" />
                                {inputErrors && inputErrors.map(erro =>
                                    (erro.property === "description" &&
                                        Object.values(erro.constraints).map((value) => (
                                            <div className="pure-u-1 rigth"><small className="error">{value}</small></div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1">
                                <label htmlFor="tags">Tags</label>
                                <input id="tags" name="tags" type="text" placeholder="Required..." onChange={handleTags} required className="pure-u-1" />
                                {inputErrors && inputErrors.map(erro =>
                                    (erro.property === "tags" &&
                                        Object.values(erro.constraints).map((value) => (
                                            <div className="pure-u-1 rigth"><small className="error">{value}</small></div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pure-g">
                            <div className="pure-u-1 rigth">
                                <button onClick={handleSubmit} className="pure-button pure-button-primary">Add tool</button><br />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
};


export default ToolForm;
