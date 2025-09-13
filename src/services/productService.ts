export type ProductPayload = {
  title: string;
  description: string;
  thumbnail: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  status: boolean;
  updatedAt: string;
  thumbnail?: string;
};

export async function fetchProducts(
  token: string,
  page = 1,
  pageSize = 10,
  filter = ''
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/products?page=${page}&pageSize=${pageSize}&filter=${filter}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

export async function createProduct(token: string, data: ProductPayload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return res.json();
}

export async function updateProduct(
  token: string,
  id: string,
  data: Partial<ProductPayload & { status?: boolean }>
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return res.json();
}

export async function deleteProduct(token: string, id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao deletar produto');
  return res.json();
}
