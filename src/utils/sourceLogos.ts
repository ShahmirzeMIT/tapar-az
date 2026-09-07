export const SOURCE_LOGOS: Record<string, string> = {
  'tap.az': 'https://tap.az/favicon.ico',
  'bina.az': 'https://bina.az/favicon.ico',
  'turbo.az': 'https://turbo.az/favicon.ico',
  'birmarket.az': 'https://birmarket.az/favicon.ico',
};

export function sourceLogo(source: string) {
  return SOURCE_LOGOS[source.toLowerCase()];
}
