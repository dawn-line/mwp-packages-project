import * as crypto from 'crypto';

export function encrypt(text: string, encryptionKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string, encryptionKey: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey),
    iv,
  );
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * 路径模式匹配
 * 支持 * 通配符
 * 例如: /api/* 可以匹配 /api/user, /api/admin 等
 */
export function matchPathPattern(path: string, pattern: string): boolean {
  // 将通配符转换为正则表达式
  const regexPattern = pattern
    .replace(/\*/g, '.*') // 将 * 转换为 .*
    .replace(/\?/g, '.') // 将 ? 转换为 .
    .replace(/\//g, '\\/'); // 转义 /

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

interface NormalizeOptions {
  depth?: number; // 路径深度，可选
}

// 规范返回url
export function normalizeServiceUrl(
  urlString: string,
  options: NormalizeOptions = {},
): string {
  try {
    const url = new URL(urlString);
    const { depth } = options;

    // 获取路径部分，过滤掉空字符串
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // 如果没有路径段，返回域名
    if (pathSegments.length === 0) {
      return `${url.protocol}//${url.host}`;
    }

    // 如果指定了深度，使用深度，否则只使用第一个路径段
    const endIndex = depth ? depth : 1;
    const basePath = '/' + pathSegments.slice(0, endIndex).join('/');
    return `${url.protocol}//${url.host}${basePath}`;
  } catch (error) {
    throw new Error(`Invalid URL: ${urlString}`);
  }
}
// 校验url匹配
export function isServiceMatch(
  storedService: string,
  requestService: string,
): boolean {
  const baseStoredUrl = new URL(storedService);
  const baseRequestUrl = new URL(requestService);
  // 检查域名和基础路径
  return (
    requestService.startsWith(storedService) &&
    baseStoredUrl.host === baseRequestUrl.host
  );
}
