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

  test('TC-CHKT-01: Verifikasi user dapat menyelesaikan proses checkout secara penuh dari keranjang hingga pesanan selesai', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('TC-CHKT-02: Verifikasi sistem menolak proses checkout dan menampilkan pesan ketika kolom First Name dikosongkan', async () => {
    await checkoutPage.fillInformation('', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('First Name is required');
  });

  test('TC-CHKT-03: Verifikasi sistem menolak proses checkout dan menampilkan pesan ketika kolom Last Name dikosongkan', async () => {
    await checkoutPage.fillInformation('Bagas', '', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('Last Name is required');
  });

  test('TC-CHKT-04: Verifikasi sistem menolak proses checkout dan menampilkan pesan ketika kolom Postal Code dikosongkan', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '');
    await checkoutPage.continueStep();
    await checkoutPage.expectErrorToContain('Postal Code is required');
  });

  test('TC-CHKT-05: Verifikasi kalkulasi total harga produk, pajak (tax), dan keseluruhan biaya pada halaman ringkasan tampil dengan akurat', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    const { subtotal, tax, total } = await checkoutPage.getTotals();
    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  });

  test('TC-CHKT-06: Verifikasi tombol Cancel berfungsi mengarahkan user kembali ke halaman produk (Inventory) dan membatalkan proses', async ({ page }) => {
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart.html/);
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-CHKT-07: Verifikasi tombol Back Home berfungsi mengarahkan user kembali ke halaman produk setelah pesanan sukses dibuat', async () => {
    await checkoutPage.fillInformation('Bagas', 'Setiawan', '53415');
    await checkoutPage.continueStep();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
    await checkoutPage.backHomeButton.click();
    await inventoryPage.expectCartBadge(0);
  });
});