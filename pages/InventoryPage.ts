import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  addToCartByName(productName: string) {
    return this.page.locator('.inventory_item', { hasText: productName })
      .getByRole('button', { name: 'Add to cart' });
  }

  removeFromCartByName(productName: string) {
    return this.page.locator('.inventory_item', { hasText: productName })
      .getByRole('button', { name: 'Remove' });
  }

  async addProductToCart(productName: string) {
    await this.addToCartByName(productName).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    const map = { az: 'az', za: 'za', lohi: 'lohi', hilo: 'hilo' };
    await this.sortDropdown.selectOption(map[option]);
  }

  async expectCartBadge(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }

  async getAllProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }
}