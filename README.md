# HD Assessment

## Demo
[Live Demo](https://hd-assessment.vercel.app/)

## About the Project
HD Assessment is a Next.js application that utilizes Vercel Blob for uploading multiple files. It includes additional action buttons such as Download, Rename, and Delete for managing uploaded files.

## Built With
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel

## Components
### File Upload
- Allows multiple file uploads
- Rejects files over 5MB
- Accepts file types: text/plain, text/xml, application/json, application/pdf, image/*, audio/*, and video/*
- Fetches dog image from API during upload initiation, successful upload, and when files are uploaded

### File List
- Displays all uploaded files with action buttons (Download, Rename, Delete)

### Local Storage
- Utilizes local storage for persistent state

### Error UI
- Displays errors using either modal or toast

### Skeleton UI
- Provides a skeleton loading effect with a fake delay

## Getting Started
To run this project locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Start the development server by running `npm run dev`.
4. Open your browser and navigate to `http://localhost:3000` to view the project.
