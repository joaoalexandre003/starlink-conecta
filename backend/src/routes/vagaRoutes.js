import { Router } from 'express'
import { buscarVaga, listarVagas } from '../controllers/vagaController.js'

const router = Router()

router.get('/', listarVagas)
router.get('/:id', buscarVaga)

export default router
