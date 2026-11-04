import fs from "fs";
import path from "path";
import { SEED_PRODUCTS, SEED_PROFILE_CONFIG } from "./seed-data";
import { Product } from "./types";

const CACHE_FILE = path.join(process.cwd(), ".server_store_cache.json");

interface StoreData {
  profile: any;
  products: Product[];
}

function loadInitialData(): StoreData {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return {
    profile: { ...SEED_PROFILE_CONFIG },
    products: [...SEED_PRODUCTS],
  };
}

function persistData(data: StoreData) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

class ServerStore {
  private data: StoreData;

  constructor() {
    const globalObj = globalThis as any;
    if (globalObj.__lawyer_store_data) {
      this.data = globalObj.__lawyer_store_data;
    } else {
      this.data = loadInitialData();
      globalObj.__lawyer_store_data = this.data;
    }
  }

  private refreshFromDisk() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products)) {
          this.data = parsed;
          (globalThis as any).__lawyer_store_data = this.data;
        }
      }
    } catch {
      // ignore
    }
  }

  // Profile Methods
  public getProfile(): any {
    this.refreshFromDisk();
    return this.data.profile;
  }

  public updateProfile(content: any): any {
    this.refreshFromDisk();
    this.data.profile = { ...this.data.profile, ...content };
    persistData(this.data);
    return this.data.profile;
  }

  public resetProfile(): any {
    this.data.profile = { ...SEED_PROFILE_CONFIG };
    persistData(this.data);
    return this.data.profile;
  }

  // Product Methods
  public getProducts(): Product[] {
    this.refreshFromDisk();
    return [...this.data.products];
  }

  public getProductBySlug(slug: string): Product | undefined {
    this.refreshFromDisk();
    return this.data.products.find((p) => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    this.refreshFromDisk();
    return this.data.products.find((p) => p.id === id);
  }

  public saveProduct(product: Product): Product {
    this.refreshFromDisk();
    const existingIndex = this.data.products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      this.data.products[existingIndex] = { ...this.data.products[existingIndex], ...product };
      persistData(this.data);
      return this.data.products[existingIndex];
    } else {
      this.data.products.unshift(product);
      persistData(this.data);
      return product;
    }
  }

  public toggleProductPublish(id: string): Product | null {
    this.refreshFromDisk();
    const prod = this.data.products.find((p) => p.id === id);
    if (prod) {
      prod.is_published = !prod.is_published;
      prod.updated_at = new Date().toISOString();
      persistData(this.data);
      return prod;
    }
    return null;
  }
}

export const serverStore = new ServerStore();
