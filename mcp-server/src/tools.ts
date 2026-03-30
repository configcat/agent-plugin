import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TOOLS: Tool[] = [
  {
    name: "list_products",
    description: "List all products (organizations) in the ConfigCat account.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "list_configs",
    description: "List all configs (config files) within a given product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "string",
          description: "The ID of the product to list configs for.",
        },
      },
      required: ["product_id"],
    },
  },
  {
    name: "list_feature_flags",
    description: "List all feature flag settings within a given config.",
    inputSchema: {
      type: "object",
      properties: {
        config_id: {
          type: "string",
          description: "The ID of the config to list feature flags for.",
        },
      },
      required: ["config_id"],
    },
  },
  {
    name: "get_feature_flag",
    description: "Get the details of a specific feature flag setting.",
    inputSchema: {
      type: "object",
      properties: {
        setting_id: {
          type: "number",
          description: "The numeric ID of the feature flag setting.",
        },
      },
      required: ["setting_id"],
    },
  },
  {
    name: "create_feature_flag",
    description:
      "Create a new feature flag setting in a config. The setting type must be one of: boolean, string, int, double.",
    inputSchema: {
      type: "object",
      properties: {
        config_id: {
          type: "string",
          description: "The ID of the config to create the feature flag in.",
        },
        key: {
          type: "string",
          description:
            "The unique key (identifier) for the feature flag, e.g. 'my_feature_enabled'.",
        },
        name: {
          type: "string",
          description: "The human-readable name of the feature flag.",
        },
        hint: {
          type: "string",
          description: "A short description or hint for the feature flag.",
        },
        setting_type: {
          type: "string",
          enum: ["boolean", "string", "int", "double"],
          description: "The type of value this feature flag holds.",
        },
      },
      required: ["config_id", "key", "name", "setting_type"],
    },
  },
  {
    name: "delete_feature_flag",
    description: "Delete a feature flag setting.",
    inputSchema: {
      type: "object",
      properties: {
        setting_id: {
          type: "number",
          description: "The numeric ID of the feature flag setting to delete.",
        },
      },
      required: ["setting_id"],
    },
  },
  {
    name: "get_flag_value",
    description:
      "Get the current value and targeting rules of a feature flag for a specific environment.",
    inputSchema: {
      type: "object",
      properties: {
        setting_id: {
          type: "number",
          description: "The numeric ID of the feature flag setting.",
        },
        environment_id: {
          type: "string",
          description:
            "The ID of the environment to get the feature flag value for.",
        },
      },
      required: ["setting_id", "environment_id"],
    },
  },
  {
    name: "update_flag_value",
    description:
      "Update the value of a feature flag for a specific environment. Optionally include a reason for the change.",
    inputSchema: {
      type: "object",
      properties: {
        setting_id: {
          type: "number",
          description: "The numeric ID of the feature flag setting.",
        },
        environment_id: {
          type: "string",
          description:
            "The ID of the environment to update the feature flag value in.",
        },
        value: {
          description:
            "The new value for the feature flag (boolean, string, number depending on the flag type).",
        },
        reason: {
          type: "string",
          description:
            "Optional reason for the change (used for audit logs if mandatory reason is enabled).",
        },
      },
      required: ["setting_id", "environment_id", "value"],
    },
  },
  {
    name: "list_environments",
    description: "List all environments within a given product.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: {
          type: "string",
          description: "The ID of the product to list environments for.",
        },
      },
      required: ["product_id"],
    },
  },
];
