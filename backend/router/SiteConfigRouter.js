import express from "express"
import { getSiteConfig, updateSiteConfig } from "../controller/SiteConfigController.js"

const SiteConfigRouter = express.Router()
SiteConfigRouter.get('/', getSiteConfig)
SiteConfigRouter.patch('/:id', updateSiteConfig)

export default SiteConfigRouter