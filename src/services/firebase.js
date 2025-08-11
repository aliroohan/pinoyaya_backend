const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-service-account.json');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
    } else {
        firebaseApp = admin.app();
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback to environment variables if service account file doesn't exist
    if (!admin.apps.length) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
    }
}

const messaging = admin.messaging();

/**
 * Send notification to a single device
 * @param {string} token - FCM token of the target device
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendToDevice = async (token, notification, data = {}) => {
    try {
        const message = {
            token,
            notification,
            data,
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                }
            }
        };

        const response = await messaging.send(message);
        console.log('Successfully sent notification:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send notification to multiple devices
 * @param {Array<string>} tokens - Array of FCM tokens
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendToMultipleDevices = async (tokens, notification, data = {}) => {
    try {
        const message = {
            tokens,
            notification,
            data,
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                }
            }
        };

        const response = await messaging.sendMulticast(message);
        console.log('Successfully sent notifications:', response);
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error('Error sending notifications:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send notification to a topic
 * @param {string} topic - Topic name
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendToTopic = async (topic, notification, data = {}) => {
    try {
        const message = {
            topic,
            notification,
            data,
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                }
            }
        };

        const response = await messaging.send(message);
        console.log('Successfully sent topic notification:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Error sending topic notification:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Subscribe a device to a topic
 * @param {string|Array<string>} tokens - FCM token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<Object>} - Response from Firebase
 */
const subscribeToTopic = async (tokens, topic) => {
    try {
        const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
        const response = await messaging.subscribeToTopic(tokenArray, topic);
        console.log('Successfully subscribed to topic:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error subscribing to topic:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Unsubscribe a device from a topic
 * @param {string|Array<string>} tokens - FCM token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<Object>} - Response from Firebase
 */
const unsubscribeFromTopic = async (tokens, topic) => {
    try {
        const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
        const response = await messaging.unsubscribeFromTopic(tokenArray, topic);
        console.log('Successfully unsubscribed from topic:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error unsubscribing from topic:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send notification for babysitting job updates
 * @param {string} token - FCM token
 * @param {Object} jobData - Job data
 * @param {string} type - Notification type (job_request, job_accepted, job_completed, etc.)
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendJobNotification = async (token, jobData, type) => {
    const notifications = {
        job_request: {
            title: 'New Job Request',
            body: `You have a new babysitting request from ${jobData.customerName || 'a customer'}`
        },
        job_accepted: {
            title: 'Job Accepted',
            body: `Your babysitting request has been accepted by ${jobData.babysitterName || 'a babysitter'}`
        },
        job_completed: {
            title: 'Job Completed',
            body: 'Your babysitting job has been marked as completed'
        },
        job_cancelled: {
            title: 'Job Cancelled',
            body: 'A babysitting job has been cancelled'
        },
        payment_received: {
            title: 'Payment Received',
            body: 'You have received a payment for your babysitting service'
        }
    };

    const notification = notifications[type] || {
        title: 'Job Update',
        body: 'You have a new job update'
    };

    const data = {
        type,
        jobId: jobData._id || jobData.id,
        timestamp: new Date().toISOString()
    };

    return await sendToDevice(token, notification, data);
};

/**
 * Send notification for chat messages
 * @param {string} token - FCM token
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendChatNotification = async (token, messageData) => {
    const notification = {
        title: `Message from ${messageData.senderName || 'User'}`,
        body: messageData.content || 'You have a new message'
    };

    const data = {
        type: 'chat_message',
        chatId: messageData.chatId,
        messageId: messageData._id || messageData.id,
        senderId: messageData.senderId,
        timestamp: new Date().toISOString()
    };

    return await sendToDevice(token, notification, data);
};

/**
 * Send notification for booking updates
 * @param {string} token - FCM token
 * @param {Object} bookingData - Booking data
 * @param {string} type - Notification type
 * @returns {Promise<Object>} - Response from Firebase
 */
const sendBookingNotification = async (token, bookingData, type) => {
    const notifications = {
        booking_confirmed: {
            title: 'Booking Confirmed',
            body: 'Your babysitting booking has been confirmed'
        },
        booking_reminder: {
            title: 'Booking Reminder',
            body: `You have a babysitting booking in ${bookingData.reminderTime || '1 hour'}`
        },
        booking_cancelled: {
            title: 'Booking Cancelled',
            body: 'A babysitting booking has been cancelled'
        }
    };

    const notification = notifications[type] || {
        title: 'Booking Update',
        body: 'You have a booking update'
    };

    const data = {
        type,
        bookingId: bookingData._id || bookingData.id,
        timestamp: new Date().toISOString()
    };

    return await sendToDevice(token, notification, data);
};

module.exports = {
    sendToDevice,
    sendToMultipleDevices,
    sendToTopic,
    subscribeToTopic,
    unsubscribeFromTopic,
    sendJobNotification,
    sendChatNotification,
    sendBookingNotification,
    messaging
};
