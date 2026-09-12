import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Palette, Globe, ArrowRight, ArrowLeft, Check, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useOnboardingStore, useToastStore } from '../stores';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useOnboardingStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        store.setLogo(ev.target?.result as string, file.name);
        addToast('Logo carregada com sucesso!', 'success');
      };
      reader.readAsDataURL(file);
    }
  }, [store, addToast]);

  const handleComplete = async () => {
    if (!store.subdomain) {
      addToast('Informe um subdomínio', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    addToast('Configuração concluída! Bem-vindo ao SABER INTEGRAL!', 'success');
    setLoading(false);
    navigate('/dashboard/grading');
  };

  const steps = [
    { number: 1, title: 'Logo', icon: Upload },
    { number: 2, title: 'Cores', icon: Palette },
    { number: 3, title: 'Domínio', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary">Configuração Inicial</span>
          </div>
          <span className="text-sm text-gray-500">Passo {store.step} de 3</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className={`flex items-center gap-2 ${store.step >= s.number ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  store.step > s.number ? 'bg-green-500 text-white' :
                  store.step === s.number ? 'bg-primary text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {store.step > s.number ? <Check className="w-4 h-4" /> : s.number}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 ${store.step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          {/* Step 1: Logo */}
          {store.step === 1 && (
            <div className="text-center animate-fade-in">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Upload da Logo</h2>
              <p className="text-sm text-gray-500 mb-6">Faça upload da logo da sua escola (PNG, JPG ou SVG)</p>
              
              {store.logo ? (
                <div className="mb-6">
                  <img src={store.logo} alt="Logo preview" className="max-h-32 mx-auto rounded-lg border border-gray-200" />
                  <p className="text-xs text-gray-400 mt-2">{store.logoName}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    Trocar logo
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors mb-6"
                >
                  <p className="text-gray-500 text-sm">Clique ou arraste a imagem aqui</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <Button variant="primary" onClick={() => store.setStep(2)} className="w-full">
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Colors */}
          {store.step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Personalize as Cores</h2>
                <p className="text-sm text-gray-500">Escolha as cores da sua marca</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={store.primaryColor}
                      onChange={(e) => store.setColors(e.target.value, store.secondaryColor)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-sm text-gray-600 font-mono">{store.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={store.secondaryColor}
                      onChange={(e) => store.setColors(store.primaryColor, e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-sm text-gray-600 font-mono">{store.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-gray-200 p-4 mb-6">
                <p className="text-xs text-gray-400 mb-3">Pré-visualização</p>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: store.primaryColor }} />
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: store.secondaryColor }} />
                </div>
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: store.primaryColor }}>
                  <p className="text-white text-sm font-bold">Sua Escola</p>
                  <p className="text-white/70 text-xs">Preview do cabeçalho</p>
                </div>
                <button className="mt-2 px-4 py-1.5 rounded text-sm text-white font-medium" style={{ backgroundColor: store.secondaryColor }}>
                  Botão de ação
                </button>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => store.setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button variant="primary" onClick={() => store.setStep(3)} className="flex-1">
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Subdomain */}
          {store.step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Seu Subdomínio</h2>
                <p className="text-sm text-gray-500">Escolha o endereço da sua plataforma</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                  <input
                    type="text"
                    value={store.subdomain}
                    onChange={(e) => store.setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="suaescola"
                    className="flex-1 px-4 py-3 text-sm focus:outline-none"
                  />
                  <span className="px-4 py-3 bg-gray-100 text-sm text-gray-500 border-l border-gray-300">.saberintegral.com.br</span>
                </div>
                {store.subdomain && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Subdomínio disponível!
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Resumo da configuração:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Logo: {store.logoName || 'Padrão'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Cores: {store.primaryColor} / {store.secondaryColor}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Domínio: {store.subdomain || '...'}saberintegral.com.br
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => store.setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button variant="gold" onClick={handleComplete} loading={loading} className="flex-1">
                  Concluir Configuração <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
