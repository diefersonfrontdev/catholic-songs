"use-client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Music, Heart, Search } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre Músicas Católicas para sua Liturgia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Conectando versículos bíblicos com músicas litúrgicas perfeitas para sua celebração
          </p>
          <Link href="/home">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Acessar Aplicação
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <Search className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-xl font-semibold text-center">Busca Inteligente</h2>
              <p className="text-gray-600 text-center">
                Encontre músicas baseadas em versículos ou temas bíblicos
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-xl font-semibold text-center">Repertório Litúrgico</h2>
              <p className="text-gray-600 text-center">
                Acesso a uma biblioteca curada de músicas católicas
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <Heart className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-xl font-semibold text-center">Lista de Favoritos</h2>
              <p className="text-gray-600 text-center">
                Salve e organize suas músicas preferidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">1</div>
              <h3 className="text-xl font-semibold">Digite o Versículo</h3>
              <p className="text-gray-600">Insira o trecho bíblico da liturgia</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">2</div>
              <h3 className="text-xl font-semibold">Encontre Músicas</h3>
              <p className="text-gray-600">Receba sugestões de músicas relacionadas</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">3</div>
              <h3 className="text-xl font-semibold">Salve Favoritos</h3>
              <p className="text-gray-600">Mantenha suas músicas preferidas à mão</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/home">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}