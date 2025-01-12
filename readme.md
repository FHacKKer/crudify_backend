# CRUDify

## Description
A user management system with role-based access control, authentication, and authorization.

<hr />

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

<hr />

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/FHacKKer/crudify_backend
   ```

2. Navigate to the project folder:

   ```bash
   cd crudify_backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

<hr />

## Environment Variables
To run this project, you need to set up the required environment variables. These variables should be stored in a `.env` file.

The necessary environment variables are:

- **MONGODB_URI**: Your MongoDB connection string
- **JWT_SECRET**: A secret key used for JWT authentication

For reference, all required variables are also listed in the `.env.example` file.

<hr>


## Features
- Role-based access control
- User authentication (login/logout)
- Admin access to update user details (name, username, password, role)
- CRUD operations for users

<hr />

## API Endpoints
Provide a list of available API endpoints. Example:

### All Endpoints

1. **Greeting Routes**
  - [GET] `/` - Simple route for user greeting - [Go to usage](#greeting-route-usage)
  - [GET] `/:name` - Simple route for greeting a user by name - [Go to usage](#greeting-by-name-route-usage)

2. **Auth Routes**
  - [POST] `/api/v1/auth/signin` - API route for user signin - [Go to usage](#signin-route-usage)
  - [POST] `/api/v1/auth/signup` - API route for user signup - [Go to usage](#signup-route-usage)

3. **Users Routes**
  - [GET] `/api/v1/users` - Endpoint for fetching all users - [Go to usage](#get-users-route-usage)
  - [POST] `/api/v1/users` - Route for creating a new user - [Go to usage](#create-user-route-usage)
  - [PATCH] `/api/v1/users` - Route for updating a user - [Go to usage](#update-user-route-usage)
  - [DELETE] `/api/v1/users` - Route for deleting a user - [Go to usage](#delete-user-route-usage)

4. **Profile Routes**
  - [GET] `/api/v1/profile` - Route for fetching the user profile - [Go to usage](#get-profile-route-usage)
  - [PUT] `/api/v1/profile` - Route for updating the user profile - [Go to usage](#update-profile-route-usage)
  - [DELETE] `/api/v1/profile` - Route for deleting the user account - [Go to usage](#delete-profile-route-usage)

<hr>

## Greeting Routes

#### <a id="greeting-route-usage"></a>Greeting Route Usage

- **GET** `/` – Simple route for user greeting  
  Description: This endpoint returns a greeting message to the user.  
  Example response:  
  ```json
  {
  "message": "Hello, welcome to CRUDify!"
  }
  ```

<hr />  


#### <a id="greeting-by-name-route-usage"></a>Greeting by Name Route Usage

- **GET** `/:name` – Simple route for greeting a user by name  
  Description: This endpoint returns a personalized greeting by name.  
  Example response (for a request to `/fhackker`):  
  ```json
  {
  "message": "Hello, fhackker! Welcome to CRUDify!"
  }
  ```

<hr />

## Auth Routes

#### <a id="signin-route-usage"></a>Signin Route Usage

- **POST** `/api/v1/auth/signin` – API route for user signin  
  Description: This endpoint allows users to sign in using their username/email and password.  
  Request Body (application/json):  
  ```json5
  {
  "login": "test", // username/email  
  "password": "password" // user password here  
  }
  ```

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true for success response, false for error  
      "message": "Login successful", // success or error message  
      "timestamp": "2025-01-12T12:00:00Z", // timestamp of the request  
      "token": "jwt-token" // JWT token if login is successful, null otherwise  
      }
      ```

  Authentication: None

<hr />

#### <a id="signup-route-usage"></a>Signup Route Usage

- **POST** `/api/v1/auth/signup` – API route for user signup  
  Description: This endpoint allows users to sign up by providing their name, username, email, and password.  
  Request Body (application/json):  
  ```json5
  {
  "name": "name",
  "username": "username", // username should not contain spaces
  "email": "user_email",
  "password": "password"
  }
  ```

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true for success response, false for error
      "message": "Signup successful", // success or error message
      "timestamp": "2025-01-12T12:00:00Z" // timestamp of the request
      }
      ```

  Authentication: None

<hr />

## Users Routes

#### <a id="get-users-route-usage"></a>Get Users Route Usage

- **GET** `/api/v1/users` – Endpoint for fetching all users  
  Description: This endpoint allows users to fetch all users. Normal users (role: "user") will not see the username or email of other users. Only users with roles "moderator" or "admin" can view this information.  
  Request Body: None

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true in success, false in error
      "message": "Users fetched successfully", // message for success or error
      "timestamp": "2025-01-12T12:00:00Z", // timestamp of the request
      "users": [
        {
        "name": "Test Test",
        "username": "test",
        "email": "test@test.com",
        "isActive": true, // boolean indicating if user is active
        "role": "user", // "user", "moderator", "admin"
        "createdAt": "2025-01-12T12:00:00Z" // timestamp of user joining
        }
      ]
      }
      ```

  Authentication: JWT Token in Authorization header like `Bearer token_here` 

<hr />

#### <a id="create-user-route-usage"></a>Create User Route Usage

- **POST** `/api/v1/users` – Route for creating a new user  
  Description: This endpoint is used for creating a new user. This route is only accessible to users with the **admin** role.  
  Request Body (application/json):  
  ```json5
  {
  "name": "name",
  "username": "username",
  "email": "email",
  "password": "password",
  "role": "user" // role can be "user", "moderator", or "admin"
  }
  ```

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true for success, false for error
      "message": "User created successfully", // success or error message
      "timestamp": "2025-01-12T12:00:00Z", // timestamp of the request
      "user": {
      "name": "Test Test",
      "username": "test",
      "email": "test@test.com",
      "isActive": true,
      "role": "user",
      "createdAt": "2025-01-12T12:00:00Z"
      }
      }
      ```

  Authentication: JWT Token in Authorization header like `Bearer token_here`

  ####  **Note**: This route is only accessible to **admin** role users.

<hr />

#### <a id="update-user-route-usage"></a>Update User Route Usage

- **PATCH** `/api/v1/users` – Route for updating a user  
  Description: This endpoint is used for updating a user's details. This route is only accessible to users with the **admin** role.  
  Request Body (application/json):  
  ```json5
  {
  "userId": "32343dsad", // ID of the user to update
  "data": {
  "name": "new name",
  "username": "new username",
  "role": "user" // role can be "user", "moderator", or "admin"
  // Note: Only name, username, and role can be updated
  }
  }
  ```

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true for success, false for error
      "message": "User updated successfully", // success or error message
      "timestamp": "2025-01-12T12:00:00Z" // timestamp of the request
      }
      ```

  Authentication: JWT Token in Authorization header like `Bearer token_here`

  **Note**: This route is only accessible to **admin** role users. Only the fields **name**, **username**, and **role** are changeable.    

<hr />

#### <a id="delete-user-route-usage"></a>Delete User Route Usage

- **DELETE** `/api/v1/users` – Route for deleting a user  
  Description: This endpoint is used for deleting a user. This route is only accessible to users with the **admin** role.  
  Request Body (application/json):  
  ```json5
  {
  "userId": "32343dsad" // ID of the user to delete
  }
  ```

  Response Body:
    - **Status**: 200 (success), 400 (error)
    - **Body**:  
      ```json5
      {
      "success": true, // true for success, false for error
      "message": "User deleted successfully", // success or error message
      "timestamp": "2025-01-12T12:00:00Z" // timestamp of the request
      }
      ```

  Authentication: JWT Token in Authorization header like `Bearer token_here`

  **Note**: This route is only accessible to **admin** role users.
<hr />

## Profile Routes

#### <a id="get-profile-route-usage"></a>Get Profile Route Usage

- **GET** `/api/v1/profile` – Route for fetching the user profile  
  Description: This endpoint retrieves the authenticated user's profile details.
  Request Body: None

  Response Body:
  - **Status**: 200 (success), 400 (error)
  - **Body**:  
    ```json5
    {
    "success": true, // true for success, false for error
    "message": "Profile fetched successfully", // success or error message
    "timestamp": "2025-01-12T12:00:00Z", // timestamp of the request
    "profile": {
    // user object containing profile details
    }
    }
    ```

  Authentication: JWT Token in Authorization header like `Bearer token_here`

<hr />

#### <a id="update-profile-route-usage"></a>Update Profile Route Usage

- **PUT** `/api/v1/profile` – Route for updating the user profile  
  Description: This endpoint allows authenticated users to update specific fields in their profile, such as their name, username, or active status.

  Request Body (application/json):  
  ```json5
  {
  "data": {
  "name": "new name" // Replace "name" with the key-value pairs of the fields you want to update
  }
  }
  ```

  Response Body:
  - **Status**: 200 (success), 400 (error)
  - **Body**:  
    ```json5
    {
    "success": true, // Indicates if the operation was successful
    "message": "Your profile has been updated successfully!", // Friendly message for success or error
    "timestamp": "2025-01-12T12:00:00Z" // The exact time of the request
    }
    ```
  
<hr />

#### <a id="delete-profile-route-usage"></a>Delete Profile Route Usage


- **DELETE** `/api/v1/profile` – Route for deleting the user account  
  Description: This endpoint allows an authenticated user to permanently delete their account from the system.

  Request Body:  
  None

  Response Body:
  - **Status**: 200 (success), 400 (error)
  - **Body**:  
    ```json5
    {
    "success": true, // Indicates if the operation was successful
    "message": "Your account has been deleted successfully.", // Friendly message for success or error
    "timestamp": "2025-01-12T12:00:00Z" // The exact time of the request
    }
    ```

  Authentication: JWT Token must be included in the Authorization header as `Bearer token_here`.

<hr>

## Contributing
If you would like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

<hr>

## License
This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project, provided that the original license and copyright notice are included.

For more details, see the [LICENSE](./LICENSE) file.

<hr>

## Contact
For any questions, please reach out to me at [faisalshahzadyt@gmail.com](mailto:faisalshahzadyt@gmail.com).
## Demo
Explore the live backend of CRUDify hosted on Render:  
**[CRUDify Backend Live Demo](https://crudify-backend-069p.onrender.com/)**

You can use this link to interact with the API and test the available endpoints. 