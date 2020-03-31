import React, { useState, useRef, useEffect } from 'react';
import { ITool } from '../services/tools.service';
import api from '../services/api';
import { AxiosError } from 'axios';
import Alert from './alert';
import { IValidate } from '../services/validate.service';

const ToolForm: React.FC = () => {
    const [tool, setTool] = useState<ITool | Object>();
    const [error, setError] = useState<string>();
    const [inputErrors, setInputErrors] = useState<IValidate[]>();
    const toolForm = useRef<HTMLFormElement>(null);

    useEffect(() => {
        toolForm.current?.reset();
    }, []);

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = ev.target;
        if (name !== "tags")
            setTool((tool) => ({ ...tool, [name]: value }));
        else {
            setTool((tool) => ({ ...tool, tags: value.replace(", ", " ").replace(",", "").split(" ") }));
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        console.log(tool)
        await api.post("/tools", { ...tool })
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
                                <input id="title" name="title" type="text" placeholder="Required..." onChange={handleChange} required className="pure-u-1" />
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
                                <input id="link" name="link" type="text" placeholder="Required..." onChange={handleChange} required className="pure-u-1" />
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
                                <textarea id="description" name="description" onChange={handleChange} required className="pure-u-1" />
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
                                <input id="tags" name="tags" type="text" placeholder="Required..." onChange={handleChange} required className="pure-u-1" />
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
