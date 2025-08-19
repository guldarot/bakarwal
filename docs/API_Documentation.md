# Animal Raiser Connect API Documentation

## Overview
This document provides information about the API endpoints for the Animal Raiser Connect mobile application. The app allows animal raisers to connect, share problems, and get help from the community.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users/:userId` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:userId/posts` - Get user's posts
- `POST /users/pinned` - Add pinned post
- `DELETE /users/pinned` - Remove pinned post
- `GET /users/:userId/pinned` - Get user's pinned posts

### Posts
- `POST /posts` - Create a new post
- `GET /posts` - Get all posts
- `GET /posts/:postId` - Get post by ID
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post
- `POST /posts/:postId/tags` - Add tag to post
- `DELETE /posts/:postId/tags` - Remove tag from post

### Follow System
- `POST /follow` - Follow a user
- `DELETE /follow` - Unfollow a user
- `GET /follow/followers/:userId` - Get user's followers
- `GET /follow/following/:userId` - Get user's following
- `GET /follow/:userId` - Check follow status

### Geolocation
- `GET /geolocation/users` - Get nearby users
- `GET /geolocation/posts` - Get nearby posts
- `GET /geolocation/suggested` - Get suggested posts
- `PUT /geolocation/location` - Update user location

### Comments
- `POST /comments/:postId` - Add comment to post
- `GET /comments/:postId` - Get comments for post
- `GET /comments/comment/:commentId` - Get comment by ID
- `PUT /comments/:commentId` - Update comment
- `DELETE /comments/:commentId` - Delete comment

### Search
- `GET /search/users` - Search users
- `GET /search/posts` - Search posts
- `GET /search/all` - Search everything
- `GET /search/popular` - Get popular users
- `GET /search/trending` - Get trending posts

## Data Models

### User
- `username` (String) - Unique username
- `email` (String) - User's email
- `password` (String) - Hashed password
- `name` (String) - User's full name
- `location` (Object) - User's location (coordinates)
- `bio` (String) - User's bio
- `profilePicture` (String) - URL to profile picture
- `followersCount` (Number) - Number of followers
- `followingCount` (Number) - Number of following
- `postsCount` (Number) - Number of posts
- `pinnedPosts` (Array) - Array of pinned post IDs
- `isVerified` (Boolean) - Verification status

### Post
- `userId` (ObjectId) - ID of user who created the post
- `title` (String) - Post title
- `description` (String) - Post description
- `images` (Array) - Array of image objects
- `location` (Object) - Post location (coordinates)
- `tags` (Array) - Array of tagged user IDs
- `commentsCount` (Number) - Number of comments
- `isSolved` (Boolean) - Problem solved status

### Comment
- `postId` (ObjectId) - ID of post
- `userId` (ObjectId) - ID of user who commented
- `text` (String) - Comment text (optional)
- `voiceNote` (Object) - Voice note details (optional)
- `isVoiceNote` (Boolean) - Whether comment is a voice note

### Follow
- `follower` (ObjectId) - ID of follower
- `following` (ObjectId) - ID of user being followed

## Features Implemented
1. User authentication (register, login, profile management)
2. User profiles with pinned posts
3. Post creation with images and location
4. Follow system
5. Geolocation features (nearby users/posts, location updates)
6. Comment system (text and voice notes)
7. Search functionality (users, posts, popular content)

## Getting Started
1. Register a new user account
2. Login to get authentication token
3. Update your profile and location
4. Start creating posts and following other users
5. Engage with the community through comments