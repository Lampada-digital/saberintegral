import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore, useToastStore } from '../lib/store';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const success = login(data.email, data.senha);
    setLoading(false);
    if (success) {
      addToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    } else {
      addToast('Credenciais inválidas', 'error');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo de volta!</h2>
          <p className="text-white/70 max-w-sm">Acesse sua plataforma educacional completa e gerencie sua escola com inteligência artificial.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">SABER <span className="text-gold">INTEGRAL</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Entrar na sua conta</h1>
          <p className="text-gray-500 mb-8">Acesse o painel com suas credenciais</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="E-mail" type="email" placeholder="seu@email.com" icon={<Mail className="w-4 h-4" />} error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} error={errors.senha?.message} {...register('senha')} />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Entrar <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta? <Link to="/register" className="text-primary font-semibold hover:underline">Criar conta</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link to="/" className="hover:underline">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
