/**
 * Paste Model
 * 
 * Mongoose schema for storing paste data with TTL and view limit support
 */

import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
  pasteId: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  expiresAt: { type: Date, default: null, index: true },
  maxViews: { type: Number, default: null },
  viewCount: { type: Number, default: 0, required: true },
}, {
  timestamps: true,
});


// Create compound index for efficient queries
pasteSchema.index({ pasteId: 1, expiresAt: 1 });

// Instance method to check if paste is expired
pasteSchema.methods.isExpiredAt = function (currentTime) {
    if (!this.expiresAt) return false;
    return currentTime >= this.expiresAt.getTime();
};

// Instance method to check if view limit is exceeded
pasteSchema.methods.hasExceededViewLimit = function () {
    if (!this.maxViews) return false;
    return this.viewCount >= this.maxViews;
};

// Instance method to check if paste is available
pasteSchema.methods.isAvailableAt = function (currentTime) {
    return !this.isExpiredAt(currentTime) && !this.hasExceededViewLimit();
};

// Instance method to increment view count atomically
pasteSchema.methods.incrementViewCount = async function () {
    this.viewCount += 1;
    await this.save();
    return this.viewCount;
};

const Paste = mongoose.models.Paste || mongoose.model('Paste', pasteSchema);

export default Paste;
