const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'senderModel'
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    senderRole: { 
        type: String, 
        required: true, 
        enum: ['customer', 'babysitter'] 
    },
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'recipientModel'
    },
    recipientRole: { 
        type: String, 
        required: true, 
        enum: ['customer', 'babysitter'] 
    },
    content: { 
        type: String, 
        required: true 
    },
    messageType: { 
        type: String, 
        default: 'text', 
        enum: ['text', 'image', 'file'] 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    readAt: { 
        type: Date 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

// Dynamic ref for sender
messageSchema.virtual('senderModel').get(function() {
    return this.senderRole === 'customer' ? 'Customer' : 'Babysitter';
});

// Dynamic ref for recipient
messageSchema.virtual('recipientModel').get(function() {
    return this.recipientRole === 'customer' ? 'Customer' : 'Babysitter';
});

// Index for efficient querying
messageSchema.index({ senderId: 1, recipientId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema); 