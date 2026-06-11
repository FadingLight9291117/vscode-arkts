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

// Runtime tools (install/launch/log/screenshot)
import { installApp, launchApp, tailHilog, takeScreenshot } from "./runtime";

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
  // Runtime: install / launch / log / screenshot
  wrapTool(installApp),
  wrapTool(launchApp),
  wrapTool(tailHilog),
  wrapTool(takeScreenshot),
];
