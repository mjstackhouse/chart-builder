import React from 'react';
import ReactDOM from 'react-dom/client';
import { EnsureKontentAsParent } from "./customElement/EnsureKontentAsParent";
import { CustomElementContext } from './customElement/CustomElementContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ChooseChartType from './routes/choose-chart-type';
import BarChartConfigure from './routes/bar-chart/bar-chart-configure';
import BarChartInputs from './routes/bar-chart/bar-chart-inputs';
import './index.css';
import Home from './routes/home';
import PieChartConfigure from './routes/pie-chart/pie-chart-configure';
import PieChartInputs from './routes/pie-chart/pie-chart-inputs';
import ChartPreview from './routes/chart-preview';
import LineChartInputs from './routes/line-chart/line-chart-inputs';
import LineChartConfigure from './routes/line-chart/line-chart-configure';
import ErrorBoundary from './error-boundary';

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
        path: 'type/bar/configure',
        element: <BarChartConfigure />,
      },
      {
        path: 'type/bar/inputs',
        element: <BarChartInputs />,
      },
      {
        path: 'type/pie/configure',
        element: <PieChartConfigure />,
      },
      {
        path: 'type/pie/inputs',
        element: <PieChartInputs />,
      },
      {
        path: 'type/line/inputs',
        element: <LineChartInputs />,
      },
      {
        path: 'type/line/configure',
        element: <LineChartConfigure />,
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
