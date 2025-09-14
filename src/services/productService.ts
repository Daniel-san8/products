import { Product } from './types';

const API_URL = process.env.NEXT_PUBLIC_API;

export type ProductPayload = {
  title: string;
  description: string;
  thumbnail: File;
};

export const fetchProducts = async (
  token: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const res = await fetch(
    `${API_URL}/products?page=${page}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error('Erro ao buscar produtos');

  return res.json() as Promise<{
    data: Product[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }>;
};

export const createProduct = async (token: string, data: ProductPayload) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('thumbnail', data.thumbnail);

  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erro desconhecido, contate o suporte');
  }
  return res.json();
};

export const updateProduct = async (
  token: string,
  id: string,
  data: ProductPayload
) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('thumbnail', data.thumbnail);

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erro desconhecido, contate o suporte');
  }
  return res.json();
};

export const deleteProduct = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erro desconhecido, contate o suporte');
  }
  return res.json();
};
