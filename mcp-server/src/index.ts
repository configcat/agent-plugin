#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ConfigCatApiClient } from "./configcat-api.js";
import { TOOLS } from "./tools.js";
import type { SettingType, UpdateSettingValueModel } from "./types.js";

const SETTING_TYPE_MAP: Record<string, SettingType> = {
  boolean: 0,
  string: 1,
  int: 2,
  double: 3,
};

function getApiKey(): string {
  const key = process.env["CONFIGCAT_API_KEY"];
  if (!key) {
    throw new Error(
      "CONFIGCAT_API_KEY environment variable is required. " +
        "You can find your API key at https://app.configcat.com/my-account/public-api-credentials"
    );
  }
  return key;
}

function formatResult(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

async function main(): Promise<void> {
  const apiKey = getApiKey();
  const baseUrl = process.env["CONFIGCAT_BASE_URL"];

  const configCatClient = new ConfigCatApiClient({
    apiKey,
    ...(baseUrl ? { baseUrl } : {}),
  });

  const server = new Server(
    {
      name: "configcat-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const toolArgs = (args ?? {}) as Record<string, unknown>;

    try {
      switch (name) {
        case "list_products": {
          const products = await configCatClient.listProducts();
          return {
            content: [{ type: "text", text: formatResult(products) }],
          };
        }

        case "list_configs": {
          const productId = toolArgs["product_id"] as string;
          const configs = await configCatClient.listConfigs(productId);
          return {
            content: [{ type: "text", text: formatResult(configs) }],
          };
        }

        case "list_feature_flags": {
          const configId = toolArgs["config_id"] as string;
          const settings = await configCatClient.listSettings(configId);
          return {
            content: [{ type: "text", text: formatResult(settings) }],
          };
        }

        case "get_feature_flag": {
          const settingId = toolArgs["setting_id"] as number;
          const setting = await configCatClient.getSetting(settingId);
          return {
            content: [{ type: "text", text: formatResult(setting) }],
          };
        }

        case "create_feature_flag": {
          const configId = toolArgs["config_id"] as string;
          const settingTypeName = toolArgs["setting_type"] as string;
          const settingType = SETTING_TYPE_MAP[settingTypeName];
          if (settingType === undefined) {
            throw new Error(
              `Invalid setting_type '${settingTypeName}'. Must be one of: boolean, string, int, double`
            );
          }
          const newSetting = await configCatClient.createSetting(configId, {
            key: toolArgs["key"] as string,
            name: toolArgs["name"] as string,
            hint: toolArgs["hint"] as string | undefined,
            settingType: settingType as SettingType,
          });
          return {
            content: [{ type: "text", text: formatResult(newSetting) }],
          };
        }

        case "delete_feature_flag": {
          const settingId = toolArgs["setting_id"] as number;
          await configCatClient.deleteSetting(settingId);
          return {
            content: [
              {
                type: "text",
                text: `Feature flag with ID ${settingId} was successfully deleted.`,
              },
            ],
          };
        }

        case "get_flag_value": {
          const settingId = toolArgs["setting_id"] as number;
          const environmentId = toolArgs["environment_id"] as string;
          const value = await configCatClient.getSettingValue(
            settingId,
            environmentId
          );
          return {
            content: [{ type: "text", text: formatResult(value) }],
          };
        }

        case "update_flag_value": {
          const settingId = toolArgs["setting_id"] as number;
          const environmentId = toolArgs["environment_id"] as string;
          const reason = toolArgs["reason"] as string | undefined;
          const updateData: UpdateSettingValueModel = {
            value: toolArgs["value"],
          };
          const updated = await configCatClient.updateSettingValue(
            settingId,
            environmentId,
            updateData,
            reason
          );
          return {
            content: [{ type: "text", text: formatResult(updated) }],
          };
        }

        case "list_environments": {
          const productId = toolArgs["product_id"] as string;
          const environments =
            await configCatClient.listEnvironments(productId);
          return {
            content: [{ type: "text", text: formatResult(environments) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Fatal error: ${message}\n`);
  process.exit(1);
});
