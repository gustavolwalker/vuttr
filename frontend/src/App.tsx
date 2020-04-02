import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import Alert from './components/alert';
import Header from './components/header';
import Tool from "./components/tool";
import ToolForm from './components/tool.form';
import ToolRemove from './components/tool.remove';
import './Modal.css';
import { ITool, ToolsService } from './services/tools.service';
import { AppContext, AppReducer, initialState } from './store';
import useDebounce from './utils/debouce';

const App: React.FC = () => {
  const [tool, setTool] = useState<ITool>();
  const [service] = useState(new ToolsService());
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [searchTool, setSearchTool] = useState('');
  const [searchOnlyTag, setSearchOnlyTag] = useState(false);
  const debouncedSearchTool = useDebounce(searchTool, 500);

  useEffect(() => {
    service.getAll(debouncedSearchTool, searchOnlyTag)
      .then(results => {
        dispatch({ type: 'tools', values: results.data });
      }).catch(() => {
        dispatch({ type: 'error', error: 'Server unavalible, please check your network connections.' });
      });
  }, [debouncedSearchTool, searchOnlyTag, service]);

  const handleRemove = (tool: ITool) => {
    if (tool && tool.id) {
      setTool(tool);
      $('#toolRemove').modal('show');
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch }} >
      <Header />
      <div className="content">
        <div className="pure-g">
          <h3>Very Usuful Tools to Remember</h3>
        </div>
        <form className="pure-form pure-form-staked">
          <fieldset>
            <div className="pure-g">
              <div className="pure-u-21-24">
                <input id="search" type="search" onChange={e => setSearchTool(e.target.value)} placeholder="search" />
                <label htmlFor="onlyTags">
                  <input id="onlyTags" type="checkbox" onChange={e => setSearchOnlyTag(e.target.checked)} /> search in tags only
              </label>
              </div>
              <div className="pure-u-3-24" style={{ textAlign: "right" }}>
                <a href="#tool" className="pure-button pure-button-primary" hidden={!state.isLogged} data-toggle="modal">+ Add</a>
              </div>
            </div>
          </fieldset>
        </form>
        <div className="pure-g">
          <div className="pure-u-1">
            <Alert message={state.error} type="error" />
            {state.tools && state.tools.map(tool =>
              <Tool key={tool.id} tool={tool} handleRemove={handleRemove} />
            )}
            {!state.tools.length && <span>No results found.</span>}
          </div>
        </div>
      </div>
      <ToolForm />
      <ToolRemove tool={tool} />
    </AppContext.Provider>
  );
};

export default App;
