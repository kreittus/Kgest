import { createContext, useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Login } from './pages/Login';
import { Home } from './pages/Home';


import './styles/global.scss';

export const userContext = createContext({});

function App() {
  const [userLogin, setUserLogin] = useState([]);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#212121",
      }
    },
    overrides: {
      MuiAutocomplete: {
        option: {
          '&[data-focus="true"]': {
            backgroundColor: '#dbdbdb',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <userContext.Provider value={{ userLogin, setUserLogin }}>
            <Route path="/" exact component={Login} />
            <Route path="/home" component={Home} />
          </userContext.Provider>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
