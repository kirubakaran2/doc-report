# Med Detector

This project is a web-based application for medical detection, which consists of two parts: the **backend** and the **frontend**. Follow the instructions below to set up and run both parts.

---

## Backend Setup

### Requirements:
- Python 3.x
- Required Python libraries

### Steps to run the backend:

1. Navigate to the `backend` folder in your terminal:

    ```bash
    cd backend
    ```

2. Install the required dependencies using `pip`:

    ```bash
    pip install -r requirements.txt
    ```

3. Create an environment file if needed, or ensure that the `.env` file contains the appropriate configurations (e.g., database credentials, API keys).

4. To run the backend application, use:

    ```bash
    python app.py
    ```

   The backend server will now be running locally.
   or
   for simply run it just hit the run button in the right corner 

---

## Frontend Setup

### Requirements:
- Node.js
- npm (Node Package Manager)

### Steps to run the frontend:

1. Navigate to the `frontendw` folder:

    ```bash
    cd frontendw
    ```

2. Install the required node modules using npm:

    ```bash
    npm install
    ```

3. After the installation is complete, start the frontend server with:

    ```bash
    npm start
    ```

   This will start the frontend application locally.

---

## File Structure Overview

### Backend:

- `models/` - Contains model files for the backend logic.
- `utils/` - Contains utility files that assist in backend operations.
- `.env` - Environment variables for backend configurations.
- `app.py` - The main file to run the backend server.
- `requirements.txt` - List of Python dependencies.

### Frontend:

- `public/` - Contains static files like images, icons, etc.
- `src/` - Contains the main frontend source code files.
- `package-lock.json` - Lock file for the node modules.
- `package.json` - Contains the metadata for the frontend project and dependencies.
- `tailwind.config.js` - Configuration file for Tailwind CSS.

---

That's it! After following these steps, both the backend and frontend should be running locally on your machine.
