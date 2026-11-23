import { getJson } from '../api/apiClient';

export interface ProductoApi {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

interface RespuestaProductos {
  products: ProductoApi[];
  total: number;
  skip: number;
  limit: number;
}

/** Consume una API REST pública de demostración; puede reemplazarse por la API acordada con el docente. */
export async function obtenerCatalogoProductos(): Promise<ProductoApi[]> {
  const respuesta = await getJson<RespuestaProductos>('/products?limit=30');
  return respuesta.products;
}
