// src/components/AddProductForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "./add_product.css";
const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/', {
        name,
        price
      });

      toast.success('✅ Product added!');
      setName('');
      setPrice('');
      navigate("/")
    } catch (error) {
      toast.error('❌ Error adding product');
      console.error(error.response?.data || error.message);
    }
  };

  return (


 <div className="cart-body">
        <div className="add-product-container">
           
        <div className="add-product-form" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Price:</label><br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            style={{ width: '100%' }}
          />
        </div>
        <button className='add-product-btn' type="submit" >
          Add Product
        </button>
      </form>
    </div>
                </div>


           
        </div>
        
  );
};

export default AddProduct;
