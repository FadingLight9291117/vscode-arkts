import JSON5 from 'json5';

/**
 * Parse JSON5 content. 使用标准 json5 库，兼容 DevEco 生成的配置：
 * 无引号键名（app:）、单引号字符串、注释、尾逗号等。
 */
export function parseJson5(content: string): any {
  return JSON5.parse(content);
}
