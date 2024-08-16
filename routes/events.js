const express = require('express');
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventsController');

const router = express.Router();

// 모든 이벤트 조회
router.get('/', getAllEvents);

// 특정 이벤트 조회
router.get('/:id', getEventById);

// 이벤트 작성 (관리자만 가능)
router.post('/', createEvent);

// 이벤트 수정 (관리자만 가능)
router.put('/:id', updateEvent);

// 이벤트 삭제 (관리자만 가능)
router.delete('/:id', deleteEvent);

module.exports = router;
