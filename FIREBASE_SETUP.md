# Firebase Notification Service Setup

## Overview
This document explains how to set up and use the Firebase notification service for the Pinoyaya babysitting platform.

## Prerequisites
1. Firebase project created in Firebase Console
2. Firebase Admin SDK service account key
3. `firebase-admin` package (already installed)

## Setup Instructions

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file and save it as `firebase-service-account.json` in the project root

### 2. Environment Variables
Add the following environment variables to your `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### 3. Service Account File (Alternative)
If you prefer using a service account file instead of environment variables:
1. Place the downloaded `firebase-service-account.json` in the project root
2. The service will automatically use this file for authentication

## Usage Examples

### Basic Notification Sending
```javascript
const firebaseService = require('./src/services/firebase');

// Send to single device
const result = await firebaseService.sendToDevice(
    'device-fcm-token',
    {
        title: 'New Message',
        body: 'You have a new message'
    },
    {
        type: 'chat',
        chatId: '123'
    }
);

// Send to multiple devices
const result = await firebaseService.sendToMultipleDevices(
    ['token1', 'token2', 'token3'],
    {
        title: 'Broadcast Message',
        body: 'This is a broadcast message'
    }
);
```

### Job-specific Notifications
```javascript
// Send job request notification
await firebaseService.sendJobNotification(
    babysitterToken,
    {
        _id: 'job123',
        customerName: 'John Doe'
    },
    'job_request'
);

// Send job acceptance notification
await firebaseService.sendJobNotification(
    customerToken,
    {
        _id: 'job123',
        babysitterName: 'Jane Smith'
    },
    'job_accepted'
);
```

### Chat Notifications
```javascript
await firebaseService.sendChatNotification(
    recipientToken,
    {
        chatId: 'chat123',
        senderName: 'John Doe',
        content: 'Hello, are you available?',
        senderId: 'user123',
        _id: 'message456'
    }
);
```

### Booking Notifications
```javascript
await firebaseService.sendBookingNotification(
    userToken,
    {
        _id: 'booking123',
        reminderTime: '30 minutes'
    },
    'booking_reminder'
);
```

### Topic-based Notifications
```javascript
// Subscribe users to topics
await firebaseService.subscribeToTopic(['token1', 'token2'], 'job_updates');

// Send to topic
await firebaseService.sendToTopic(
    'job_updates',
    {
        title: 'New Jobs Available',
        body: 'There are new babysitting jobs in your area'
    }
);
```

## Available Functions

### Core Functions
- `sendToDevice(token, notification, data)` - Send to single device
- `sendToMultipleDevices(tokens, notification, data)` - Send to multiple devices
- `sendToTopic(topic, notification, data)` - Send to topic subscribers
- `subscribeToTopic(tokens, topic)` - Subscribe devices to topic
- `unsubscribeFromTopic(tokens, topic)` - Unsubscribe devices from topic

### Specialized Functions
- `sendJobNotification(token, jobData, type)` - Job-related notifications
- `sendChatNotification(token, messageData)` - Chat message notifications
- `sendBookingNotification(token, bookingData, type)` - Booking-related notifications

## Notification Types

### Job Notifications
- `job_request` - New job request
- `job_accepted` - Job accepted by babysitter
- `job_completed` - Job marked as completed
- `job_cancelled` - Job cancelled
- `payment_received` - Payment received

### Booking Notifications
- `booking_confirmed` - Booking confirmed
- `booking_reminder` - Booking reminder
- `booking_cancelled` - Booking cancelled

## Error Handling
All functions return a response object with:
- `success: boolean` - Whether the operation was successful
- `messageId: string` - Firebase message ID (on success)
- `error: string` - Error message (on failure)
- `successCount: number` - Number of successful sends (for multicast)
- `failureCount: number` - Number of failed sends (for multicast)

## Integration with Existing Services
The Firebase service can be integrated with existing services:

```javascript
// In your job service
const firebaseService = require('./firebase');

// When a job is created
exports.createJob = async (jobData) => {
    // ... existing job creation logic
    
    // Send notification to available babysitters
    const availableBabysitters = await getAvailableBabysitters();
    const tokens = availableBabysitters.map(bs => bs.fcmToken);
    
    await firebaseService.sendToMultipleDevices(
        tokens,
        {
            title: 'New Job Available',
            body: 'A new babysitting job is available in your area'
        },
        {
            type: 'job_available',
            jobId: jobData._id
        }
    );
};
```

## Security Notes
1. Keep your Firebase service account key secure
2. Never commit the service account file to version control
3. Use environment variables in production
4. Implement proper token validation and management
5. Consider implementing rate limiting for notification sending 