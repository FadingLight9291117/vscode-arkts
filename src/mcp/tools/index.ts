import { ToolEntry } from "../types/tool";
import { wrapTool } from "../utils/response";

// Device tools
import { listDevices, getDeviceInfo } from "./devices";

// Project tools
import { getProjectInfo, listModules, listDependencies } from "./projects";

// Application tools
import { listInstalledApps, getAppInfo } from "./apps";

// Build tools
import { checkBuildOutputs, buildProject } from "./build";

// Runtime tools (install / uninstall / launch / clear / reboot / log / screenshot)
import { installApp, uninstallApp, clearAppData, launchApp, tailHilog, takeScreenshot, rebootDevice } from "./runtime";

// File transfer tools
import { pushFile, pullFile } from "./files";

// Diagnostics tools
import { getCrashLogs, getAppMemory } from "./diagnostics";

/**
 * All registered MCP tools, wrapped with automatic error handling.
 */
export const allTools: ToolEntry[] = [
  // Device Management
  wrapTool(listDevices),
  wrapTool(getDeviceInfo),
  wrapTool(rebootDevice),
  // Project Information
  wrapTool(getProjectInfo),
  wrapTool(listModules),
  wrapTool(listDependencies),
  // Build
  wrapTool(checkBuildOutputs),
  wrapTool(buildProject),
  // Application Management
  wrapTool(listInstalledApps),
  wrapTool(getAppInfo),
  // Runtime: install / uninstall / launch / clear
  wrapTool(installApp),
  wrapTool(uninstallApp),
  wrapTool(launchApp),
  wrapTool(clearAppData),
  // File Transfer
  wrapTool(pushFile),
  wrapTool(pullFile),
  // Log & Diagnostics
  wrapTool(tailHilog),
  wrapTool(takeScreenshot),
  wrapTool(getCrashLogs),
  wrapTool(getAppMemory),
];
