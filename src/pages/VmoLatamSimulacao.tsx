import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Save, RotateCcw, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlantData {
  id: string;
  name: string;
  country: string;
  originalBudget: number;
  currentBudget: number;
  adjustment: number;
  projects: number;
  roi: number;
  status: 'ok' | 'attention' | 'critical';
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  totalBudget: number;
  totalROI: number;
  adjustments: Record<string, number>;
}

const VmoLatamSimulacao = () => {
  const { toast } = useToast();
  const [plants, setPlantas] = useState<PlantData[]>([
    {
      id: '1',
      name: 'Curitiba PR 1',
      country: 'Brasil',
      originalBudget: 15000000,
      currentBudget: 15000000,
      adjustment: 0,
      projects: 8,
      roi: 15.2,
      status: 'ok'
    },
    {
      id: '2',
      name: 'Curitiba PR 2',
      country: 'Brasil',
      originalBudget: 12000000,
      currentBudget: 12000000,
      adjustment: 0,
      projects: 6,
      roi: 12.8,
      status: 'attention'
    },
    {
      id: '3',
      name: 'São Carlos SP',
      country: 'Brasil',
      originalBudget: 18000000,
      currentBudget: 18000000,
      adjustment: 0,
      projects: 10,
      roi: 18.5,
      status: 'ok'
    },
    {
      id: '4',
      name: 'Manaus AM',
      country: 'Brasil',
      originalBudget: 8000000,
      currentBudget: 8000000,
      adjustment: 0,
      projects: 4,
      roi: 8.2,
      status: 'critical'
    },
    {
      id: '5',
      name: 'Rosário',
      country: 'Argentina',
      originalBudget: 10000000,
      currentBudget: 10000000,
      adjustment: 0,
      projects: 5,
      roi: 11.5,
      status: 'attention'
    },
    {
      id: '6',
      name: 'Santiago',
      country: 'Chile',
      originalBudget: 14000000,
      currentBudget: 14000000,
      adjustment: 0,
      projects: 7,
      roi: 16.8,
      status: 'ok'
    }
  ]);

  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');

  // Calculated totals
  const originalTotal = plants.reduce((sum, plant) => sum + plant.originalBudget, 0);
  const currentTotal = plants.reduce((sum, plant) => sum + plant.currentBudget, 0);
  const averageROI = plants.reduce((sum, plant) => sum + plant.roi, 0) / plants.length;
  const totalProjects = plants.reduce((sum, plant) => sum + plant.projects, 0);

  const handleAdjustment = (plantId: string, adjustment: number) => {
    setPlantas(prev => prev.map(plant => {
      if (plant.id === plantId) {
        const newBudget = plant.originalBudget * (1 + adjustment / 100);
        const newROI = plant.roi * (1 + (adjustment * 0.3) / 100); // ROI simulado
        let newStatus: 'ok' | 'attention' | 'critical' = 'ok';
        
        if (adjustment < -15) newStatus = 'critical';
        else if (adjustment < -5 || adjustment > 20) newStatus = 'attention';
        
        return {
          ...plant,
          currentBudget: newBudget,
          adjustment,
          roi: Math.max(0, newROI),
          status: newStatus
        };
      }
      return plant;
    }));
  };

  const resetSimulation = () => {
    setPlantas(prev => prev.map(plant => ({
      ...plant,
      currentBudget: plant.originalBudget,
      adjustment: 0,
      roi: plant.originalBudget === 15000000 ? 15.2 :
           plant.originalBudget === 12000000 ? 12.8 :
           plant.originalBudget === 18000000 ? 18.5 :
           plant.originalBudget === 8000000 ? 8.2 :
           plant.originalBudget === 10000000 ? 11.5 : 16.8,
      status: plant.originalBudget === 8000000 ? 'critical' :
              plant.originalBudget === 12000000 || plant.originalBudget === 10000000 ? 'attention' : 'ok'
    })));
  };

  const saveScenario = () => {
    if (!scenarioName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o cenário.",
        variant: "destructive",
      });
      return;
    }

    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: scenarioName,
      description: scenarioDescription,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      totalBudget: currentTotal,
      totalROI: averageROI,
      adjustments: plants.reduce((acc, plant) => {
        acc[plant.id] = plant.adjustment;
        return acc;
      }, {} as Record<string, number>)
    };

    setSavedScenarios(prev => [...prev, newScenario]);
    setShowSaveDialog(false);
    setScenarioName('');
    setScenarioDescription('');
    
    toast({
      title: "Cenário salvo",
      description: `O cenário "${newScenario.name}" foi salvo com sucesso.`,
    });
  };

  const chartData = plants.map(plant => ({
    name: plant.name.split(' ')[0],
    original: plant.originalBudget / 1000000,
    atual: plant.currentBudget / 1000000,
    variacao: ((plant.currentBudget - plant.originalBudget) / plant.originalBudget * 100)
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'attention': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'OK';
      case 'attention': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return 'Indefinido';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulação de Cenários</h1>
          <p className="text-muted-foreground">
            Simule ajustes orçamentários e visualize impactos em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSimulation}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Cenário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Cenário</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Cenário</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Otimização Q1 2024"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Justificativa/Anotação</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o motivo dos ajustes..."
                    value={scenarioDescription}
                    onChange={(e) => setScenarioDescription(e.target.value)}
                  />
                </div>
                <Button onClick={saveScenario}>Salvar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo Consolidado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            {currentTotal !== originalTotal && (
              currentTotal > originalTotal ? 
                <TrendingUp className="h-4 w-4 text-green-600" /> :
                <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(currentTotal)}
            </div>
            {currentTotal !== originalTotal && (
              <p className={`text-xs ${currentTotal > originalTotal ? 'text-green-600' : 'text-red-600'}`}>
                {currentTotal > originalTotal ? '+' : ''}{((currentTotal - originalTotal) / originalTotal * 100).toFixed(1)}% vs original
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalProjects} projetos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plants.filter(p => p.status === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {plants.length} unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              currentTotal > originalTotal ? 'text-green-600' : 
              currentTotal < originalTotal ? 'text-red-600' : ''
            }`}>
              {((currentTotal - originalTotal) / originalTotal * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Impacto consolidado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Ajuste */}
      <Card>
        <CardHeader>
          <CardTitle>Ajustes por Unidade Fabril</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {plants.map((plant) => (
              <div key={plant.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{plant.name}</div>
                    <Badge variant="secondary">{plant.country}</Badge>
                    <Badge className={getStatusColor(plant.status)}>
                      {getStatusText(plant.status)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(plant.currentBudget)}
                    </div>
                    <div className={`text-xs ${
                      plant.adjustment > 0 ? 'text-green-600' :
                      plant.adjustment < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {plant.adjustment > 0 ? '+' : ''}{plant.adjustment.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider
                      value={[plant.adjustment]}
                      onValueChange={(value) => handleAdjustment(plant.id, value[0])}
                      max={30}
                      min={-30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={plant.adjustment.toFixed(1)}
                      onChange={(e) => handleAdjustment(plant.id, parseFloat(e.target.value) || 0)}
                      className="text-center"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo: Antes vs Depois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `R$ ${value.toFixed(1)}M`,
                  name === 'original' ? 'Original' : 'Atual'
                ]}
              />
              <Legend />
              <Bar dataKey="original" fill="hsl(var(--muted))" name="Original" />
              <Bar dataKey="atual" fill="hsl(var(--primary))" name="Atual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cenários Salvos */}
      {savedScenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cenários Salvos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedScenarios.map((scenario) => (
                <div key={scenario.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{scenario.name}</h4>
                    <div className="text-sm text-muted-foreground">{scenario.createdAt}</div>
                  </div>
                  {scenario.description && (
                    <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                  )}
                  <div className="flex gap-4 text-sm">
                    <span>
                      <strong>Orçamento:</strong> {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(scenario.totalBudget)}
                    </span>
                    <span>
                      <strong>ROI:</strong> {scenario.totalROI.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VmoLatamSimulacao;