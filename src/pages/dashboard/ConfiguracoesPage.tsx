import React, { useState, useRef, useEffect } from 'react';
import { Upload, Save, Download, UploadCloud, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useStore, useToastStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';

export const ConfiguracoesPage: React.FC = () => {
  const { schoolConfig, updateSchoolConfig, logout } = useStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState(schoolConfig.logo);
  const [corPrimaria, setCorPrimaria] = useState(schoolConfig.corPrimaria);
  const [corSecundaria, setCorSecundaria] = useState(schoolConfig.corSecundaria);
  const [nomeEscola, setNomeEscola] = useState(schoolConfig.nomeEscola);
  const [dominio, setDominio] = useState(schoolConfig.dominio);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', corPrimaria);
    document.documentElement.style.setProperty('--brand-gold', corSecundaria);
  }, [corPrimaria, corSecundaria]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { setLogo(ev.target?.result as string); addToast('Logo carregada!', 'success'); };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSchoolConfig({ logo, corPrimaria, corSecundaria, nomeEscola, dominio });
    addToast('Configurações salvas!', 'success');
  };

  const handleExport = () => {
    const data = JSON.stringify(schoolConfig, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saber-integral-config.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Dados exportados!', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        updateSchoolConfig(data);
        setLogo(data.logo || '');
        setCorPrimaria(data.corPrimaria || '#1E3A5F');
        setCorSecundaria(data.corSecundaria || '#C59D2C');
        setNomeEscola(data.nomeEscola || '');
        setDominio(data.dominio || '');
        addToast('Dados importados com sucesso!', 'success');
      } catch {
        addToast('Erro ao importar arquivo', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-sm text-gray-500">Personalize sua plataforma</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">White Label</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo da Escola</label>
              <div className="flex items-center gap-4">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-20 h-20 rounded-lg border border-gray-200 object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor Primária</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={corPrimaria} onChange={(e) => setCorPrimaria(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-500 font-mono">{corPrimaria}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor Secundária</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={corSecundaria} onChange={(e) => setCorSecundaria(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-500 font-mono">{corSecundaria}</span>
                </div>
              </div>
            </div>

            <Input label="Nome da Escola" value={nomeEscola} onChange={(e) => setNomeEscola(e.target.value)} />
            <Input label="Domínio" value={dominio} onChange={(e) => setDominio(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />

            <Button variant="gold" onClick={handleSave} className="w-full"><Save className="w-4 h-4 mr-2" /> Salvar Configurações</Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-gray-800 mb-4">Dados</h3>
            <div className="space-y-3">
              <Button variant="outline" onClick={handleExport} className="w-full"><Download className="w-4 h-4 mr-2" /> Exportar Dados (JSON)</Button>
              <Button variant="outline" onClick={() => importInputRef.current?.click()} className="w-full"><UploadCloud className="w-4 h-4 mr-2" /> Importar Dados</Button>
              <input ref={importInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-800 mb-4">Preview</h3>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 text-white" style={{ backgroundColor: corPrimaria }}>
                <div className="flex items-center gap-2">
                  {logo && <img src={logo} alt="" className="w-8 h-8 rounded" />}
                  <span className="font-bold">{nomeEscola || 'Sua Escola'}</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600 mb-3">Preview do cabeçalho da plataforma</p>
                <button className="px-4 py-2 rounded text-sm text-white font-medium" style={{ backgroundColor: corSecundaria }}>Botão de Ação</button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-800 mb-4">Conta</h3>
            <Button variant="primary" onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700"><LogOut className="w-4 h-4 mr-2" /> Sair da Conta</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
