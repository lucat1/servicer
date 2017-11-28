export const API_PORT    = process.env.API_PORT    || 8080
export const SOCKET_PORT = process.env.SOCKET_PORT || 3434
export const NPM_CLIENT  = process.env.NPM_CLIENT  || 'yarn'
export const NPM_INSTALL = JSON.parse(process.env.NPM_INSTALL || '["install", "--json"]')