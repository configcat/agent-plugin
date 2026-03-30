import axios, { AxiosInstance } from "axios";
import type {
  Config,
  ConfigCatClientOptions,
  Environment,
  Product,
  Setting,
  SettingValue,
  UpdateSettingValueModel,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.configcat.com";

export class ConfigCatApiClient {
  private readonly client: AxiosInstance;

  constructor(options: ConfigCatClientOptions) {
    this.client = axios.create({
      baseURL: options.baseUrl ?? DEFAULT_BASE_URL,
      auth: {
        username: "Basic",
        password: options.apiKey,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async listProducts(): Promise<Product[]> {
    const response = await this.client.get<Product[]>("/v1/products");
    return response.data;
  }

  async listConfigs(productId: string): Promise<Config[]> {
    const response = await this.client.get<Config[]>(
      `/v1/products/${productId}/configs`
    );
    return response.data;
  }

  async listSettings(configId: string): Promise<Setting[]> {
    const response = await this.client.get<Setting[]>(
      `/v1/configs/${configId}/settings`
    );
    return response.data;
  }

  async getSetting(settingId: number): Promise<Setting> {
    const response = await this.client.get<Setting>(
      `/v1/settings/${settingId}`
    );
    return response.data;
  }

  async createSetting(
    configId: string,
    data: Omit<Setting, "settingId">
  ): Promise<Setting> {
    const response = await this.client.post<Setting>(
      `/v1/configs/${configId}/settings`,
      data
    );
    return response.data;
  }

  async deleteSetting(settingId: number): Promise<void> {
    await this.client.delete(`/v1/settings/${settingId}`);
  }

  async getSettingValue(
    settingId: number,
    environmentId: string
  ): Promise<SettingValue> {
    const response = await this.client.get<SettingValue>(
      `/v1/settings/${settingId}/value`,
      { params: { environmentId } }
    );
    return response.data;
  }

  async updateSettingValue(
    settingId: number,
    environmentId: string,
    data: UpdateSettingValueModel,
    reason?: string
  ): Promise<SettingValue> {
    const params: Record<string, string> = { environmentId };
    if (reason) {
      params["reason"] = reason;
    }
    const response = await this.client.put<SettingValue>(
      `/v1/settings/${settingId}/value`,
      data,
      { params }
    );
    return response.data;
  }

  async listEnvironments(productId: string): Promise<Environment[]> {
    const response = await this.client.get<Environment[]>(
      `/v1/products/${productId}/environments`
    );
    return response.data;
  }
}
