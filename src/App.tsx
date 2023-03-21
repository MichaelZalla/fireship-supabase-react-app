import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'

import useSession from './hooks/useSession';

import UserContext from './contexts/UserContext';

import AllPosts from './components/AllPosts';
import PostView from './components/PostView';
import MessageBoard from './components/MessageBoard';
import Welcome from './components/Welcome';
import NavBar from './components/NavBar';

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

  const userInfo = useSession()

  return (
    <UserContext.Provider value={userInfo}>

      <NavBar />

      <Outlet />

    </UserContext.Provider>
  )

}

export default App
