import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Palette, Globe, ArrowRight, ArrowLeft, Check, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useStore, useToastStore } from '../lib/store';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { schoolConfig, updateSchoolConfig } = useStore();
  const { addToast } = useToastStore();
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState(schoolConfig.logo);
  const [logoName, setLogoName] = useState('');
  const [corPrimaria, setCorPrimaria] = useState(schoolConfig.corPrimaria);
  const [corSecundaria, setCorSecundaria] = useState(schoolConfig.corSecundaria);
  const [nomeEscola, setNomeEscola] = useState(schoolConfig.nomeEscola);
  const [dominio, setDominio] = useState(schoolConfig.dominio);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', corPrimaria);
    document.documentElement.style.setProperty('--brand-gold', corSecundaria);
  }, [corPrimaria, corSecundaria]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
        setLogoName(file.name);
        addToast('Logo carregada com sucesso!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (!nomeEscola || !dominio) {
      addToast('Preencha todos os campos', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    updateSchoolConfig({ logo, corPrimaria, corSecundaria, nomeEscola, dominio });
    addToast('Configuração concluída! Bem-vindo ao SABER INTEGRAL!', 'success');
    setLoading(false);
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'Logo', icon: Upload },
    { number: 2, title: 'Cores', icon: Palette },
    { number: 3, title: 'Escola', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary">Configuração Inicial</span>
          </div>
          <span className="text-sm text-gray-500">Passo {step} de 3</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className={`flex items-center gap-2 ${step >= s.number ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > s.number ? 'bg-green-500 text-white' :
                  step === s.number ? 'bg-primary text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Upload da Logo</h2>
              <p className="text-sm text-gray-500 mb-6">Faça upload da logo da sua escola</p>
              {logo ? (
                <div className="mb-6">
                  <img src={logo} alt="Logo preview" className="max-h-32 mx-auto rounded-lg border border-gray-200" />
                  <p className="text-xs text-gray-400 mt-2">{logoName}</p>
                  <button onClick={() => fileInputRef.current?.click()} className="text-sm text-primary hover:underline mt-2">Trocar logo</button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors mb-6">
                  <p className="text-gray-500 text-sm">Clique para selecionar uma imagem</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <Button variant="primary" onClick={() => setStep(2)} className="w-full">
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
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
                    <input type="color" value={corPrimaria} onChange={(e) => setCorPrimaria(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                    <span className="text-sm text-gray-600 font-mono">{corPrimaria}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={corSecundaria} onChange={(e) => setCorSecundaria(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                    <span className="text-sm text-gray-600 font-mono">{corSecundaria}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4 mb-6">
                <p className="text-xs text-gray-400 mb-3">Pré-visualização</p>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: corPrimaria }} />
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: corSecundaria }} />
                </div>
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: corPrimaria }}>
                  <p className="text-white text-sm font-bold">{nomeEscola || 'Sua Escola'}</p>
                  <p className="text-white/70 text-xs">Preview do cabeçalho</p>
                </div>
                <button className="mt-2 px-4 py-1.5 rounded text-sm text-white font-medium" style={{ backgroundColor: corSecundaria }}>Botão de ação</button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button variant="primary" onClick={() => setStep(3)} className="flex-1">
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Dados da Escola</h2>
                <p className="text-sm text-gray-500">Configure nome e domínio</p>
              </div>
              <div className="space-y-4 mb-6">
                <Input label="Nome da Escola" placeholder="Ex: Colégio Saber" value={nomeEscola} onChange={(e) => setNomeEscola(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Domínio</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                    <input type="text" value={dominio} onChange={(e) => setDominio(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="suaescola" className="flex-1 px-4 py-3 text-sm focus:outline-none" />
                    <span className="px-4 py-3 bg-gray-100 text-sm text-gray-500 border-l border-gray-300">.saberintegral.com.br</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Resumo:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Logo: {logoName || 'Padrão'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cores: {corPrimaria} / {corSecundaria}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Escola: {nomeEscola}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Domínio: {dominio}.saberintegral.com.br</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button variant="gold" onClick={handleComplete} loading={loading} className="flex-1">
                  Concluir <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
