# Project Setup Guide

## Prerequisites
Make sure you have the following installed on your system:
- **Python 3**
- **Node.js & npm**
- **Git**
- **virtualenv** (Python virtual environment tool)

To install `virtualenv` on linux, run: 
```sh
sudo apt install python3.10-venv
```

---

## Backend Setup (Django)

### 1. Clone the Project
Open a terminal and run:
```sh
mkdir project_directory && cd project_directory
```
Clone the repository:
```sh
git clone https://github.com/Rockon-collab/Checkout-Kata.git
cd Checkout-Kata
```

### 2. Set Up the Backend
Navigate to the backend directory:
```sh
cd CheckoutKata_BE
```

Create and activate a virtual environment using `virtualenv`:
```sh
python -m venv env
source env/bin/activate  # On macOS/Linux
venv\Scripts\activate    # On Windows
```

Install dependencies:
```sh
pip install -r requirements.txt
```

### 4. Apply Migrations
Run the following commands to set up the database:
```sh
python3 manage.py makemigrations
python3 manage.py migrate
```

### 5. Create a Superuser
Run:
```sh
python3 manage.py createsuperuser
```
Enter the following details:
- **Username:** `admin`
- **Email:** `admin@email.com`
- **Password:** `Password@123`

### 6. Start the Backend Server
```sh
python3 manage.py runserver
```

### 7. Access Django Admin Panel
- Open: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- Login with:
  - **Username:** `admin`
  - **Password:** `Password@123`
- Create some **Products** in the admin panel.

---

## Frontend Setup (React)

### 1. Open a New Terminal
Navigate to the frontend directory:
```sh
cd checkoutkata_fe
```

```ini
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

### 3. Install Dependencies
```sh
npm install
```

### 4. Start the Frontend Server
```sh
npm start
```

### 5. Open the Application
- Go to: [http://localhost:3000/](http://localhost:3000/)
- The page will display the **products** you added in the Django admin panel.

---

## Additional Notes
- Make sure both the backend and frontend servers are running while testing. 