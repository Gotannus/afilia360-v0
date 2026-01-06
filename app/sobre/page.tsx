"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Target, Heart, Lightbulb, Shield, Users, CheckCircle2, Sparkles, Quote } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <Link href="/" className="text-2xl font-bold text-primary">
            AFILIA<span className="text-emerald-500">360</span>
          </Link>
          <Link href="/cadastro">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Começar Agora
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Nossa História
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Transformando sonhos em <span className="text-emerald-500">realidade digital</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              O AFILIA360 nasceu de um sonho: democratizar o acesso ao marketing de afiliados e ajudar pessoas comuns a
              construírem uma vida extraordinária pela internet.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium">
                <Target className="w-4 h-4" />
                Nossa Visão
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-balance">
                Um mundo onde todos podem viver da internet
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acreditamos que a internet é a maior oportunidade de democratização de renda da história. Mas também
                sabemos que sem orientação, estrutura e produtos validados, é fácil se perder no caminho.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Por isso criamos o AFILIA360: uma plataforma completa que conecta afiliados iniciantes e experientes com
                produtos validados, métricas transparentes e todo o suporte necessário para prosperar.
              </p>
            </div>
            <div className="space-y-4">
              <Card className="p-6 border-2 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Heart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Paixão por Ensinar</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada afiliado que cresce conosco é uma prova de que estamos no caminho certo
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-2 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Lightbulb className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Inovação Constante</h3>
                    <p className="text-sm text-muted-foreground">
                      Buscamos sempre as melhores estratégias e ferramentas para nossos afiliados
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-2 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Crescimento Coletivo</h3>
                    <p className="text-sm text-muted-foreground">
                      Quando um afiliado cresce, toda a comunidade se fortalece
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">O que é o AFILIA360</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais do que uma plataforma, somos um ecossistema completo para afiliados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-all hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Produtos Validados</h3>
              <p className="text-muted-foreground">
                Cada produto passa por análise rigorosa. Você vê métricas reais de conversão, ticket médio e comissões
                antes de promover.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-all hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidade Ativa</h3>
              <p className="text-muted-foreground">
                Conecte-se com outros afiliados, compartilhe estratégias e cresça junto com pessoas que têm os mesmos
                objetivos que você.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-all hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Múltiplas Estratégias</h3>
              <p className="text-muted-foreground">
                Trabalhe com tráfego pago, orgânico, TikTok Shop, Instagram, YouTube ou qualquer canal que você dominar.
                Nós te apoiamos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Para Empresas
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-balance">
              Leve seu produto validado para <span className="text-emerald-500">milhares de afiliados</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              Se você tem um produto digital validado e quer escalar suas vendas com uma rede de afiliados qualificados,
              o AFILIA360 é a parceria ideal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Por que fazer parceria conosco?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Afiliados Qualificados</h4>
                    <p className="text-sm text-muted-foreground">
                      Nossa rede é formada por afiliados treinados em tráfego pago, orgânico e TikTok Shop
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Escala Rápida</h4>
                    <p className="text-sm text-muted-foreground">
                      Centenas de afiliados prontos para promover produtos validados imediatamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Transparência Total</h4>
                    <p className="text-sm text-muted-foreground">
                      Compartilhamos métricas reais com os afiliados, o que aumenta a confiança e as vendas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Curadoria Rigorosa</h4>
                    <p className="text-sm text-muted-foreground">
                      Só aceitamos produtos validados, protegendo a reputação de todos os parceiros
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
              <h3 className="text-xl font-bold mb-4">Requisitos para Parceria</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Produto validado com histórico de vendas comprovado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Mínimo 30 dias de vendas consistentes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Produto de qualidade com boas avaliações</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Comissões competitivas para afiliados</span>
                </li>
              </ul>
              <Link href="/enviar-produto" className="block">
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg">
                  Enviar Meu Produto para Análise
                </Button>
              </Link>
            </Card>
          </div>

          <div className="text-center p-8 rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/5">
            <p className="text-lg text-muted-foreground mb-4">
              Tem um produto validado? Envie para análise e faça parte do catálogo exclusivo do AFILIA360
            </p>
            <Link href="/enviar-produto">
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white bg-transparent"
              >
                Saiba Mais Sobre Parcerias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Histórias que nos inspiram</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja o que alguns dos nossos afiliados têm a dizer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                "O AFILIA360 mudou minha vida. Em 3 meses saí de zero para fazer minha primeira venda, e hoje já consigo
                pagar minhas contas com as comissões. A transparência das métricas me deu segurança para começar."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Maria Clara</div>
                  <div className="text-sm text-muted-foreground">Afiliada desde 2024</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                "Depois de tentar várias plataformas e perder tempo com produtos ruins, encontrei o AFILIA360. A
                curadoria de produtos é excepcional e o suporte da comunidade fez toda a diferença no meu crescimento."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Roberto Silva</div>
                  <div className="text-sm text-muted-foreground">Afiliado desde 2023</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                "Como mãe de dois filhos, eu precisava de algo flexível. O AFILIA360 me permitiu trabalhar nos meus
                horários e construir uma renda extra sem sair de casa. Hoje já penso em largar meu emprego!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Ana Paula</div>
                  <div className="text-sm text-muted-foreground">Afiliada desde 2024</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                "Já trabalhava com tráfego pago, mas faltava bons produtos para promover. No AFILIA360 encontrei
                produtos com conversão real e métricas transparentes. Meu ROI aumentou significativamente."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Carlos Eduardo</div>
                  <div className="text-sm text-muted-foreground">Afiliado desde 2023</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Nossos Pilares</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Os valores que guiam cada decisão que tomamos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Transparência Radical</h3>
              <p className="text-muted-foreground">
                Todas as métricas são reais. Sem números inflados, sem promessas vazias. Você vê exatamente o que
                esperar de cada produto.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Shield className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Qualidade Acima de Tudo</h3>
              <p className="text-muted-foreground">
                Só trabalhamos com produtos e empresas sérias que realmente entregam valor aos clientes finais.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Heart className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Crescimento Sustentável</h3>
              <p className="text-muted-foreground">
                Não acreditamos em fórmulas mágicas. Focamos em estratégias comprovadas para resultados de longo prazo.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-emerald-500/50 transition-colors">
              <Users className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Comunidade Forte</h3>
              <p className="text-muted-foreground">
                Construímos uma rede de apoio onde todos crescem juntos, compartilhando conhecimento e experiências.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para escrever sua própria história?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de afiliados que escolheram transformar suas vidas com o AFILIA360
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cadastro">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/aula-gratuita">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  Assistir Aula Gratuita
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 AFILIA360. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
