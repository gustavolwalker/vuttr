import React, { useState, useEffect } from 'react';
import { isAuthenticated } from './service/auth';
import { ToolsService, ITool } from './service/tools.service';

import './App.css';
import './Modal.css';
import Header from './components/header';
import Tool from "./components/tool";
import Alert from './components/alert';

const App: React.FC = () => {
  const [service] = useState(new ToolsService());
  const [tools, setTools] = useState<ITool[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    service.getAll()
      .then(results => {
        console.log('teste');
        setError(undefined);
        setTools(results.data)
      }).catch(() => {
        setError("Server unavalible, please check your network connections.");
      });
  }, [service]);

  const handleAdd = () => {
    alert('adicionar')
  }

  const handleRemove = (tool: ITool) => {
    if (window.confirm(`Are you sure you want to remove ${tool.title} ?`))
      service.remove(tool.id)
        .then(() => setTools(tools.filter(fTool => fTool.id !== tool.id)))
        .catch(err => alert(err.message))
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
                <button type="button" className="pure-button pure-button-primary" onClick={handleAdd} hidden={!isAuthenticated()}>+ Add</button>
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
    </>
  );
};

export default App;
