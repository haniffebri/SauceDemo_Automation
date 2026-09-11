import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../fixtures/user.fixture.json';

test.describe('Module: Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC-LOGIN-01
  test('TC-LOGIN-01: Verifikasi user dapat login dengan kredensial valid menggunakan standart_user', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.expectLoggedIn();
  });

  // TC-LOGIN-02
  test('TC-LOGIN-02: Verifikasi sistem menolak akses login untuk user yang telah dikunci (locked_out_user)', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectErrorToContain('Sorry, this user has been locked out');
  });

  // TC-LOGIN-03
  test('TC-LOGIN-03: Verifikasi user dapat login dengan kredensial valid menggunakan problem_user', async () => {
    await loginPage.login(users.problem.username, users.problem.password);
    await loginPage.expectLoggedIn();
  });

  // TC-LOGIN-04
  test('TC-LOGIN-04: Verifikasi user dapat login dengan kredensial valid menggunakan performance_glitch_user', async () => {
    await loginPage.login(users.performanceGlitch.username, users.standard.password);
    await loginPage.expectLoggedIn();
  });

  // TC-LOGIN-05
  test('TC-LOGIN-05: Verifikasi user dapat login dengan kredensial menggunakan error_user', async () => {
    await loginPage.login(users.errorUser.username, users.standard.password);
    await loginPage.expectLoggedIn();
  });

  // TC-LOGIN-06
  test('TC-LOGIN-06: Verifikasi user dapat login dengan kredensial menggunakan visual_user', async () => {
    await loginPage.login(users.visualUser.username, users.standard.password);
    await loginPage.expectLoggedIn();
  });

  // TC-LOGIN-07
  test('TC-LOGIN-07: Verifikasi validasi saat field username dikosongkan', async () => {
    await loginPage.login('', users.standard.password);
    await loginPage.expectErrorToContain('Epic sadface: Username is required');
  });

  // TC-LOGIN-08
  test('TC-LOGIN-08: Verifikasi validasi saat field password dikosongkan', async () => {
    await loginPage.login(users.standard.username, '');
    await loginPage.expectErrorToContain('Epic sadface: Password is required');
  });

  // TC-LOGIN-09
  test('TC-LOGIN-09: Verifikasi sistem menolak login dengan invalid credential', async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectErrorToContain('Epic sadface: Username and password do not match any user in this service');
  });
});