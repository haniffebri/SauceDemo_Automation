import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../fixtures/user.fixture.json';

test.describe('Module: Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    checkoutPage = new CheckoutPage(page);
  });

  test('TC-CHKT-01: checkout sukses end-to-end', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('TC-CHKT-02: validasi First Name kosong', async () => {
    await checkoutPage.fillInformation('', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('First Name is required');
  });

  test('TC-CHKT-03: validasi Last Name kosong', async () => {
    await checkoutPage.fillInformation('Bagas', '', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('Last Name is required');
  });

  test('TC-CHKT-04: validasi Postal Code kosong', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('Postal Code is required');
  });

  test('TC-CHKT-05: verifikasi kalkulasi total harga (subtotal + tax = total)', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    const { subtotal, tax, total } = await checkoutPage.getTotals();
    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  });

  // CHK-06
  test('TC-CHKT-06: cancel checkout kembali ke inventory, cart tetap terisi', async ({ page }) => {
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart.html/);
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-CHKT-07: back home setelah order complete, cart kosong', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
    await checkoutPage.backHomeButton.click();
    await inventoryPage.expectCartBadge(0);
  });
});