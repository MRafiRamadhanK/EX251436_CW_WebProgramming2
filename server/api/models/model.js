// server/api/models/model.js
import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema({
  guest_name: {
    type: String,
    required: true
  },
  stay_duration: {
    type: Number,
    required: true
  },
  room_type: {
    type: String,
    required: true,
    default: 'Standard'
  },
  status_checkin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // automaticly created createdAt dan updatedAt
});

// making "guest" model
// MongoDB WILL AUTOMATICALLY CREATE "guests" COLLECTION
const Guest = mongoose.model('Guest', GuestSchema);

export default Guest;