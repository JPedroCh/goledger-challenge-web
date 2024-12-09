# GoLedger Challenge Web

This is a React application using TypeScript and Vite. It's called Harmonic Groove and it consumes the API made by Goledger.

## App Demonstration

Watch the demonstration video on Youtube by clicking below:
[![Watch the demo video on YouTube](https://img.youtube.com/vi/Sj5N9EvUb14/0.jpg)](https://www.youtube.com/watch?v=Sj5N9EvUb14)

## Prerequisites

Before starting, you will need to have the following prerequisites installed on your system:

| Name    | Version |
| ------- | ------- |
| Node.js | >=20.x  |
| Npm     | >=10.x  |
| Docker  | >=20.x  |

## Technologies/Dependencies:

The technologies used in this project are:

| Name            | Link                             |
| --------------- | -------------------------------- |
| React           | https://reactjs.org/             |
| Vite            | https://vite.dev/                |
| Axios           | https://github.com/axios/axios   |
| Chakra UI       | https://www.chakra-ui.com/       |
| React Hook Form | https://www.react-hook-form.com/ |
| Zod             | https://zod.dev/                 |

## Local Configuration

### 1. Clone the Repo

Clone this repository to your local environment:

```bash
git clone https://github.com/JPedroCh/goledger-challenge-web.git
cd goledger-challenge-web
```

### 2. Install Dependencies

Install the project dependencies using NPM:

```bash
npm install
```

### 3. Configure the .env File

Create a `.env` file that includes:

- `VITE_API_URL`: environment variable to define the URL to be used for API requests.
- `VITE_USERNAME`: environment variable to define the username used to build the token for Basic authentication.
- `VITE_PASSWORD`: environment variable to define the password used to build the token for Basic authentication.

```env
VITE_API_URL=http://ec2-54-91-215-149.compute-1.amazonaws.com
VITE_USERNAME=<username send to the email by Goledger Challenger Web>
VITE_PASSWORD=goledger=<password send to the email by Goledger Challenger Web>
```

### 4. Run the Application

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Docker Configuration

### 1. Build Docker Image

Build the application's Docker image:

```bash
docker build -t <image_name> .
```

### 2. Run the Container

Run the container using the following command:

```bash
docker run -p 8080:8080 <image_name>
```

The application will be available at `http://localhost:8080`.

## Structure of Folders and Files

```bash
harmonic-groove/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.tsx
│   ├── main.tsx
│   ├── theme.tsx
│   └── vite-env.d.ts
├── .env
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

### Description of Folders and Files

- `public/` - Directory for images and public files.
- `src/` - Main directory containing the application's source code.
- `src/assets/fonts` - Contains the files related to the fonts used.
- `src/components/` - Contains reusable UI components that can be used throughout the application.
- `src/constants/` - Contains the files related to constants used in the whole application.
- `src/pages/` - Contains components representing entire pages of the application.
- `src/routes/` - Contains the route configuration file defining application routes using `react-router-dom`.
- `src/services/` - Contains files handling external API calls, business logic, or any service layer logic.
- `src/App.tsx` - Contains the root component of the application and sets up routes and global state providers.
- `src/main.tsx` - Renders the `App` component into the DOM.
- `src/theme.tsx` - File used to create a theme for reusable style variables.
- `src/vite-env.d.ts` - Provides TypeScript definitions for Vite-specific environment variables.
- `.env` - Contains environment variables used by the application.
- `.env.example` - Contains example of .env structure.
