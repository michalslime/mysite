import logo from './logo.svg';
import './App.css';
import BinanceComponent from './components/binance-component';
import RefillComponent from './components/refill-component';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App cards-container">
      <Routes>
          <Route path='/' element={<BinanceComponent />} />
          <Route path='/refill' element={<RefillComponent />} />    
        </Routes>
    </div>
  );
}

export default App;
