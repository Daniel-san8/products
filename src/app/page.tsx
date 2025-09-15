'use client';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const navigation = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    if (!token) navigation.push('/login');

    navigation.push('/products');
  }, [token]);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"></div>
  );
}
