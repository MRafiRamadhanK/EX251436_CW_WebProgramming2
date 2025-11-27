import Guest from '../models/model.js';

// server/api/controller/controller.js

export const createGuest = async (req, res) => {
  
  console.log("📥 Menerima request data:", req.body); 

  try {
    const guest = new Guest(req.body);
    const savedGuest = await guest.save();
    
    // 2. Cek apakah berhasil save
    console.log("✅ Berhasil disimpan ke MongoDB:", savedGuest);
    
    res.status(201).json(savedGuest);
  } catch (error) {
    // 3. Cek jika ada error
    console.error("❌ GAGAL MENYIMPAN:", error);
    
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
export const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(guest);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const updateGuest = async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedGuest) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(updatedGuest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteGuest = async (req, res) => {
  try {
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

