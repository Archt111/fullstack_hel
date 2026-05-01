const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlogWithDetails } = require('./helper')

describe('Blog app', () => {
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

  describe('Login', () => {
    test('5.18: succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('5.18: fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('5.19: a new blog can be created', async ({ page }) => {
      await createBlogWithDetails(page, 'Test Blog via E2E', 'E2E Author', 'https://e2e.test')
      await expect(page.getByText('Test Blog via E2E E2E Author')).toBeVisible()
    })

    test('5.20: a blog can be liked', async ({ page }) => {
      await createBlogWithDetails(page, 'Likeable Blog', 'E2E Author', 'https://e2e.test')

      const blogEl = page.getByText('Likeable Blog').locator('..')
      await blogEl.getByRole('button', { name: 'view' }).click()

      const likeButton = blogEl.getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(blogEl.getByText(/likes 1/)).toBeVisible()
    })
  })
})
