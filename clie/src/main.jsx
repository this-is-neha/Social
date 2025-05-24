// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import { BrowserRouter } from 'react-router-dom';
// import Routing from './routing.config.js';
// import { Provider } from "react-redux";
// import { store } from './redux/store.js';

// import { UserProvider } from './constext/following.context.js';
// import { FollowerProvider } from './constext/followers.context.js';

// const rootElement = document.getElementById('root');
// if (!rootElement) {
//   throw new Error("Root element with id 'root' not found");
// }

// createRoot(rootElement).render(
//   <StrictMode>
    
// <Provider store={store}>
//     <UserProvider>
//       <FollowerProvider>
//         <BrowserRouter>
//           <Routing />
//         </BrowserRouter>
//       </FollowerProvider>
//     </UserProvider>
//     </Provider>
//   </StrictMode>,
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './routing.config.js';
import { Provider } from "react-redux";
import { store } from './redux/store.js';

import { UserProvider } from './constext/following.context.js';
import { FollowerProvider } from './constext/followers.context.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

createRoot(rootElement).render(
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
