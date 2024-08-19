import express from 'express';
import { createPayment, getPaymentById } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/:id', getPaymentById);

export default router;
