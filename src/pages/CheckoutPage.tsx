import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Lock, Check, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToastStore } from '../stores';

const checkoutSchema = z.object({
  cardName: z.string().min(3, 'Nome obrigatório'),
  cardNumber: z.string().min(19, 'Número do cartão inválido'),
  cardExpiry: z.string().min(5, 'Validade inválida'),
  cardCvv: z.string().min(3, 'CVV inválido'),
  cpf: z.string().min(14, 'CPF inválido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const formatCardNumber = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 16);
  return nums.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpiry = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 4);
  if (nums.length > 2) return nums.slice(0, 2) + '/' + nums.slice(2);
  return nums;
};

const formatCpf = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return nums.slice(0, 3) + '.' + nums.slice(3);
  if (nums.length <= 9) return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6);
  return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6, 9) + '-' + nums.slice(9);
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cpf: '',
    },
  });

  const cardNumber = watch('cardNumber');
  const cardExpiry = watch('cardExpiry');
  const cpf = watch('cpf');

  useEffect(() => {
    if (cardNumber) {
      const formatted = formatCardNumber(cardNumber);
      if (formatted !== cardNumber) setValue('cardNumber', formatted);
    }
  }, [cardNumber, setValue]);

  useEffect(() => {
    if (cardExpiry) {
      const formatted = formatExpiry(cardExpiry);
      if (formatted !== cardExpiry) setValue('cardExpiry', formatted);
    }
  }, [cardExpiry, setValue]);

  useEffect(() => {
    if (cpf) {
      const formatted = formatCpf(cpf);
      if (formatted !== cpf) setValue('cpf', formatted);
    }
  }, [cpf, setValue]);

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    addToast('Pagamento aprovado! Redirecionando...', 'success');
    setLoading(false);
    setTimeout(() => navigate('/onboarding'), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">SABER <span className="text-gold">INTEGRAL</span></span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Dados do Pagamento</h2>
              <p className="text-sm text-gray-500 mb-6">Preencha os dados do cartão de crédito</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Nome no Cartão"
                  placeholder="Como está no cartão"
                  error={errors.cardName?.message}
                  {...register('cardName')}
                />
                <Input
                  label="Número do Cartão"
                  placeholder="0000 0000 0000 0000"
                  icon={<CreditCard className="w-4 h-4" />}
                  error={errors.cardNumber?.message}
                  {...register('cardNumber')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Validade"
                    placeholder="MM/AA"
                    error={errors.cardExpiry?.message}
                    {...register('cardExpiry')}
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    type="password"
                    error={errors.cardCvv?.message}
                    {...register('cardCvv')}
                  />
                </div>
                <Input
                  label="CPF do Titular"
                  placeholder="000.000.000-00"
                  error={errors.cpf?.message}
                  {...register('cpf')}
                />
                
                <div className="pt-4">
                  <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Finalizar Pagamento
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Pagamento seguro com criptografia SSL
                </p>
              </form>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-8">
              <h3 className="font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
              <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plano SABER INTEGRAL</span>
                  <span className="font-semibold">R$ 299,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de setup</span>
                  <span className="font-semibold text-green-600">Grátis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Período de teste</span>
                  <span className="font-semibold text-green-600">7 dias</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-extrabold text-primary">R$ 299<span className="text-sm font-normal text-gray-500">/mês</span></span>
              </div>
              <ul className="space-y-2">
                {['Correção automatizada', 'AVA completo', 'Módulo financeiro', 'White-label', 'Suporte prioritário'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
