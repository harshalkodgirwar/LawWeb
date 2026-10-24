import { SEED_PRODUCTS, SEED_PROFILE_CONFIG } from "./seed-data";
import { Product } from "./types";

// Server runtime in-memory stores ensuring changes persist across route navigations
// even in local development or before production Supabase connection is established.

class ServerStore {
  private static instance: ServerStore;
  private profileContent: any = { ...SEED_PROFILE_CONFIG };
  private products: Product[] = [...SEED_PRODUCTS];

  private constructor() {}

  public static getInstance(): ServerStore {
    if (!ServerStore.instance) {
      ServerStore.instance = new ServerStore();
    }
    return ServerStore.instance;
  }

  // Profile Methods
  public getProfile(): any {
    return this.profileContent;
  }

  public updateProfile(content: any): any {
    this.profileContent = { ...this.profileContent, ...content };
    return this.profileContent;
  }

  public resetProfile(): any {
    this.profileContent = { ...SEED_PROFILE_CONFIG };
    return this.profileContent;
  }

  // Product Methods
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public saveProduct(product: Product): Product {
    const existingIndex = this.products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = { ...this.products[existingIndex], ...product };
      return this.products[existingIndex];
    } else {
      this.products.unshift(product);
      return product;
    }
  }

  public toggleProductPublish(id: string): Product | null {
    const prod = this.products.find((p) => p.id === id);
    if (prod) {
      prod.is_published = !prod.is_published;
      prod.updated_at = new Date().toISOString();
      return prod;
    }
    return null;
  }
}

export const serverStore = ServerStore.getInstance();
