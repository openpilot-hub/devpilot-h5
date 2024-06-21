import './app.less';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
]);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
