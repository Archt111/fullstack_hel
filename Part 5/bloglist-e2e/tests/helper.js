const loginWith = async (page, username, password) => {
  // await page.getByRole('button', { name: 'login' }).click()
  await page.getByRole('link', { name: 'login' }).click()
  await page.locator('input[type="text"]').fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlogWithDetails = async (page, title, author, url) => {
  // await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('link', { name: title }).waitFor()
}

module.exports = { loginWith, createBlogWithDetails }
