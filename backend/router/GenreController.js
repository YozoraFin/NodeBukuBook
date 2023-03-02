import express from 'express'
import { createGenre, deleteGenre, getDetailGenre, getGenre, updateGenre } from '../controller/GenreController.js'

const GenreRouter = express.Router()

GenreRouter.get('/', getGenre)
GenreRouter.get('/:id', getDetailGenre)
GenreRouter.post('/', createGenre)
GenreRouter.patch('/:id', updateGenre)
GenreRouter.delete('/:id', deleteGenre)

export default GenreRouter