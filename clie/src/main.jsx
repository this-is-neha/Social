import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './routing.config.js';
import { Provider } from "react-redux";
import {store} from '../src/redux/store.js';
import { UserProvider } from './constext/following.context.js';
import { FollowerProvider } from './constext/followers.context.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
<Provider store={store}>
    <UserProvider>
      <FollowerProvider>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </FollowerProvider>
    </UserProvider>
    </Provider>
  </StrictMode>,
);
