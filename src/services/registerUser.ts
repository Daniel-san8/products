export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  verifyPassword: string;
  phone: {
    country: string;
    ddd: string;
    number: string;
  };
};

export type ApiResponseSuccess = {
  codeIntern: string;
  message: string;
  token: string;
};

export type ApiResponseError = {
  codeIntern: string;
  message: string;
};

export async function registerUser(
  data: RegisterPayload
): Promise<ApiResponseSuccess> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponseSuccess | ApiResponseError = await response.json();

  if (!response.ok || !('token' in result)) {
    throw new Error(result.message || 'Erro ao registrar usuário');
  }

  return result as ApiResponseSuccess;
}
