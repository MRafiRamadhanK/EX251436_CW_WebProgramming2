import express from 'express';
import {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  deleteGuest
} from '../controller/controller.js';

const router = express.Router();

router.post('/guests', createGuest);
router.get('/guests', getAllGuests);
router.get('/guests/:id', getGuestById);
router.patch('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

export default router;