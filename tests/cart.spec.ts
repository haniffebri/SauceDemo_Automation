import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/user.fixture.json';

test.describe('Module: Inventory & Cart', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
  });
 
  test('CART-01: tambah 1 produk ke cart, badge = 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
  });

  test('CART-02: tambah 3 produk ke cart, badge = 3', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartBadge(3);
  });

  test('CART-03: hapus produk dari inventory page, badge berkurang', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(0);
  });

  // CART-04
  test('CART-04: hapus produk dari halaman cart', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.expectItemCount(1);
    await cartPage.removeItem('Sauce Labs Backpack');
    await cartPage.expectItemCount(0);
  });
});