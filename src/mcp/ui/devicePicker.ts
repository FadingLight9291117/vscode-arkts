import * as vscode from 'vscode';
import { MCPServer } from '../server';
import { HarmonyOSDevice } from '../types/harmonyos-types';

/** workspaceState 键：记住上次选择的设备（按工作区持久化） */
const LAST_DEVICE_KEY = 'arkts.lastDevice';

/**
 * Device Picker UI that uses MCP tools to list and select devices.
 * 上次选择的设备置顶（QuickPick 默认高亮第一项，回车即复用），选择后写入 workspaceState。
 */
export class DevicePickerUI {
  constructor(private mcpServer: MCPServer) {}

  async show(state: vscode.Memento): Promise<HarmonyOSDevice | undefined> {
    try {
      // Call MCP tool to list devices
      const result = await this.mcpServer.callTool('harmonyos_list_devices', {});

      if (result.isError) {
        vscode.window.showErrorMessage(`Failed to list devices: ${result.content[0].text}`);
        return undefined;
      }

      // Parse device list from result
      const devicesJson = result.content[0].text;
      const devices: HarmonyOSDevice[] = JSON.parse(devicesJson);

      if (devices.length === 0) {
        vscode.window.showWarningMessage('No HarmonyOS devices connected');
        return undefined;
      }

      // Show quick pick（上次选择的设备排最前；离线时不影响其他项顺序）
      const lastDevice = state.get<string>(LAST_DEVICE_KEY);
      const items = devices.map(device => ({
        label: device.udid,
        description: device.status,
        device: device
      }));
      const ordered = items.slice().sort((a, b) =>
        b.label === lastDevice ? 1 : a.label === lastDevice ? -1 : 0
      );

      const selected = await vscode.window.showQuickPick(ordered, {
        placeHolder: lastDevice
          ? `Select a HarmonyOS device (last: ${lastDevice})`
          : 'Select a HarmonyOS device',
        title: 'HarmonyOS Devices'
      });

      if (selected) {
        await state.update(LAST_DEVICE_KEY, selected.device.udid);
        // Get detailed device info
        const infoResult = await this.mcpServer.callTool('harmonyos_get_device_info', {
          deviceId: selected.device.udid
        });

        if (!infoResult.isError) {
          const deviceInfo = JSON.parse(infoResult.content[0].text);
          // 信息字段可能为 Unknown（属性解析失败），此时回退显示 udid，未知字段直接省略
          const model =
            deviceInfo.model !== "Unknown" ? deviceInfo.model : deviceInfo.udid;
          const brand =
            deviceInfo.brand !== "Unknown" ? ` (${deviceInfo.brand})` : "";
          const os =
            deviceInfo.osVersion !== "Unknown" ? deviceInfo.osVersion : "?";
          vscode.window.showInformationMessage(
            `Selected: ${model}${brand} - OS ${os}`
          );
        }

        return selected.device;
      }

      return undefined;
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error listing devices: ${error.message}`);
      return undefined;
    }
  }
}
