import express, { Router } from 'express';
import authRouter from './authRoute.js';
import userRouter from './userRoute.js';

const combinedRouter = Router();

combinedRouter.use('/api/auth', authRouter);
combinedRouter.use('/api/users', userRouter);

export default combinedRouter;
