import { Router } from "express";

import { getPresignedUrl } from "@/controllers/video.controller";

const router = Router();

router.get("/presignedUrl", getPresignedUrl);

export default router;
