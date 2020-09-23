'use strict';

import express from 'express'
import Project from '../controller/project'
const router = express.Router()

router.get('/list', Project.list);
router.post('/add', Project.add);
router.post('/edit', Project.edit);

export default router