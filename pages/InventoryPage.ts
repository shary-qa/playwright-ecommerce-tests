import { Page, Locator, expect } from '@playwright/test';

/** Product list shown after login. */
export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  /** The product card whose name is exactly `name`. */
  item(name: string) {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async priceList(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map(t => Number(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
