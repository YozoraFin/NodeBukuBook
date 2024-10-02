import express from "express"
import { getSiteConfig, updateSiteConfig } from "../controller/SiteConfigController.js"

const SiteConfigRouter = express.Router()
SiteConfigRouter.get('/', getSiteConfig)
SiteConfigRouter.patch('/', updateSiteConfig)

export default SiteConfigRouter