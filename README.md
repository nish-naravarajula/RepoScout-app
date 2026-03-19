# RepoScout
RepoScout is a web application that helps developers organize and track their open-source contribution journey.

## ✍️ Authors

Jordan Ellison and Mishell Cardenas Espinosa

## 🔗 Class Link

CS 5610 Web Development - Northeastern Univeristy
https://johnguerra.co/classes/webDevelopment_online_spring_2026/

## 🎯 Project Objective

RepoScout is a web application that helps developers organize and track their open-source contribution journey. The user creates a profile with their programming languages, skill level, and areas of interest. RepoScout then uses this information to surface repositories from the GitHub API that match their profile, filtering by labels like "good first issue" or "help wanted" and by language. Users can add repos to their personal tracker and log individual contribution attempts over time, recording what they did, links to relevant issues or PRs, and the current status of their effort. All profile data and contribution logs are stored in MongoDB, with full CRUD operations on both collections, giving users a structured and motivating way to manage what would otherwise be a chaotic process.

## 🌐 Deployed Website

## 📂 Design Document

https://docs.google.com/document/d/1Mju6M0mkgSiM3W_SrfWANN9gQI4hyWlDdWf9eEWzBvs/edit?usp=sharing

## 📊 Presentation Slides

https://docs.google.com/presentation/d/12ldf5UGDdYHakuqcsu8XN2qo2WKiWl5JAH5HUkK9G2o/edit?usp=sharing

## 📹 Video Demo

## How to use RepoScout

### Getting Started

**Sign In**

1. Simply type your username to sign in. 

### User Profile

**Fill in personal info**

1. On the user profile page provide your personal info: name, GitHub username, photo. 
2. On the tech-stack card, fill in what you know on programming languages, tools and frameworks, and database management
3. Click on the edit buttons to update any of the provided information
4. IMPORTANT! To save the user profile click on the "Save" button at the bottom of the page.
5. If desired, restart from scratch by deleting your profile using the "Delete" button and provide your info again.  

### Browse the open-source repo catalog

1. On the home page, you can browse the extensive catalog of open-source projects available on GitHub. 
2. On the filter option, you can filter the repos based on the programming languages they use. 
3. On the search bar, search for any desired repos you are looking for. 
4. If desired, click the "+ Track" button on each of the repo cards to save that repo on your dashbaord. 

### Find your matches

1. On the match page, you will be automatically matched to repo's that fit the tech-stack you provided on your profile. 
2. On the search bar, search for any desired repos you are looking for. 
3. If desired, click the "+ Track" button on each of the repo cards to save that repo on your dashbaord.
4. If desired, click the "View" button on each of the repo cards to be taken to the repo on GitHub. 

### Dashboard

1. On the dashboard page, you will see a list of all the repos you decided to track/work on. 
2. The summary table provides insights on how many repos you have, the programming languages used, etc. 
3. If desired, untrack (stop working) on a repo by hitting the "Untrack" button
4. To open the log page, click on the "Log Repo" button

### Repo Logs

1. On the repo log page you will see a log for each of the tracked repos.
2. To add a new entry provide information such as the date, features added, etc and hit the "Add Entry" button. 
3. To see previous entries, click the drop downs organized by date to see your previous info. 
4. To edit or delete previous entries simply hit the "Edit" and "Delete" buttons. 

### Logout

1. Hit the logout button to log out from the app. 

## 📸 Screenshots


## 🛠️ Tech Requirements

Backend:

- Node.js
- Express.js
- dotenv

Frontend

- React.js
- HTML5
- CSS
- JavaScript (Vanilla)
- Bootstrap

Development

- Git & GitHub
- ESLint
- Prettier

Deployment

- Render
- MongoDB Atlas

## 💨 Install & Run Locally

1. Clone the repo:

```bash
git clone https://github.com/mishell-cardenas/RepoScout-app.git
cd RepoScout-app
```

2. Install dependencies:

In the root foler:

```bash
npm install
```

In frontend folder:

```bash
cd frontend
npm install
```

In backend folder:

```bash
cd backend
npm install
```

Additionally, on the backend folder create an .env file with:

```bash
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
```
Please see the .env.example file inside the backend folder for more instructions. 
IMPORTANT!! Please follow the instructions on the .env.example to get a GitHub token to render the GitHub API. 

3. Run the server

In frontend folder:
```bash
cd frontend
npm run dev
```
On a separate terminal:
```bash
cd backend
npm run dev
```
