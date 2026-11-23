const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://dummyjson.com';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getJson<T>(ruta: string): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`);
  } catch {
    throw new ApiError('No se pudo conectar con el servicio. Comprueba tu conexión a internet.');
  }
  if (!respuesta.ok) throw new ApiError(`El servicio respondió con error (${respuesta.status}).`, respuesta.status);
  return respuesta.json() as Promise<T>;
}
