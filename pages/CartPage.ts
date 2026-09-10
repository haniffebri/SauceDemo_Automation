import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  removeItemByName(productName: string) {
    return this.page.locator('.cart_item', { hasText: productName })
      .getByRole('button', { name: 'Remove' });
  }

  async removeItem(productName: string) {
    await this.removeItemByName(productName).click();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}