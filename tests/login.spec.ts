import { test, expect } from '@playwright/test';


//=====> Test Case 1

test('login dengan data login yang benar', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});


//=====> Test Case 2


test('login dengan akun locked out', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.'
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});


//=====> Test Case 3


test('login dengan akun problem user', async ({ page }) => {
   await page.goto('https://www.saucedemo.com/');

  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('problem_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});


//=====> Test Case 4


test('login dengan akun performance_glitch_user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('performance_glitch_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/, {
    timeout: 15000,
  });

  await expect(
    page.locator('[data-test="title"]')
  ).toHaveText('Products');
});


//=====> Test Case 5


test('login dengan akun error_user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('error_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/, {
    timeout: 15000,
  });

  await expect(
    page.locator('[data-test="title"]')
  ).toHaveText('Products');
});


//=====> Test Case 6


test('login dengan akun visual_user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('visual_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/, {
    timeout: 15000,
  });

  await expect(
    page.locator('[data-test="title"]')
  ).toHaveText('Products');
});


//=====> Test Case 7


test('login dengan akun without fill username', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Username is required'
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});


//=====> Test Case 8


test('login dengan akun without fill password', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Password is required'
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});