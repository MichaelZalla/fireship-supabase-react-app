import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'

import AllPosts from './AllPosts';
import PostView from './PostView';
import MessageBoard from './MessageBoard';
import Welcome from './Welcome';
import NavBar from './NavBar';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <MessageBoard />,
        children: [
          {
            path: ':pageNumber',
            element: <AllPosts />,
          },
          {
            path: 'post/:postId',
            element: <PostView />,
          },
        ],
      },
      {
        path: 'welcome',
        element: <Welcome />,
        // loader: welcomeLoader,
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default App
