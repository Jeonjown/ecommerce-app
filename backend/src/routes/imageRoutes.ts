import express from 'express';

import { upload } from '../middlewares/upload';
import { uploadImage, deleteImage } from '../controllers/imageController';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete', deleteImage); // expects public_id in body

export default router;
