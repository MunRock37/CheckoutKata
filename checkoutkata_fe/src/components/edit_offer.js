import "./edit_offer.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "./toasts";




// GET offer details (by ID)
const GET_OFFER_DETAILS = `http://127.0.0.1:8000/api/offers/`;

// UPDATE or DELETE an offer (by ID, using PATCH or DELETE)
const UPDATE_OFFER = `http://127.0.0.1:8000/api/offers/`;
const DELETE_OFFER = `http://127.0.0.1:8000/api/offers/`;



const EditOffer = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [offer, setOffer] = useState({ product: "", quantity: "", offer_price: "" });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!productId) return;

        axios.get(`${GET_OFFER_DETAILS}${productId}/`)
            .then(response => {
                console.log("====================0", response.data)
                setOffer({
                    product: response.data.product,
                    quantity: response.data.quantity,
                    offer_price: response.data.offer_price
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching offer:", error);
                setLoading(false);
            });
    }, [productId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${UPDATE_OFFER}${productId}/`, {
                quantity: parseInt(offer.quantity),
                offer_price: parseFloat(offer.offer_price)
            });

            showSuccessToast("Offer updated successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error updating offer:", error);
            showErrorToast("Failed to update offer. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${DELETE_OFFER}${productId}/`);
            showSuccessToast("Offer deleted successfully!")

            navigate("/");
        } catch (error) {
            console.error("Error deleting offer:", error);
            showErrorToast("Failed to delete the offer.");
        }
    };

    return (
        <div className="edit-body">
            <div className="edit-offer-container">
                <h2>Edit Offer</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <label>Product ID:</label>
                        <input type="text" value={offer.product || ""} readOnly />

                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={offer.quantity || ""}
                            onChange={(e) => setOffer({ ...offer, quantity: e.target.value })}
                            required
                        />

                        <label>Discount Price:</label>
                        <input
                            type="number"
                            value={offer.offer_price || ""}
                            onChange={(e) => setOffer({ ...offer, offer_price: e.target.value })}
                            required
                        />

                        {/* Button Container for Alignment */}
                        <div className="button-container">
                            <button type="submit" className="update-button">Update Offer</button>
                            <button type="button" className="delete-button" onClick={handleDelete}>Delete Offer</button>
                        </div>
                    </form>
                )}
            </div>
        </div>

    );
};

export default EditOffer;
