import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, Footer } from './components';
import { AppRoutes } from './routes';
import { useAppDispatch } from './store/hooks';
import { fetchProducts } from './store/thunks';
import { fetchCurrentUser } from './store/thunks';
import { STORAGE_KEYS } from './constants';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  // Set document title
  useDocumentTitle('Online Store');
  
  useEffect(() => {
    // Load initial data from API
    dispatch(fetchProducts({ filter: {}, page: 1 }));
    
    // Check for existing user session in localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
