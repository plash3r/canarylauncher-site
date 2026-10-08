// A new page opening requests current screenshots and installer bytes even when
// files are replaced on the host without rebuilding the React interface.
const pageVersion = Date.now().toString(36);

export const freshAssetUrl = (url) => `${url}${url.includes('?') ? '&' : '?'}v=${pageVersion}`;
