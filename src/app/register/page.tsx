'use client';

import { Input, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { IMaskInput } from 'react-imask';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/registerUser';

const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Digite um e-mail válido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    verifyPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    phone: z.string().min(14, 'Informe um telefone válido'),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: 'As senhas não conferem',
    path: ['verifyPassword'],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      const phoneParts = data.phone.match(
        /\+(\d{2}) \((\d{2})\) (\d{5}-\d{4})/
      );

      if (!phoneParts) throw new Error('Telefone inválido');

      const payload = {
        ...data,
        phone: {
          country: phoneParts[1],
          ddd: phoneParts[2],
          number: phoneParts[3].replace('-', ''),
        },
      };

      const result = await registerUser(payload);
      console.log(result);
      alert(`✅ ${result.message} - Token: ${result.token}`);
      reset();

      router.push('/login');
    } catch (error: any) {
      if (error.message.includes('email')) {
        setError('email', { type: 'manual', message: error.message });
      } else if (error.message.includes('phone')) {
        setError('phone', { type: 'manual', message: error.message });
      } else {
        alert(`❌ Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <ThemeSwitcher />

      <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
        <CardHeader className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Preencha os dados para se registrar
          </p>
        </CardHeader>

        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              type="text"
              placeholder="Digite seu nome"
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <Input
              type="email"
              placeholder="Digite seu e-mail"
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />

            <Input
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <Input
              type="password"
              placeholder="Confirme sua senha"
              {...register('verifyPassword')}
              isInvalid={!!errors.verifyPassword}
              errorMessage={errors.verifyPassword?.message}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="+00 (00) 00000-0000"
                  placeholder="+55 (11) 91234-5678"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            <Button
              type="submit"
              color="primary"
              className="mt-4"
              fullWidth
              isLoading={loading || isSubmitting}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
              Já tem conta?{' '}
              <span
                onClick={() => router.push('login')}
                className="text-indigo-500 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
