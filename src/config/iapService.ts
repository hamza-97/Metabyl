import {
  initConnection,
  getSubscriptions,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  requestPurchase,
  getAvailablePurchases,
  endConnection,
  Product,
  Subscription,
  Purchase,
  PurchaseError,
} from 'react-native-iap';

// Product identifiers - Replace with your actual product IDs
export const PRODUCT_IDS = {
  WEEKLY_SUBSCRIPTION: 'weekly_subscription',
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  YEARLY_SUBSCRIPTION: 'yearly_subscription',
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  isPopular?: boolean;
  productId: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: '$2.99',
    period: 'per week',
    productId: PRODUCT_IDS.WEEKLY_SUBSCRIPTION,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    isPopular: true,
    productId: PRODUCT_IDS.MONTHLY_SUBSCRIPTION,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$99.99',
    period: 'per year',
    productId: PRODUCT_IDS.YEARLY_SUBSCRIPTION,
  },
];

class IAPService {
  private static instance: IAPService;
  private isInitialized = false;
  private products: Product[] = [];
  private subscriptions: Subscription[] = [];

  private constructor() {}

  static getInstance(): IAPService {
    if (!IAPService.instance) {
      IAPService.instance = new IAPService();
    }
    return IAPService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize IAP connection
      await initConnection();

      // Set up listeners
      this.setupListeners();

      // Fetch available products
      await this.fetchProducts();

      this.isInitialized = true;
      console.log('IAP initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
      throw error;
    }
  }

  private setupListeners(): void {
    // Listen for purchase updates
    purchaseUpdatedListener((purchase: Purchase) => {
      console.log('Purchase updated:', purchase);
      // Handle successful purchase
      this.handleSuccessfulPurchase(purchase);
    });

    // Listen for purchase errors
    purchaseErrorListener((error: PurchaseError) => {
      console.error('Purchase error:', error);
      // Handle purchase error
      this.handlePurchaseError(error);
    });
  }

  private async fetchProducts(): Promise<void> {
    try {
      // Get subscription products
      const productIds = Object.values(PRODUCT_IDS);
      this.subscriptions = await getSubscriptions({ skus: productIds });
      console.log('Fetched subscriptions:', this.subscriptions);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  private async handleSuccessfulPurchase(purchase: Purchase): Promise<void> {
    try {
      // Finish the transaction
      await finishTransaction({ purchase });
      console.log('Purchase completed successfully');
    } catch (error) {
      console.error('Failed to finish transaction:', error);
    }
  }

  private handlePurchaseError(error: PurchaseError): void {
    console.error('Purchase error:', error);
    // You can implement custom error handling here
  }

  async purchaseSubscription(productId: string): Promise<boolean> {
    try {
      await this.ensureInitialized();

      // Find the subscription
      const subscription = this.subscriptions.find(
        sub => sub.productId === productId,
      );
      if (!subscription) {
        console.error('Subscription not found:', productId);
        return false;
      }

      // Purchase the subscription
      await requestPurchase({ sku: productId });
      return true;
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      return false;
    }
  }

  async getAvailablePurchases(): Promise<Purchase[]> {
    try {
      await this.ensureInitialized();
      return await getAvailablePurchases();
    } catch (error) {
      console.error('Failed to get available purchases:', error);
      return [];
    }
  }

  async checkIfUserHasActiveSubscription(): Promise<boolean> {
    try {
      const purchases = await this.getAvailablePurchases();
      // Check if user has any active subscriptions
      return purchases.length > 0;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  async getActiveSubscriptionPlan(): Promise<string | null> {
    try {
      const purchases = await this.getAvailablePurchases();

      // Find the most recent active subscription
      const activePurchase = purchases[0]; // Get the first available purchase

      if (activePurchase) {
        // Map the product identifier to our plan ID
        const plan = SUBSCRIPTION_PLANS.find(
          p => p.productId === activePurchase.productId,
        );
        return plan?.id || null;
      }

      return null;
    } catch (error) {
      console.error('Failed to get active subscription plan:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      await this.ensureInitialized();

      // Get available purchases (this includes restored purchases)
      const purchases = await this.getAvailablePurchases();

      // Check if there are any restored purchases
      return purchases.length > 0;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  getProductById(productId: string): Subscription | null {
    return this.subscriptions.find(sub => sub.productId === productId) || null;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async cleanup(): Promise<void> {
    try {
      await endConnection();
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup IAP:', error);
    }
  }
}

export default IAPService.getInstance();
