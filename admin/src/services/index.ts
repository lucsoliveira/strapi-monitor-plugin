import axios from 'axios';
import { StrapiMetrics } from './metrics';

export const METRICS_SERVICES = StrapiMetrics({
  requestClient: axios.request,
  getClient: axios.get,
});
