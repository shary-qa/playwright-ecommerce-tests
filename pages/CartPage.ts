import { Page, Locator } from '@playwright/test';

/** Shopping cart. */
export class CartPage {
  readonly items: Locator;
  readonly names: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(private page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
