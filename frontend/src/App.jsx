import { Modal } from './context/Modal';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import * as sessionActions from './store/session';
import List from './components/List/List';
import Error from './components/Error';
import GroupDetails from './components/GroupDetails';
import EventDetails from './components/EventDetails';
import CreateGroup from './components/CreateGroup';
import EditGroup from './components/EditGroup';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';

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
      <Modal />
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
        path: 'groups/current',
        element: <List list="Manage Groups" title="Your groups" />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetails />
      },
      {
        path: 'groups/new',
        element: <CreateGroup />
      },
      {
        path: 'groups/:groupId/edit',
        element: <EditGroup />
      },
      {
        path: 'groups/:groupId/events/new',
        element: <CreateEvent />
      },
      {
        path: 'events',
        element: <List list="Events" />
      },
      {
        path: 'events/current',
        element: <List list="Manage Events" title="Your events" />
      },
      {
        path: 'events/:eventId',
        element: <EventDetails />
      },
      {
        path: 'events/:eventId/edit',
        element: <EditEvent />
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
