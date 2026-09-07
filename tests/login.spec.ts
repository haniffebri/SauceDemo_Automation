import { test, expect } from '@playwright/test';


//=====> TC-LOGIN-01


test('TC-LOGIN-01 : login dengan data login yang benar', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});


//=====> TC-LOGIN-02


test('TC-LOGIN-02 : login dengan akun locked out', async ({ page }) => {
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


//=====> TC-LOGIN-03


test('TC-LOGIN-03 : login dengan akun problem user', async ({ page }) => {
   await page.goto('https://www.saucedemo.com/');

  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('problem_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});


//=====> TC-LOGIN-04


test('TC-LOGIN-04 : login dengan akun performance_glitch_user', async ({ page }) => {
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


//=====> TC-LOGIN-05


test('TC-LOGIN-05 : login dengan akun error_user', async ({ page }) => {
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


//=====> TC-LOGIN-06


test('TC-LOGIN-06 : login dengan akun visual_user', async ({ page }) => {
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


//=====> TC-LOGIN-07


test('TC-LOGIN-07 : login dengan akun without fill username', async ({ page }) => {
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


//=====> TC-LOGIN-08


test('TC-LOGIN-08 : login dengan akun without fill password', async ({ page }) => {
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


//=====> TC-LOGIN-09


test('TC-LOGIN-09 : login dengan invalid credential', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill('mi-ongklok');
  await page.locator('#password').fill('ongkloksauce');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});