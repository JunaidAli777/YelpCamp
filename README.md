
# YelpCamp

YelpCamp is a campground review website built using Node.js, Express.js, and MongoDB. This project allows users to register, create and manage campgrounds, and leave reviews for campgrounds.

## Features

- User registration and authentication
- CRUD operations for campgrounds
- Users can post, delete, and edit their own campgrounds
- Users can leave reviews on any campground if they are logged in
- Cluster map view of all campgrounds using Mapbox
- Single campground map view using Mapbox

## Technologies Used

- **Frontend**: EJS (Embedded JavaScript), Bootstrap, custom CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Mapping**: Mapbox

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. **Clone the repository:**

   \`\`\`bash
   git clone https://github.com/JunaidAli777/YelpCamp.git
   cd YelpCamp
   \`\`\`

2. **Install dependencies:**

   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**

   Create a \`.env\` file in the root directory and add the following:

   \`\`\`plaintext
   NODE_ENV=development
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   MAPBOX_TOKEN=your_mapbox_token
   SECRET=your_session_secret
   \`\`\`

4. **Run the application:**

   \`\`\`bash
   npm start
   \`\`\`

   The application will start on \`http://localhost:3000\`.

## Usage

- **User Registration and Login:**
  - Register as a new user or log in with existing credentials.

- **Campground Management:**
  - View all campgrounds or search for specific ones.
  - Create new campgrounds with details and images.
  - Edit or delete campgrounds that you have created.

- **Reviews:**
  - Leave reviews on any campground if you are logged in.
  - Edit or delete your own reviews.

- **Map View:**
  - View a cluster map of all campgrounds on the "All Campgrounds" page.
  - View a map of the specific campground location on its detail page.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Contact

Junaid Ali - [syedjunaidali.ali@gmail.com]

GitHub: [JunaidAli777](https://github.com/JunaidAli777)
