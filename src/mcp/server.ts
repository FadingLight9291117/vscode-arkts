import * as vscode from 'vscode';
import { allTools } from './tools';
import { ToolResponse } from './types/tool';

/**
 * MCP Server for VS Code extension
 * Provides HarmonyOS development tools to the extension and external AI assistants
 */
export class MCPServer {
  private toolMap: Map<string, any>;

  constructor() {
    // Build tool registry
    this.toolMap = new Map();
    for (const tool of allTools) {
      this.toolMap.set(tool.definition.name, tool);
    }
  }

  /**
   * Call a tool by name with arguments
   */
  async callTool(toolName: string, args: any): Promise<ToolResponse> {
    const tool = this.toolMap.get(toolName);
    
    if (!tool) {
      return {
        content: [{ type: "text", text: `Tool not found: ${toolName}` }],
        isError: true,
      };
    }

    try {
      // Validate arguments against schema
      const validatedArgs = tool.schema.parse(args);
      // Call handler
      return await tool.handler(validatedArgs);
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error calling ${toolName}: ${error.message}` }],
        isError: true,
      };
    }
  }

  /**
   * Get list of all available tools
   */
  listTools() {
    return Array.from(this.toolMap.values()).map(tool => tool.definition);
  }

  /**
   * Get a specific tool definition
   */
  getTool(toolName: string) {
    const tool = this.toolMap.get(toolName);
    return tool ? tool.definition : null;
  }

  /**
   * Start the MCP server (for VS Code extension context)
   */
  async start() {
    vscode.window.showInformationMessage(
      `ArkTS MCP Server started with ${this.toolMap.size} tools`
    );
  }

  /**
   * Dispose the server
   */
  dispose() {
    this.toolMap.clear();
  }
}
