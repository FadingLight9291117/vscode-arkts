import { ToolEntry } from "../types/tool";
import { wrapTool } from "../utils/response";

// Device tools
import { listDevices, getDeviceInfo } from "./devices";

// Project tools
import { getProjectInfo, listModules } from "./projects";

// Application tools
import { listInstalledApps, getAppInfo } from "./apps";

// Build tools
import { checkBuildOutputs } from "./build";

/**
 * All registered MCP tools, wrapped with automatic error handling.
 */
export const allTools: ToolEntry[] = [
  // Device Management
  wrapTool(listDevices),
  wrapTool(getDeviceInfo),
  // Project Information
  wrapTool(getProjectInfo),
  wrapTool(listModules),
  // Build
  wrapTool(checkBuildOutputs),
  // Application Management
  wrapTool(listInstalledApps),
  wrapTool(getAppInfo),
];
