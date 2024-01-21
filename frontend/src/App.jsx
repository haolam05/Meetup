import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import * as sessionActions from './store/session';
import List from './components/List/List';
import Error from './components/Error';
import GroupDetails from './components/GroupDetails';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadUser();
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <>
      <Layout />
      <Error title="Something went wrong" message="Please do not abuse the system or use the url to navigate the application!" />
    </>,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: 'groups',
        element: <List list="Groups" />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetails />
      },
      {
        path: '*',
        element: <Error title="Page not found" />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
