// ESM
import { faker } from '@faker-js/faker';
import { articlesTable } from './server/models/article/schema.ts';
import { db } from './server/index.ts';
const generateArticle = () => (
  {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    userId: 22
  }
)

const generateArticles = (count: number) => {
  return Array.from({ length: count }, generateArticle)
}

const seed = async () => {
  const articles = generateArticles(100)
  await db.insert(articlesTable).values(articles).execute()
}
seed()