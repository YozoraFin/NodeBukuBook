import express from 'express';
import { createSocial, deleteSocial, getSocial, getSocialDetail, updateSocial } from '../controller/SocialController.js';

const SocialRouter = express.Router()
SocialRouter.get('/', getSocial)
SocialRouter.get('/:id', getSocialDetail)
SocialRouter.post('/', createSocial)
SocialRouter.patch('/:id', updateSocial)
SocialRouter.delete('/:id', deleteSocial)

export default SocialRouter