import './App.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirrect } from 'react-router-dom';

import Home from './pages/Home/Home';
import Room from './pages/Room/Room';
import GameBoard from './components/GameBoard/GameBoard';

const App = () => {
  // state
  const [username, setUsername] = useState('');

  return (
    <main className='app'>
      <h1 className='app__heading'>Mancala</h1>
      <GameBoard players={["maggie", "jeff"]} />
      <Router>
        <Switch>
          <Route exact path='/'>
              <Home setUsername={setUsername} />
          </Route>
          <Route exact path='/game/:gameId'>
              <Room username={username} setUsername={setUsername} />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default App;
