import express from 'express';
const router = express.Router();
import { articlesTable, articlesSchema } from './schema.ts';
import { db, eq } from '../../index.ts';
import { authenticateJWT } from '../../utils/passport.ts';
import { checkPermissions } from '../../utils/checkPermissions.ts';

router.post('/create', authenticateJWT, checkPermissions('article', 'createOwn'), async (req: any, res: any) => {
  const { title, content } = articlesSchema.parse(req.body)
  const article = await db.insert(articlesTable).values({ title, content, userId: req.user.id }).returning({ id: articlesTable.id, userId: articlesTable.userId, title: articlesTable.title, content: articlesTable.content })
  res.status(200).json({ message: '创建文章成功', article: article[0] })
})
module.exports = router;