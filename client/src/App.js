import './App.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirrect } from 'react-router-dom';

import Home from './pages/Home/Home';
import Room from './pages/Room/Room';
import GameBoard from './components/GameBoard/GameBoard';

const App = () => {
  // state
  const [nickname, setNickname] = useState('');
  const [isCreator, setIsCreator] = useState(false);

  return (
    <main className='app'>
      <h1 className='app__heading'>Mancala</h1>
      {/* <GameBoard players={["maggie", "jeff"]} /> */}
      <Router>
        <Switch>
          <Route exact path='/'>
              <Home 
                setNickname={setNickname} 
                setIsCreator={setIsCreator} 
              />
          </Route>
          <Route exact path='/game/:gameId'>
              <Room 
                nickname={nickname} 
                setNickname={setNickname} 
                isCreator={isCreator} 
              />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default App;
