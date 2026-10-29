# RateSpace

RateSpace is a full-stack store-rating web application. Users can
discover stores and submit ratings, while administrators manage users
and stores and store owners review ratings for their stores.

## Features

-   **Authentication:** Register and log in to access role-specific
    functionality.
-   **Role-based access:** Separate experiences for System Admin, Store
    Owner, and Normal User.
-   **Store discovery:** Browse and search stores.
-   **Ratings:** Submit a rating for a store and view available rating
    information.
-   **Admin dashboard:** View dashboard information and manage users and
    stores.
-   **Store-owner dashboard:** Review rating information for the owner's
    store(s).
-   **Responsive interface:** Layouts adapt to desktop and smaller
    screens.
-   **Interactive UI:** Styled forms, buttons, cards, tables, and
    hover/focus states.

> Available actions depend on the role assigned to your account and on
> the features enabled in the current deployment.

## Technology Stack

-   **Frontend:** React, Vite, React Router, Tailwind CSS v4 and CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JWT-based authentication (as configured in the
    backend)

## System Requirements

Install the following before running the project locally:

-   Node.js (use a current LTS release)
-   npm (usually included with Node.js)
-   MongoDB Atlas or a local MongoDB instance
-   Git (optional, for cloning the repository)
-   A modern browser such as Chrome, Edge, Firefox, or Safari

Check your installed versions:

``` bash
node --version
npm --version
git --version
```

## Project Structure

The repository is organised into separate frontend and backend
applications:

``` text
RateSpace/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── package.json
    └── ...
```

The exact files may vary slightly as the project evolves.

## Run RateSpace Locally

### 1. Get the source code

Clone the repository:

``` bash
git clone https://github.com/Laxmijai/RateSpace.git
cd RateSpace
```

If you already have the project, open its root folder in your terminal.

### 2. Configure the backend

Open a terminal in the project root:

``` bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory. Use the exact variable
names expected by your backend code. A typical configuration may look
like this:

``` env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

**Important:** These are example names. Check the backend's
configuration files and source code for the exact required names and
port before running the application. Do not commit your `.env` file or
share real secrets.

For MongoDB Atlas: 1. Create or select a database cluster. 2. Create a
database user and password. 3. Configure the cluster's network access to
allow connections from your development environment. 4. Copy the
connection string into the matching environment variable. 5. Replace any
placeholder database name or credentials in the connection string.

Start the backend using the script defined in `backend/package.json`.
Common examples are:

``` bash
npm run dev
```

or:

``` bash
npm start
```

Use the script that actually exists in your `package.json`. Keep this
terminal running.

### 3. Configure and start the frontend

Open a **second terminal** at the repository root:

``` bash
cd frontend
npm install
```

If the frontend expects a backend URL in an environment variable, create
`frontend/.env` and set the variable name used by the frontend code. For
example:

``` env
VITE_API_URL=http://localhost:5000
```

This is an example only: verify the variable name and backend port in
your source code. Vite exposes frontend environment variables prefixed
with `VITE_`; never put private secrets in frontend environment
variables.

Start the frontend:

``` bash
npm run dev
```

Open the local URL printed by Vite in the terminal, commonly
`http://localhost:5173`.

### 4. Use the application

1.  Open the frontend in your browser.
2.  Register an account or sign in with an account supplied by the
    project administrator.
3.  Use the navigation and dashboard options available to your account
    role.
4.  If a page cannot load data, confirm that the backend is running and
    that the frontend is configured with the correct backend URL.

## User Guide

### Normal User

1.  Register or log in.
2.  Open the store discovery/listing page.
3.  Search or browse available stores.
4.  Open a store and review its details and rating information.
5.  Select a rating and submit it.
6.  Follow any on-screen confirmation or validation messages.

### System Administrator

1.  Sign in with an administrator account provisioned for the
    application.
2.  Open the admin dashboard.
3.  Review the available summary cards and management sections.
4.  Use the Create User form to add a user and assign the appropriate
    role.
5.  Use the Create Store form to add a store and select its owner when
    the form requests it.
6.  Use the user/store management tables to review or manage records.
7.  Check form messages when required fields are missing or an operation
    fails.

Only an authorised administrator should use an administrator account. Do
not assume a public registration form can create an administrator
account.

### Store Owner

1.  Sign in using the store-owner account assigned to you.
2.  Open the store-owner dashboard.
3.  Review the rating information displayed for your store.
4.  Use only the actions available to your role.

## Troubleshooting

### Frontend cannot connect to the backend

-   Ensure the backend process is running.
-   Verify the backend URL configured in the frontend.
-   Check that the backend port matches the configured URL.
-   Review the browser console and backend terminal for errors.
-   Check the backend's CORS configuration if the frontend and backend
    run on different origins.

### MongoDB connection fails

-   Verify the connection string and credentials.
-   Ensure the database user has appropriate permissions.
-   Check MongoDB Atlas network access settings.
-   Confirm the environment variable name matches the code.
-   Restart the backend after changing `.env`.

### Login or protected pages fail

-   Check that the account exists and the credentials are correct.
-   Confirm the backend JWT configuration is set.
-   Inspect the browser Network tab and backend logs for the actual
    error.
-   Sign out and sign in again if the current session is expired.

### Styling does not update

-   Save the CSS file.
-   Confirm that the relevant stylesheet is imported by the frontend.
-   Restart Vite if configuration changed.
-   Hard-refresh the browser with `Ctrl + Shift + R`.

### Port is already in use

Stop the other process using the port or configure the application to
use an available port. Ensure the frontend points to the actual backend
port.

## Security Notes

-   Never commit `.env` files, database credentials, JWT secrets, or API
    keys.
-   Use strong, unique secrets for deployed environments.
-   Do not use an administrator account for normal browsing.
-   Configure CORS, database access, and deployment environment
    variables for your environment.
-   Do not put private backend credentials in frontend variables.

## Development Commands

Run commands from the correct directory.

  ------------------------------------------------------------------------
  Purpose                 Directory               Command
  ----------------------- ----------------------- ------------------------
  Install frontend        `frontend/`             `npm install`
  dependencies                                    

  Start frontend          `frontend/`             `npm run dev`

  Build frontend          `frontend/`             `npm run build`

  Install backend         `backend/`              `npm install`
  dependencies                                    

  Start backend           `backend/`              Check
                                                  `backend/package.json`
                                                  for the available start
                                                  script
  ------------------------------------------------------------------------

## Contributing

1.  Create a branch for your change.
2.  Keep frontend and backend changes focused.
3.  Test the affected role and workflow locally.
4.  Avoid committing credentials or generated dependency folders.
5.  Open a pull request with a clear summary of the changes.

## Support

When reporting a problem, include the page/role affected, the steps that
reproduce the issue, the browser console error (if any), and the backend
terminal error. Remove passwords, tokens, and other secrets before
sharing logs.
