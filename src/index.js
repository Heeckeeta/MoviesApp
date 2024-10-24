import './index.css';

import ReactDOM from 'react-dom/client';
import { Alert } from 'antd';
import { Online, Offline } from 'react-detect-offline';

import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Online>
      <App />
    </Online>
    <Offline>
      <Alert type="error" message="Turn on the internet" className="alert" />
    </Offline>
  </>
);
