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
router.get('/list', authenticateJWT, checkPermissions('article', 'readOwn'), async (req: any, res: any) => {
  console.log(req, 'req.pagination');
  const { page, limit, } = req.query
  // 获取当前页文章
  const articles = await db.select().from(articlesTable).where(eq(articlesTable.userId, req.user.id)).offset((page - 1) * limit).limit(limit)
  // 获取所有文章数量
  const allArticles = await db.select().from(articlesTable).where(eq(articlesTable.userId, req.user.id))
  res.status(200).json({
    message: '获取文章列表成功', articles: articles, pagination: {
      total: articles.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(allArticles.length / limit)
    }
  })
})
module.exports = router;