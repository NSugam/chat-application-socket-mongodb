import { Router } from "express";
import groupModel from "../models/groupModel";
const router = Router();

router.get('/all', async (req: any, res: any) => {
    const allGroups = await groupModel.find({})
    .populate("created_by", "username email -_id");

    return res.status(200).json({ message: `All Groups`, success: true, allGroups });
});

router.post('/add', async (req: any, res: any) => {
    const { group_name } = req.body
    const created_by = req.user

    const allGroups = await groupModel.create({ group_name, created_by })

    return res.status(200).json({ message: `New group Created`, success: true, allGroups })
})

module.exports = router;