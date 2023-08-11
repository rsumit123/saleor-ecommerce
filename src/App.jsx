import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import apolloClient from './apollo';
import ProductList from './components/ProductList/ProductList';
import CartPage from './components/CartPage/CartPage';
import Checkout from './components/Checkout/Checkout';
import PaymentStatus from './components/PaymentStatus/PaymentStatus';


function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
