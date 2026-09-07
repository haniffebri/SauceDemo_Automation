import { test, expect } from '@playwright/test';

test('login gagal dengan password salah', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('password_salah');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});