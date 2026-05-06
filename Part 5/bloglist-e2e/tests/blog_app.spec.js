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

test('5.17: Login form is shown', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
})

test('5.18: Login succeeds with correct credentials', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
})

test('5.18: Login fails with wrong credentials', async ({ page }) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill('wrongpassword')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('invalid')
})

test('5.19: a new blog can be created', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, 'Test Blog', 'Author', 'http://test.com')
  await expect(page.getByText('Test Blog Author')).toBeVisible()
})

test('5.20: a blog can be liked', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, 'Likeable Blog', 'Author', 'http://test.com')

  const blogEl = page.locator('.blog').filter({ hasText: 'Likeable Blog' })
  await blogEl.getByRole('button', { name: 'view' }).click()

  await blogEl.getByRole('button', { name: 'like' }).click()
  await expect(blogEl.getByText('likes 1')).toBeVisible()
})

test('5.21: a blog can be deleted by the user who created it', async ({ page }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, 'Deletable Blog', 'Author', 'http://test.com')

  const blogEl = page.locator('.blog').filter({ hasText: 'Deletable Blog' })
  await blogEl.getByRole('button', { name: 'view' }).click()

  page.on('dialog', dialog => dialog.accept())

  await blogEl.getByRole('button', { name: 'remove' }).click()
  await expect(page.locator('.blog').filter({ hasText: 'Deletable Blog' })).not.toBeVisible()
})

test('5.22: only the creator can see the delete button', async ({ page, request }) => {
  await loginWith(page, 'mluukkai', 'salainen')
  await createBlogWithDetails(page, 'Matti Blog', 'Matti', 'http://test.com')

  await request.post('/api/users', {
    data: { name: 'Second User', username: 'second', password: 'password123' }
  })

  await page.getByRole('button', { name: 'logout' }).click()
  await loginWith(page, 'second', 'password123')

  const blogEl = page.locator('.blog').filter({ hasText: 'Matti Blog' })
  await blogEl.getByRole('button', { name: 'view' }).click()

  await expect(blogEl.getByRole('button', { name: 'remove' })).not.toBeVisible()
})

