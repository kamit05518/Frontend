// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx'; 
import 'aos/dist/aos.css';
import AuthProvider from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <CartProvider>
         <AuthProvider>
        <App />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>

);
