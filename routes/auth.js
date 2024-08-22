import { Router } from 'express';
import { login, logout } from '../controllers/authController.js'; // 경로가 정확한지 확인하세요

const router = Router();

router.post('/login', login);
router.post('/logout', logout); // 로그아웃 라우트 추가

export default router;
