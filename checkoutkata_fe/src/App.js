import React from "react";
import ProductsList from "./components/products_list";
import CartPage from "./components/cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddOffer from "./components/add_offer";
import EditOffer from "./components/edit_offer";
import { ToastContainer } from "react-toastify";
import AddProduct from "./components/add_product";

function App() {
  return (
      <Router>
          <ToastContainer />
          <Routes>
              <Route path="/" element={<ProductsList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/add-product/" element={<AddProduct/>}/>
              <Route path="/edit-offer/:productId" element={<EditOffer />} />
              <Route path="/add-offer/:productId" element={<AddOffer />} />
          </Routes>
      </Router>
  );
}

export default App;
