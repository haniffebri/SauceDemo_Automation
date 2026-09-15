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
 
  test('TC-INV-01: Verifikasi katalog daftar produk tampil dengan benar dan memuat 6 produk', async () => {
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('TC-INV-02: Verifikasi sistem berhasil mengurutkan daftar produk berdasarkan Nama (A ke Z)', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('TC-INV-03: Verifikasi sistem berhasil mengurutkan daftar produk berdasarkan Nama (Z ke A)', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC-INV-04: Verifikasi sistem berhasil mengurutkan daftar produk berdasarkan Harga (Termurah ke Termahal)', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-05: Verifikasi sistem berhasil mengurutkan daftar produk berdasarkan Harga (Termahal ke Termurah)', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-06: Verifikasi penambahan 1 produk ke keranjang memperbarui indikator badge keranjang menjadi 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
  });

  test('TC-INV-07: Verifikasi penambahan 2 produk ke keranjang memperbarui indikator badge keranjang menjadi 2', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
  });

  test('TC-INV-08: Verifikasi penambahan 3 produk ke keranjang memperbarui indikator badge keranjang menjadi 3', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartBadge(3);
  });

  test('TC-INV-09: Verifikasi penghapusan 1 produk dari keranjang mengurangi nilai badge dengan benar', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(0);
  });

  test('TC-INV-10: Verifikasi penghapusan 1 produk dari total 2 produk memperbarui sisa badge menjadi 1', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await inventoryPage.expectCartBadge(1);
  });
});