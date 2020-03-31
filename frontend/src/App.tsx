import React, { useEffect, useState } from 'react';
import './App.css';
import Alert from './components/alert';
import Header from './components/header';
import Tool from "./components/tool";
import ToolForm from './components/tool.form';
import './Modal.css';
import { isAuthenticated } from './services/auth';
import { ITool, ToolsService } from './services/tools.service';
import ToolRemove from './components/tool.remove';

const App: React.FC = () => {
  const [tool, setTool] = useState<ITool>();
  const [service] = useState(new ToolsService());
  const [tools, setTools] = useState<ITool[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    service.getAll()
      .then(results => {
        setError(undefined);
        setTools(results.data)
      }).catch(() => {
        setError("Server unavalible, please check your network connections.");
      });
  }, [service]);

  const handleRemove = (tool: ITool) => {
    if (tool && tool.id) {
      setTool(tool);
      $('#toolRemove').modal('show');
    }
  }

  return (
    <>
      <Header />
      <div className="content">
        <div className="pure-g">
          <h3>Very Usuful Tools to Remember</h3>
        </div>
        <form className="pure-form pure-form-staked">
          <fieldset>
            <div className="pure-g">
              <div className="pure-u-21-24">
                <input id="search" type="search" placeholder="search" />
                <label htmlFor="onlyTags">
                  <input id="onlyTags" type="checkbox" /> search in tags only
              </label>
              </div>
              <div className="pure-u-3-24" style={{ textAlign: "right" }}>
                <a href="#tool" className="pure-button pure-button-primary" hidden={!isAuthenticated()} data-toggle="modal">+ Add</a>
              </div>
            </div>
          </fieldset>
        </form>
        <div className="pure-g">
          <div className="pure-u-1">
            <Alert message={error} type="error" />
            {tools && tools.map(tool =>
              <Tool key={tool.id} tool={tool} handleRemove={handleRemove} />
            )}
          </div>
        </div>
      </div>
      <ToolForm />
      <ToolRemove tool={tool} />
    </>
  );
};

export default App;
