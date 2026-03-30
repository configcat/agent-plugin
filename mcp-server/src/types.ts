export interface Product {
  productId: string;
  name: string;
  description?: string;
  order?: number;
}

export interface Config {
  configId: string;
  name: string;
  description?: string;
  order?: number;
  migratedConfig?: boolean;
}

export interface Environment {
  environmentId: string;
  name: string;
  description?: string;
  color?: string;
  order?: number;
}

export enum SettingType {
  Boolean = 0,
  String = 1,
  Int = 2,
  Double = 3,
}

export interface Setting {
  settingId: number;
  key: string;
  name: string;
  hint?: string;
  settingType: SettingType | string;
  order?: number;
  configId?: string;
  configName?: string;
}

export interface TargetingRule {
  ruleId?: string;
  attribute?: string;
  comparator?: string;
  comparisonAttribute?: string;
  comparisonValue?: string;
  value?: unknown;
  order?: number;
}

export interface PercentageRule {
  percentageRuleId?: string;
  percentage: number;
  value: unknown;
}

export interface SettingValue {
  value: unknown;
  rolloutRules?: TargetingRule[];
  rolloutPercentageItems?: PercentageRule[];
  updatedAt?: string;
  lastUpdaterUserEmail?: string;
  lastUpdaterUserFullName?: string;
}

export interface UpdateSettingValueModel {
  value: unknown;
  rolloutRules?: TargetingRule[];
  rolloutPercentageItems?: PercentageRule[];
}

export interface ConfigCatClientOptions {
  apiKey: string;
  baseUrl?: string;
}
