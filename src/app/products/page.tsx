'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductPayload,
} from '@/services/productService';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Dialog } from '@headlessui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const productSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().min(5, 'Descrição obrigatória'),
  thumbnail: z.string().url('URL inválida'),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const loadProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchProducts(token);
      setProducts(data.data);
    } catch (err) {
      alert('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const onCreate = async (data: ProductForm) => {
    if (!token) return;
    setLoading(true);
    try {
      await createProduct(token, data);
      alert('Produto criado!');
      reset();
      loadProducts();
    } catch (err) {
      alert('Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data: ProductForm) => {
    if (!token || !editingProduct) return;
    setLoading(true);
    try {
      await updateProduct(token, editingProduct.id, data);
      alert('Produto atualizado!');
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      alert('Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setLoading(true);
    try {
      await deleteProduct(token, id);
      alert('Produto deletado!');
      loadProducts();
    } catch (err) {
      alert('Erro ao deletar produto');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('thumbnail', product.thumbnail || '');
    setIsModalOpen(true);
  };

  const chartData = [
    { name: 'Jan', vendas: 30 },
    { name: 'Fev', vendas: 20 },
    { name: 'Mar', vendas: 27 },
    { name: 'Abr', vendas: 45 },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Produtos
      </h1>

      <Card className="mb-6 w-full max-w-lg mx-auto md:mx-0">
        <CardHeader>Adicionar Produto</CardHeader>
        <CardBody>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onCreate)}
          >
            <Input placeholder="Título" {...register('title')} fullWidth />
            <Input
              placeholder="Descrição"
              {...register('description')}
              fullWidth
            />
            <Input
              placeholder="URL da Imagem"
              {...register('thumbnail')}
              fullWidth
            />
            <Button type="submit" color="primary" isLoading={loading} fullWidth>
              Criar Produto
            </Button>
          </form>
        </CardBody>
      </Card>

      <h2 className="text-xl md:text-2xl font-bold mb-3">Lista de Produtos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between">
            <CardBody className="flex flex-col justify-between h-full">
              <div>
                <strong className="text-lg">{p.title}</strong>
                <p className="text-sm mt-1">{p.description}</p>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button
                  color="primary"
                  onClick={() => openEditModal(p)}
                  isLoading={loading}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDelete(p.id)}
                  isLoading={loading}
                  className="flex-1"
                >
                  Deletar
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Editar Produto</h3>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onUpdate)}
            >
              <Input placeholder="Título" {...register('title')} fullWidth />
              <Input
                placeholder="Descrição"
                {...register('description')}
                fullWidth
              />
              <Input
                placeholder="URL da Imagem"
                {...register('thumbnail')}
                fullWidth
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={loading}
                  className="flex-1"
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      <h2 className="text-xl md:text-2xl font-bold mt-6 mb-3">
        Gráfico de Métricas
      </h2>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vendas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
