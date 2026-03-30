import { jest } from "@jest/globals";
import type { ConfigCatApiClient as ConfigCatApiClientType } from "../configcat-api.js";
import type { Config, Environment, Product, Setting, SettingValue } from "../types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGet = jest.fn<() => Promise<any>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPost = jest.fn<() => Promise<any>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPut = jest.fn<() => Promise<any>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDelete = jest.fn<() => Promise<any>>();

jest.unstable_mockModule("axios", () => ({
  default: {
    create: jest.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    })),
  },
}));

// Import after mock is set up
const { ConfigCatApiClient } = await import("../configcat-api.js");

describe("ConfigCatApiClient", () => {
  let client: ConfigCatApiClientType;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new ConfigCatApiClient({ apiKey: "test-api-key" });
  });

  describe("listProducts", () => {
    it("should return a list of products", async () => {
      const products: Product[] = [
        { productId: "prod-1", name: "My Product" },
      ];
      mockGet.mockResolvedValueOnce({ data: products });

      const result = await client.listProducts();

      expect(mockGet).toHaveBeenCalledWith("/v1/products");
      expect(result).toEqual(products);
    });
  });

  describe("listConfigs", () => {
    it("should return a list of configs for a product", async () => {
      const configs: Config[] = [
        { configId: "cfg-1", name: "Main Config" },
      ];
      mockGet.mockResolvedValueOnce({ data: configs });

      const result = await client.listConfigs("prod-1");

      expect(mockGet).toHaveBeenCalledWith("/v1/products/prod-1/configs");
      expect(result).toEqual(configs);
    });
  });

  describe("listSettings", () => {
    it("should return a list of feature flag settings for a config", async () => {
      const settings: Setting[] = [
        { settingId: 1, key: "my_flag", name: "My Flag", settingType: 0 },
      ];
      mockGet.mockResolvedValueOnce({ data: settings });

      const result = await client.listSettings("cfg-1");

      expect(mockGet).toHaveBeenCalledWith("/v1/configs/cfg-1/settings");
      expect(result).toEqual(settings);
    });
  });

  describe("getSetting", () => {
    it("should return details of a specific setting", async () => {
      const setting: Setting = {
        settingId: 42,
        key: "my_flag",
        name: "My Flag",
        settingType: 0,
      };
      mockGet.mockResolvedValueOnce({ data: setting });

      const result = await client.getSetting(42);

      expect(mockGet).toHaveBeenCalledWith("/v1/settings/42");
      expect(result).toEqual(setting);
    });
  });

  describe("createSetting", () => {
    it("should create a new feature flag setting", async () => {
      const newSetting: Setting = {
        settingId: 99,
        key: "new_flag",
        name: "New Flag",
        settingType: 0,
      };
      mockPost.mockResolvedValueOnce({ data: newSetting });

      const result = await client.createSetting("cfg-1", {
        key: "new_flag",
        name: "New Flag",
        settingType: 0,
      });

      expect(mockPost).toHaveBeenCalledWith("/v1/configs/cfg-1/settings", {
        key: "new_flag",
        name: "New Flag",
        settingType: 0,
      });
      expect(result).toEqual(newSetting);
    });
  });

  describe("deleteSetting", () => {
    it("should delete a feature flag setting", async () => {
      mockDelete.mockResolvedValueOnce({});

      await client.deleteSetting(42);

      expect(mockDelete).toHaveBeenCalledWith("/v1/settings/42");
    });
  });

  describe("getSettingValue", () => {
    it("should return the value of a setting for an environment", async () => {
      const value: SettingValue = { value: true };
      mockGet.mockResolvedValueOnce({ data: value });

      const result = await client.getSettingValue(42, "env-1");

      expect(mockGet).toHaveBeenCalledWith("/v1/settings/42/value", {
        params: { environmentId: "env-1" },
      });
      expect(result).toEqual(value);
    });
  });

  describe("updateSettingValue", () => {
    it("should update the value of a setting for an environment", async () => {
      const updated: SettingValue = { value: false };
      mockPut.mockResolvedValueOnce({ data: updated });

      const result = await client.updateSettingValue(
        42,
        "env-1",
        { value: false }
      );

      expect(mockPut).toHaveBeenCalledWith(
        "/v1/settings/42/value",
        { value: false },
        { params: { environmentId: "env-1" } }
      );
      expect(result).toEqual(updated);
    });

    it("should include reason when provided", async () => {
      const updated: SettingValue = { value: true };
      mockPut.mockResolvedValueOnce({ data: updated });

      await client.updateSettingValue(42, "env-1", { value: true }, "Enabling for release");

      expect(mockPut).toHaveBeenCalledWith(
        "/v1/settings/42/value",
        { value: true },
        { params: { environmentId: "env-1", reason: "Enabling for release" } }
      );
    });
  });

  describe("listEnvironments", () => {
    it("should return a list of environments for a product", async () => {
      const environments: Environment[] = [
        { environmentId: "env-1", name: "Production" },
        { environmentId: "env-2", name: "Staging" },
      ];
      mockGet.mockResolvedValueOnce({ data: environments });

      const result = await client.listEnvironments("prod-1");

      expect(mockGet).toHaveBeenCalledWith(
        "/v1/products/prod-1/environments"
      );
      expect(result).toEqual(environments);
    });
  });
});
