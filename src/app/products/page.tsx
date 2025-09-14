'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductPayload,
} from '@/services/productService';
import { Input, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Dialog } from '@headlessui/react';
import { Product } from '@/services/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const chartData = [
    { name: 'Jan', vendas: 30 },
    { name: 'Fev', vendas: 20 },
    { name: 'Mar', vendas: 27 },
    { name: 'Abr', vendas: 45 },
  ];

  const loadProducts = async (pageNumber: number = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchProducts(token, pageNumber, 10);
      setProducts(data.data);
      setPage(data.meta.page);
      setTotalPages(data.meta.totalPages);
    } catch {
      alert('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, [token]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setThumbnailFile(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onCreate = async () => {
    if (!token || !title || !description || !thumbnailFile) {
      alert('Preencha todos os campos e selecione uma imagem.');
      return;
    }
    setLoading(true);
    try {
      const payload: ProductPayload = {
        title,
        description,
        thumbnail: thumbnailFile,
      };
      await createProduct(token, payload);
      alert('Produto criado!');
      resetForm();
      loadProducts(page);
    } catch (err: any) {
      alert(`Erro ao criar produto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!token || !editingProduct || !title || !description || !thumbnailFile) {
      alert('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const payload: ProductPayload = {
        title,
        description,
        thumbnail: thumbnailFile,
      };
      await updateProduct(token, editingProduct.id, payload);
      alert('Produto atualizado!');
      setIsModalOpen(false);
      resetForm();
      loadProducts(page);
    } catch (err: any) {
      alert(`Erro ao atualizar produto: ${err.message}`);
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
      loadProducts(page);
    } catch (err: any) {
      alert(`Erro ao deletar produto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description);
    setPreview(product.thumbnail || null);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const handlePrevPage = () => {
    if (page > 1) loadProducts(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) loadProducts(page + 1);
  };

  if (!token) {
    router.push('/login');
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left text-gray-900 dark:text-gray-100">
        Produtos
      </h1>

      <Card className="mb-6 w-full max-w-lg mx-auto md:mx-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors p-4">
        <CardHeader>Adicionar Produto</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="dark:bg-gray-700 dark:text-gray-100 p-3 rounded-2xl"
            />
            {preview && (
              <img
                src={preview}
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
            <Button
              type="button"
              color="primary"
              isLoading={loading}
              fullWidth
              onClick={onCreate}
            >
              Criar Produto
            </Button>
          </div>
        </CardBody>
      </Card>

      <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Lista de Produtos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors p-4"
          >
            <CardBody className="flex flex-col justify-between h-full">
              <div>
                <strong className="text-lg block truncate" title={p.title}>
                  {p.title}
                </strong>
                <p className="text-sm mt-1">
                  {p.description.length > 100
                    ? `${p.description.slice(0, 100)}...`
                    : p.description}
                </p>
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
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

      <div className="flex justify-center gap-2 mt-4 text-gray-900 dark:text-gray-100">
        <Button disabled={page === 1} onClick={handlePrevPage}>
          Anterior
        </Button>
        <span className="flex items-center px-2">
          {page} / {totalPages}
        </span>
        <Button disabled={page === totalPages} onClick={handleNextPage}>
          Próxima
        </Button>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md text-gray-900 dark:text-gray-100 transition-colors">
            <h3 className="text-lg font-bold mb-4">Editar Produto</h3>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <Input
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="dark:bg-gray-700 dark:text-gray-100"
              />
              {preview && (
                <img
                  src={preview}
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button
                  type="button"
                  color="primary"
                  isLoading={loading}
                  className="flex-1"
                  onClick={onUpdate}
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <h2 className="text-xl md:text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">
        Gráfico de Métricas
      </h2>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#111827',
              }}
            />
            <Legend />
            <Bar dataKey="vendas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
