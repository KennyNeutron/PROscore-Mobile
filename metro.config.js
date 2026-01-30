const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for .mjs files (needed for Supabase)
config.resolver.sourceExts.push("mjs");

// Ensure node_modules are resolved correctly
config.resolver.nodeModulesPaths = [
  require("path").resolve(__dirname, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
