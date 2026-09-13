import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../fixtures/user.fixture.json';

test.describe('Module: Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
  });
 
  test('TC-INV-01: daftar produk tampil (6 item)', async () => {
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('TC-INV-02: sorting produk A-Z terurut benar', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC-INV-03: sorting produk Z-A terurut benar', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC-INV-04: sorting harga rendah-tinggi', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-05: sorting harga tinggi-rendah', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-06: tambah 1 produk ke cart, badge = 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
  });

  test('TC-INV-07: tambah 2 produk ke cart, badge = 2', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-INV-08: tambah 3 produk ke cart, badge = 3', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartBadge(3);
  });

  test('TC-INV-09: hapus 1 produk dari inventory page, badge berkurang jadi 0', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(0);
  });

  test('TC-INV-10: hapus 1 produk dari total 2 dari inventory page, badge berkurang jadi 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(1);
  });
});