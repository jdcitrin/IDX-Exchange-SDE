import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import './App.css';

// set up the page routes
function App() {
  return (
    <BrowserRouter>
      <main className="app__main">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
