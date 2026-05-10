const { test, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlogWithDetails } = require('./helper')

beforeEach(async ({ page, request }) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
  })
  await page.goto('/')
})

test('login succeeds with correct creds', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
})

test('login fails with wrong creds', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'wrongpassword')
  await expect(page.getByText('wrong credentials')).toBeVisible()
})

test('a logged user can create a blog', async ({ page }) => {
  const title = `Test Blog ${Date.now()}`
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, title, 'Author', 'http://test.com')
  //await expect(page.getByText('Test Blog Author')).toBeVisible()
  await expect(page.getByRole('link', { name: title })).toBeVisible()
})

test('a logged user can like blogs', async ({ page }) => {
  const title = `Likeable Blog ${Date.now()}`
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, title, 'Author', 'http://test.com')

  await page.getByRole('link', { name: title }).click()
  await page.getByRole('button', { name: 'like' }).click()
  await expect(page.getByText('likes 1')).toBeVisible()
})

test('a logged user can delete a blog', async ({ page }) => {
  const title = `Deletable Blog ${Date.now()}`
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, title, 'Author', 'http://test.com')

  await page.getByRole('link', { name: title }).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'remove' }).click()
  await expect(page.getByRole('link', { name: title })).not.toBeVisible()
})
