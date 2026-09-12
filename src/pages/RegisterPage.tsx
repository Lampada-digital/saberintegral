import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore, useToastStore } from '../stores';

const registerSchema = z.object({
  name: z.string().min(3, 'Mínimo de 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    login(data.email, data.name);
    addToast('Conta criada com sucesso!', 'success');
    setLoading(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Comece agora mesmo</h2>
          <p className="text-white/70 max-w-sm">Crie sua conta e transforme a gestão da sua escola em minutos.</p>
          <div className="mt-8 bg-white/10 rounded-xl p-6 text-left">
            <p className="text-gold font-bold text-lg mb-2">✓ 7 dias grátis</p>
            <p className="text-white/80 text-sm">Teste todas as funcionalidades sem compromisso. Sem cartão de crédito.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">SABER <span className="text-gold">INTEGRAL</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Crie sua conta</h1>
          <p className="text-gray-500 mb-8">Comece seu teste gratuito de 7 dias</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Repita a senha"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
              Criar Conta <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link to="/" className="hover:underline">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
