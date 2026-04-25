// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should display validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    
    // Click the submit button without filling fields
    await page.locator('button[type="submit"]').click();

    // Verify error messages appear
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should validate SLIIT email format', async ({ page }) => {
    await page.goto('/login');
    
    // Fill invalid email
    await page.getByPlaceholder('yourname@my.sliit.lk').fill('test@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    await page.locator('button[type="submit"]').click();

    // Verify SLIIT email error
    await expect(page.getByText('Use your SLIIT university email (@my.sliit.lk)')).toBeVisible();
  });

  test('should successfully log in with default student account', async ({ page }) => {
    // This assumes the backend is running and the database is seeded or the account exists
    await page.goto('/login');
    
    await page.getByPlaceholder('yourname@my.sliit.lk').fill('it23164444@my.sliit.lk');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    await page.locator('button[type="submit"]').click();

    // Verify successful login transition (e.g., success message or redirect to dashboard)
    await expect(page.getByText('Welcome to the Student Portal!')).toBeVisible({ timeout: 5000 });
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('admin role toggle changes styling and text', async ({ page }) => {
    await page.goto('/login');
    
    // Click Admin toggle
    await page.getByRole('button', { name: /Admin$/ }).click();

    // Verify button text changed to Admin Sign In
    await expect(page.getByRole('button', { name: 'Admin Sign In' })).toBeVisible();
    
    // Verify warning message appears
    await expect(page.getByText('Admin access is restricted and monitored.')).toBeVisible();
  });

});
