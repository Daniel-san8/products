'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/slices/authSlice';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao realizar login');
      }

      const result = await res.json();
      dispatch(setToken(result.token));

      alert(`✅ Bem-vindo ${result.user.name}`);
      router.push('/products');
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <ThemeSwitcher />

      <Card className="w-full max-w-md shadow-xl rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
        <CardHeader className="text-center text-3xl font-extrabold py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <span className="ml-8">Login</span>
        </CardHeader>
        <CardBody className="p-6 flex flex-col gap-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="email"
              placeholder="E-mail"
              {...register('email')}
              isInvalid={!!formState.errors.email}
              errorMessage={formState.errors.email?.message}
              fullWidth
              className="rounded-lg"
            />
            <Input
              type="password"
              placeholder="Senha"
              {...register('password')}
              isInvalid={!!formState.errors.password}
              errorMessage={formState.errors.password?.message}
              fullWidth
              className="rounded-lg"
            />
            <Button type="submit" color="primary" isLoading={loading} fullWidth>
              {loading ? 'Entrando...' : 'Login'}
            </Button>
          </form>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Ainda não tem conta?{' '}
            <a href="/register" className="text-indigo-500 hover:underline">
              Cadastre-se
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
