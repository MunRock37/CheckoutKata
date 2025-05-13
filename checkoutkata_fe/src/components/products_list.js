import "./product_list.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import { BsBag, BsPlusCircle } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "./toasts";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const GET_PRODUCTS = "http://127.0.0.1:8000/api/products/";
    const CART_API = "http://127.0.0.1:8000/api/cart/";

    const navigate = useNavigate();

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(GET_PRODUCTS);
                const updatedProducts = response.data.map(product => ({
                    ...product,
                    offer: product.offer || null,
                }));
                setProducts(updatedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch Cart Items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(CART_API);
                const cart = response.data;
                const total = cart.items
                    ? Object.values(cart.items).reduce((sum, qty) => sum + qty, 0)
                    : 0;
                setTotalItems(total);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
        fetchCart();
    }, []);

    // Add to Cart Function
    const addToCart = async (product) => {
        try {
            const response = await axios.post(CART_API, {
                product_name: product.name,
                quantity: 1,
            });

            const cart = response.data;
            const total = cart.items
                ? Object.values(cart.items).reduce((sum, qty) => sum + qty, 0)
                : 0;

            setTotalItems(total);
            showSuccessToast("Item added to cart!");
        } catch (error) {
            showErrorToast("Failed to add item to cart!");
            console.error("Error adding to cart:", error.response?.data || error.message);
        }
    };

    const handleOfferClick = (product) => {
        if (product.offer) {
            navigate(`/edit-offer/${product.offer.id}`);
        } else {
            navigate(`/add-offer/${product.id}`);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/products/${productId}/`);
            alert(response.data.msg); // Show success message
        } catch (error) {
            if (error.response && error.response.data.errors) {
                alert(error.response.data.errors.msg); // Show error from API
            } else {
                alert("Something went wrong while deleting the product.");
            }
            console.error(error);
        }
    };

    return (
        <div className="product-body">
            <div className="container">
                {/* Header Section */}
                <div className="header">
                    <h1>
                        Checkout Kata <BsBag className="shopping-bag-icon" />
                    </h1> 
                    <button className="add-product" onClick={() => navigate("/add-product")} >
                    <BsPlusCircle size={14} />  Add Product
                    </button>
                    <button className="cart-button" onClick={() => navigate("/cart")}>
                        <FiShoppingCart size={24} />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </button>
                </div>

                {/* Product List */}
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="offer-btn-container">
                                <p className="offer-button" onClick={() => handleOfferClick(product)}>
                                    {product.offer ? (
                                        <>
                                            <MdModeEdit size={14} /> Edit Offer
                                        </>
                                    ) : (
                                        <>
                                            <BsPlusCircle size={14} /> Add Offer
                                        </>
                                    )}
                                </p>
                            </div>

                            {product.image && (
                                <img src={product.image} alt={product.name} className="product-image" />
                            )}

                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-price">Price: $ {product.price}</p>

                            {product.offer ? (
                                <div className="discounts">
                                    <p>
                                        Buy {product.offer.quantity} for $ {product.offer.offer_price}
                                    </p>
                                </div>
                            ) : (
                                <div className="no-offers-container">
                                    <p className="no-offers">No offers available</p>
                                </div>
                            )}
                            <div className="buttons">
                                <button className="add-to-cart" onClick={() => addToCart(product)}>
                                    Add to Cart  <FiShoppingCart size={20} style={{ marginLeft: '3px', verticalAlign: 'middle' }} />
                                </button>
                                <button className="delete-product" onClick={() => handleDelete(product.id)}>
                                    <FaRegTrashCan size={18} style={{ marginLeft: '3px', verticalAlign: 'middle' }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ProductsList;
