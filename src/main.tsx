import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RestaurantApp from './App.tsx'

const rootDomElement = document.getElementById('root');

if (rootDomElement) {
  const reactRootInstance = createRoot(rootDomElement);
  reactRootInstance.render(
    <StrictMode>
      <RestaurantApp />
    </StrictMode>
  );
}

