import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from './hooks';
import { Link, Router } from 'react-router-dom';
import * as H from 'history';

interface Props {
    history: H.History;
}

const App: React.FC<Props> = ({ history }) => {
    const count = useSelector(state => state.test.count);
    const dispatch = useDispatch();
    useEffect(() => {
        /**
         * 相当于：
         *
         * dispatch({
         *     type: 'test/initCount',
         *     payload: [],
         * });
         *
         * 也相当于
         * // import actions from './actions';
         * dispatch(
         *     actions.test.initCount()
         * );
         */
        dispatch.test.initCount();
        return () => {};
    }, []);
    return (
        <Router history={history}>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    count: {count}
                    <button onClick={() => dispatch.test.addCount()}>add</button>
                    <Link to={'/test/121'}>
                        <button>change route</button>
                    </Link>
                    <Link to={'/test'}>
                        <button>test</button>
                    </Link>
                </header>
            </div>
        </Router>
    );
};

export default App;
