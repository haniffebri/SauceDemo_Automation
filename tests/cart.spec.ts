import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/user.fixture.json';

test.describe('Module: Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });
 
  test('TC-CART-01: Verifikasi sistem berhasil menambahkan 1 produk ke dalam keranjang dan memperbarui ikon badge', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);

    await inventoryPage.goToCart();
    await expect(cartPage.productNames).toBeVisible;
  });

  test('TC-CART-02: Verifikasi sistem berhasil menambahkan 2 produk secara akumulatif ke dalam keranjang', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-CART-03: Verifikasi sistem berhasil menambahkan 3 produk secara akumulatif ke dalam keranjang', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartBadge(3);
  });

  test('TC-CART-04: Verifikasi sistem berhasil menghapus 1 produk dari keranjang dan memperbarui badge', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(0);
  });

  test('TC-CART-05: Verifikasi sistem berhasil menghapus 1 produk dari total 2 produk dan menyisakan 1 di keranjang', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(1);
  });
});