import React from 'react';
import ReactDOM from 'react-dom/client';
import { EnsureKontentAsParent } from "./customElement/EnsureKontentAsParent";
import { CustomElementContext } from './customElement/CustomElementContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ChooseChartType from './routes/choose-chart-type';
import './index.css';
import Home from './routes/home';
import ChartPreview from './routes/chart-preview';
import ErrorBoundary from './error-boundary';
import ChartConfigure from './routes/chart-configure';
import ChartInputs from './routes/chart-inputs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'type',
        element: <ChooseChartType />,
      },
      {
        path: 'type/:chartType/configure',
        element: <ChartConfigure />
      },
      {
        path: 'type/:chartType/inputs',
        element: <ChartInputs />
      },
      {
        path: 'type/:chartType/preview',
        element: <ChartPreview />
      },
    ]
  }
])

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Cannot find the root element. Please, check your html.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <EnsureKontentAsParent>
      <CustomElementContext height={600}>
        <RouterProvider router={router} />
      </CustomElementContext>
    </EnsureKontentAsParent>
  </React.StrictMode>
);
