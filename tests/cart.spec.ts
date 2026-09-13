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
 
  test('TC-CART-01: tambah 1 produk ke cart, produk bertambah 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);

    await inventoryPage.goToCart();
    await expect(cartPage.productNames).toBeVisible;
  });

  test('TC-CART-02: tambah 2 produk ke cart, produk bertambah 2', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-CART-03: tambah 3 produk ke cart, produk bertambah 3', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartBadge(3);
  });

  test('TC-CART-04: hapus 1 produk dari total 1, keranjang kosong', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(0);
  });

  test('TC-CART-05: hapus 1 produk dari total 2 produk, produk sisa 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(1);
  });
});