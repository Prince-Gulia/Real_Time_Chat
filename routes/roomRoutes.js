const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getAllRooms, newRoom } = require('../controllers/roomController');

router.get('/', getAllRooms);
router.post('/',verifyToken, newRoom);

module.exports = router;