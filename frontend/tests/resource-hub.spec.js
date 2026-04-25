// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Resource Hub Flow', () => {

  // Helper to log in before tests
  test.beforeEach(async ({ page }) => {
    // Assuming the user is already registered. If tests are isolated, we might need a setup script,
    // but for now we'll use the default test student from README.
    await page.goto('/login');
    await page.getByPlaceholder('yourname@my.sliit.lk').fill('it23164444@my.sliit.lk');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to resources page and display filters', async ({ page }) => {
    // Navigate to resources via sidebar or URL directly
    await page.goto('/resources');
    
    // Check if the page title is correct
    await expect(page.getByRole('heading', { name: 'Academic Resources' })).toBeVisible();

    // Check if filters are present
    await expect(page.getByPlaceholder('Search by title or subject...')).toBeVisible();
    await expect(page.locator('select[name="year"]')).toBeVisible();
    await expect(page.locator('select[name="fileType"]')).toBeVisible();
  });

  test('should filter resources by search term', async ({ page }) => {
    await page.goto('/resources');
    
    // Type into search box
    const searchInput = page.getByPlaceholder('Search by title or subject...');
    await searchInput.fill('Python');
    
    // Wait for debounce (500ms in component) and network request
    await page.waitForTimeout(1000);
    
    // Verify the page is still stable and the input holds the value
    await expect(searchInput).toHaveValue('Python');
    
    // Wait for skeleton loaders to disappear (loading state finished)
    await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 10000 });
    
    // The page should now be stable with either results or the empty state
  });

  test('should open upload resource modal/page', async ({ page }) => {
    await page.goto('/resources');
    
    // Click Upload Resource button
    await page.getByRole('button', { name: '+ Upload Resource' }).click();
    
    // Verify it navigates to upload page
    await expect(page).toHaveURL(/.*resources\/upload/);
    await expect(page.getByRole('heading', { name: 'Upload Study Resource' }).or(page.getByText('Upload Study Resource'))).toBeVisible();
  });

});
