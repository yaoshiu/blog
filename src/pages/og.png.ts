import type { APIRoute } from 'astro';
import Og from '@components/react/Og';

export const GET: APIRoute = async () => {
  return await Og();
};
