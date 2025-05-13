import "./add_offer.css"
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessToast } from "./toasts";


const CREATE_OFFER = "http://127.0.0.1:8000/api/offers/";


const AddOffer = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(CREATE_OFFER, {
                product: productId,
                quantity: quantity,
                offer_price: discountPrice
            });
            showSuccessToast("Offer added successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error adding offer:", error);
            alert(error.response?.data?.message || "Failed to add offer. Please try again.");
        }
    };


    return (
        <div className="add-offer-body">
            <div className="add-offer-container">
                <h2>Add New Offer</h2>
                <form onSubmit={handleSubmit}>
                    <label>Product ID:</label>
                    <input type="text" value={productId} readOnly />

                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                    <label>Discount Price:</label>
                    <input
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        required
                    />

                    <button className="submit-btn" type="submit">Submit Offer</button>
                </form>
            </div>
        </div>

    );
};

export default AddOffer;
