import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; 
// Common Toast Configuration

const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    className: "toast-blue",
};

// Reusable Toast Functions
export const showSuccessToast = (message) => {
    toast.success(message, toastOptions);
};

export const showErrorToast = (message) => {
    toast.error(message, toastOptions);
};
