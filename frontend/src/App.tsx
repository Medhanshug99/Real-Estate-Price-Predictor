import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-stone-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/recommend" element={<RecommendationsPage />} />
            <Route
              path="/login"
              element={
                <div className="flex items-center justify-center min-h-[60vh] text-stone-500 text-sm">
                  Login page — coming next.
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
