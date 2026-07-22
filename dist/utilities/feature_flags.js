"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagUtility = void 0;
const abstraction_1 = require("./abstraction");
class FeatureFlagUtility extends abstraction_1.ModuleBaseUtility {
    static flags = new Map();
    static setFlag(key, enabled) {
        FeatureFlagUtility.flags.set(key, enabled);
    }
    static isEnabled(key, context) {
        const globalState = FeatureFlagUtility.flags.get(key);
        if (globalState !== undefined) {
            return globalState;
        }
        // Default fallback to disabled if flag not explicitly set
        return false;
    }
}
exports.FeatureFlagUtility = FeatureFlagUtility;
