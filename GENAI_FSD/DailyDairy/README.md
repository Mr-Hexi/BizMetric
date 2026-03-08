# DailyDairy 🥛

DailyDairy is a full-stack, subscription-based e-commerce web application for dairy products. Designed as a college assignment, it provides a seamless and modern user experience similar to popular e-commerce platforms, but tailored for recurring deliveries of fresh dairy items.

## 🚀 Features

### Customer Features
*   **Authentication:** Secure registration and login using JSON Web Tokens (JWT).
*   **Product Browsing:** View dairy products organized by category.
*   **Cart & Checkout:** Add products to the cart and securely simulate checkout.
*   **Subscriptions:** Subscribe to recurring deliveries (Daily, Weekly, Monthly) for specific products.
*   **User Profile:** Manage account details, view active/cancelled subscriptions, and track payment history.

### Admin Features
*   **Admin Dashboard:** A dedicated interface for store managers.
*   **Catalog Management:** Add new product categories and inventory items directly from the UI.
*   **Customer Directory:** View registered customers and quickly check their active subscriptions in a consolidated layout.

## 🛠️ Technology Stack

**Frontend:**
*   [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
*   [Tailwind CSS](https://tailwindcss.com/) for modern, responsive, glassmorphism-inspired UI styling.
*   [React Router](https://reactrouter.com/) for client-side navigation.
*   [Axios](https://axios-http.com/) for API requests.

**Backend:**
*   [Django](https://www.djangoproject.com/) & [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
*   [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) for authentication.
*   SQLite (default development database).

## 📂 Project Structure

```text
DailyDairy/
│
├── backend/            # Django REST API
│   ├── backend/        # Core settings & configurations
│   ├── customer/       # Authentication & user profile models (extends AbstractUser)
│   ├── product/        # Category & Product models, views, and serializers
│   ├── subscription/   # Subscription models and recurring logic
│   ├── payment/        # Mock payment processing and history tracking
│   ├── manage.py       # Django CLI
│   └── seed.py         # Script to populate initial database records
│
└── frontend/           # React SPA
    ├── src/
    │   ├── api/        # Axios interceptors for JWT injection
    │   ├── components/ # Reusable UI components (Navbar, ProductCard, etc.)
    │   ├── context/    # React Context (AuthContext)
    │   ├── pages/      # Route views (Home, Profile, Cart, AdminDashboard, etc.)
    │   ├── App.jsx     # Main application routing
    │   └── index.css   # Global styles and Tailwind configuration
    ├── package.json    # Frontend dependencies
    └── vite.config.js  # Vite configurations
```

## ⚙️ Local Development Setup

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your Python environment (e.g., Conda):
   ```bash
   conda activate ml
   ```
3. Install dependencies:
   *(Ensure you have Django, djangorestframework, djangorestframework-simplejwt, and django-cors-headers installed)*
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```
4. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. (Optional) Seed the database with initial categories, products, and an admin user:
   ```bash
   python seed.py
   ```
   *Default admin credentials created by seed script: `admin` / `admin123`*
6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/`.

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173/` (or the port specified by Vite).

## 🎨 UI/UX Highlights
*   **Modern Aesthetics:** The platform utilizes the "Outfit" font family, soft shadows, rounded corners, and subtle background gradients for a premium feel.
*   **Responsive Details:** Layouts adapt seamlessly from mobile devices to large desktop monitors.
*   **Interactive Elements:** Hover states, transition animations, and glassmorphism navbars enhance user engagement.

## 📝 License

This project is created as a college assignment. Feel free to use it for educational purposes.
