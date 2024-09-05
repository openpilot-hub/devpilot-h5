import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './app.less';

const router = createBrowserRouter([]);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
