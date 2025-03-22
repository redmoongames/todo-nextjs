export * from './HttpService';
export * from './types';
export { ApiError } from './errors/ApiError';

import { HttpService } from './HttpService';
export const httpService = HttpService.getInstance(); 