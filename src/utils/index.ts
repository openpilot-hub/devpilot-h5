export function isMac(): boolean {
  return /Mac/.test(navigator.userAgent);
}

export function sleep(wait: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

export function encodeUserContent(value: string) {
  // 如果用户输入了标签，则替换掉
  return value?.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
