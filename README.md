# Discord Clone

Um clone funcional do Discord construído como projeto de portfólio, replicando as principais funcionalidades da plataforma: chat em tempo real, canais de voz, servidores, amigos e notificações ao vivo.

> **Frontend** desta aplicação. O backend é uma API Rails separada que serve como base para todas as operações.

---

## Funcionalidades

- **Autenticação** — Login e registro com JWT + refresh token automático (rotação transparente via interceptor do Axios)
- **Servidores e Canais** — Navegação entre servidores, canais de texto e canais de voz
- **Chat em tempo real** — Envio e recebimento de mensagens com scroll automático
- **Canais de voz** — Salas de voz com WebRTC via LiveKit (mute, deafen, detecção de fala)
- **Mensagens Diretas** — Conversas privadas entre usuários
- **Amigos** — Lista de amigos e painel de friends
- **Notificações** — Contador de mensagens não lidas por canal via WebSocket (ActionCable)
- **Tema escuro** — Interface fiel ao design do Discord com suporte a temas

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 + React 19 |
| Autenticação | NextAuth.js (JWT, refresh token rotation) |
| HTTP Client | Axios (interceptors para auth e retry automático) |
| Dados assíncronos | TanStack React Query |
| Voz/Vídeo | LiveKit (WebRTC) |
| Tempo real | ActionCable (WebSocket Rails) |
| UI | shadcn/ui + Radix UI + Tailwind CSS v4 |
| Formulários | React Hook Form |
| Notificações | Sonner |
| Tipagem | TypeScript |

---

## Arquitetura

```
src/
├── app/
│   ├── (auth)/          # Páginas públicas: login e registro
│   ├── (server)/        # Página principal do servidor com canais
│   └── api/             # Route handlers: NextAuth e token LiveKit
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── chat/            # Lista de mensagens e itens do chat
│   ├── ChannelSidebar/  # Sidebar de canais, DMs e membros em voz
│   └── VoiceRoom/       # Interface da sala de voz (LiveKit)
├── services/            # Chamadas HTTP organizadas por recurso (axios)
├── providers/           # Contextos globais: voz, notificações, sessão, tema
├── models/              # Tipos TypeScript dos modelos da API
├── lib/                 # Configuração do NextAuth
├── hooks/               # Hooks utilitários
└── utils/               # Funções auxiliares (data, status, canais)
```

### Decisões de design

**Refresh token transparente** — O Axios possui um interceptor que captura erros 401 e executa o refresh automaticamente. Requests concorrentes que chegam durante o refresh são enfileirados e reexecutados com o novo token, evitando múltiplas chamadas de refresh simultâneas.

**Notificações via WebSocket** — O `NotificationsProvider` abre uma conexão ActionCable assim que a sessão é estabelecida e mantém um mapa de contagens de não lidos por canal, sem necessidade de polling.

**Voz com LiveKit** — O `VoiceProvider` gerencia o estado local (canal ativo, mute, deafen) enquanto o `VoiceBridge` conecta com o servidor LiveKit usando um token gerado na API route `/api/livekit/token`.

---

## Como rodar

### Pré-requisitos

- Node.js 20+
- API Rails rodando (backend separado)
- Conta LiveKit (ou servidor local)

### Variáveis de ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CABLE_URL=ws://localhost:3000/cable
NEXTAUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3001
LIVEKIT_API_KEY=sua_livekit_key
LIVEKIT_API_SECRET=seu_livekit_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://seu-projeto.livekit.cloud
```

### Instalação

```bash
npm install
npm run dev
```

Acesse [http://localhost:3001](http://localhost:3001).

---

## Screenshots

> Em breve.

---

## Autor

Desenvolvido por **Elisson** como projeto de portfólio.
