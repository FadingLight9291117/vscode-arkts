import { z } from "zod";
import { ToolDefinition } from "../types/tool";
import { HarmonyOSDevice } from "../types/harmonyos-types";
import { hdcExec } from "../utils/hdc";
import { toolResult } from "../utils/response";

// --- List Devices ---

const ListDevicesSchema = z.object({});

export const listDevices: ToolDefinition<typeof ListDevicesSchema> = {
  definition: {
    name: "harmonyos_list_devices",
    description: "List all connected HarmonyOS devices",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  schema: ListDevicesSchema,
  handler: async () => {
    const output = await hdcExec(["list", "targets"]);
    const devices: HarmonyOSDevice[] = output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== "[Empty]" && !line.includes("list targets"))
      .map((udid) => ({ udid, status: "connected" }));

    return toolResult(devices);
  },
};

// --- Get Device Info ---

const GetDeviceInfoSchema = z.object({
  deviceId: z.string(),
});

export const getDeviceInfo: ToolDefinition<typeof GetDeviceInfoSchema> = {
  definition: {
    name: "harmonyos_get_device_info",
    description: "Get detailed information about a specific device",
    inputSchema: {
      type: "object",
      properties: {
        deviceId: {
          type: "string",
          description: "The device UDID",
        },
      },
      required: ["deviceId"],
    },
  },
  schema: GetDeviceInfoSchema,
  handler: async ({ deviceId }) => {
    // getprop 失败（如设备不支持）时降级为空输出，走 param get 兜底
    let shellOutput = "";
    try {
      shellOutput = await hdcExec(["shell", "getprop"], {
        deviceId,
        timeout: 10000,
      });
    } catch {
      /* 忽略，交给 param get 兜底 */
    }

    // Android 式 ro.* 与 HarmonyOS NEXT 式 const.* 属性名互为候选（NEXT 已废弃 ro.*，errNum 1002 = 参数不存在）
    const PROPERTY_ALIASES: Record<string, string[]> = {
      model: ["ro.product.model", "const.product.model"],
      brand: ["ro.product.brand", "const.product.brand"],
      manufacturer: ["ro.product.manufacturer", "const.product.manufacturer"],
      osVersion: ["ro.build.version.release", "const.product.software.version"],
      sdkVersion: ["ro.build.version.sdk", "const.ohos.apiversion"],
      buildId: ["ro.build.display.id", "const.build.version.incremental"],
      abi: ["ro.product.cpu.abi", "const.product.cpu.abi"],
    };

    // 兼容 [key]: [value]、key: value、key=value 三种 getprop 输出格式
    const fromGetprop = (prop: string): string | undefined => {
      const patterns = [
        new RegExp(`\\[${prop}\\]:\\s*\\[([^\\]]+)\\]`),
        new RegExp(`^\\s*${prop}\\s*[:=]\\s*(.+)$`, "m"),
      ];
      for (const pattern of patterns) {
        const match = shellOutput.match(pattern);
        if (match) return match[1].trim();
      }
      return undefined;
    };

    // HarmonyOS 原生参数系统（getprop 只是兼容层）；输出含 fail/errNum/error 视为获取失败
    const fromParam = async (prop: string): Promise<string | undefined> => {
      try {
        const value = (
          await hdcExec(["shell", "param", "get", prop], {
            deviceId,
            timeout: 5000,
          })
        ).trim();
        if (value && !/fail|errnum|error/i.test(value)) return value;
      } catch {
        /* 忽略，返回 undefined */
      }
      return undefined;
    };

    const parseProperty = async (field: string): Promise<string> => {
      for (const name of PROPERTY_ALIASES[field]) {
        const value = fromGetprop(name) ?? (await fromParam(name));
        if (value) return value;
      }
      return "Unknown";
    };

    const deviceInfo = {
      udid: deviceId,
      model: await parseProperty("model"),
      brand: await parseProperty("brand"),
      manufacturer: await parseProperty("manufacturer"),
      osVersion: await parseProperty("osVersion"),
      sdkVersion: await parseProperty("sdkVersion"),
      buildId: await parseProperty("buildId"),
      abi: await parseProperty("abi"),
    };

    return toolResult(deviceInfo);
  },
};
