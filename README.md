# 📄 OCR API - Extração de Texto de PDFs

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PDF-FF6B6B?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white" alt="PDF" />
</p>

<p align="center">
  Uma API robusta e segura para extração de texto de documentos PDF usando OCR, construída com NestJS e TypeScript.
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a>
</p>

---

## 🚀 Funcionalidades

- ✅ **Extração de Texto de PDFs**: Converte documentos PDF em texto legível
- ✅ **Suporte a Base64**: Aceita PDFs codificados em Base64
- ✅ **Validação Robusta**: Validação completa de headers PDF e estrutura de arquivos
- ✅ **Segurança**: Sanitização de entrada e logging seguro com hashes MD5/SHA1
- ✅ **Tratamento de Erros**: Validação de integridade e detecção de arquivos truncados
- ✅ **API RESTful**: Interface limpa e bem documentada
- ✅ **TypeScript**: Código totalmente tipado para maior segurança

## 🛠️ Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem estática
- **[pdf2json](https://www.npmjs.com/package/pdf2json)** - Biblioteca para parsing de PDFs
- **[Express](https://expressjs.com/)** - Framework web minimalista

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Clonando o projeto

```bash
git clone <repository-url>
cd ocr
```

### Instalando dependências

```bash
# Com npm
npm install

# Com yarn
yarn install
```

### Configuração

1. Copie o arquivo de exemplo de ambiente:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```env
PORT=3001
```

## 🚀 Uso

### Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3001`

### Exemplo de uso

```bash
curl -X POST http://localhost:3001/ocr/base64 \
  -H "Content-Type: application/json" \
  -d '{
    "base64": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAo...",
    "fileName": "documento.pdf",
    "mimeType": "application/pdf"
  }'
```

## 📡 API Endpoints

### POST `/ocr/base64`

Extrai texto de um PDF fornecido em formato Base64.

#### Request Body

```json
{
  "base64": "string",     // PDF codificado em Base64 (obrigatório)
  "fileName": "string",   // Nome do arquivo (opcional)
  "mimeType": "string"    // Tipo MIME (opcional, padrão: application/pdf)
}
```

#### Response

```json
{
  "text": "Texto extraído do PDF..."
}
```

#### Status Codes

- `200` - Sucesso na extração do texto
- `400` - Erro de validação (Base64 inválido, PDF corrompido, etc.)
- `500` - Erro interno do servidor

#### Exemplos de Erro

```json
{
  "statusCode": 400,
  "message": "Base64 truncado (contém reticências \"…\"). Reenvie o conteúdo completo, sem cortes."
}
```

## 🏗️ Arquitetura

O projeto segue a arquitetura modular do NestJS:

```
src/
├── modules/
│   └── ocr/
│       ├── ocr.controller.ts     # Controlador REST
│       ├── ocr.service.ts        # Lógica de negócio
│       ├── ocr.module.ts         # Módulo NestJS
│       ├── interfaces/
│       │   └── ocr.interfaces.ts # Interfaces TypeScript
│       └── interceptors/
│           └── pdf-upload.interceptor.ts # Interceptador para upload
├── utils/
│   └── sanitizeBase64PDF.utils.ts # Utilitários de validação
├── app.module.ts                  # Módulo principal
└── main.ts                       # Ponto de entrada
```

### Componentes Principais

#### 🔍 OcrService
- Responsável pela conversão de PDF para texto
- Utiliza a biblioteca `pdf2json` para parsing
- Gerencia arquivos temporários de forma segura

#### 🛡️ Validação e Segurança
- **Sanitização de Base64**: Remove prefixos, corrige padding e formato URL-safe
- **Validação de Headers**: Verifica se o arquivo é um PDF válido
- **Verificação de Integridade**: Valida estrutura xref e detecta arquivos truncados
- **Logging Seguro**: Usa hashes MD5/SHA1 para logging sem expor dados sensíveis

#### ⚡ Tratamento de Erros
- Detecção de Base64 truncado ou inválido
- Validação de estrutura PDF
- Tratamento gracioso de arquivos corrompidos

## 🧪 Desenvolvimento

### Scripts disponíveis

```bash
# Desenvolvimento com hot reload
npm run start:dev

# Build da aplicação
npm run build

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Linting
npm run lint

# Formatação de código
npm run format
```

### Estrutura de Testes

```bash
# Executar todos os testes
npm run test

# Testes com watch mode
npm run test:watch

# Testes end-to-end
npm run test:e2e
```

### Linting e Formatação

O projeto usa ESLint e Prettier para manter a qualidade do código:

```bash
# Verificar linting
npm run lint

# Corrigir problemas de linting
npm run lint -- --fix

# Formatar código
npm run format
```

## 📝 Logs e Monitoramento

A aplicação gera logs estruturados para facilitar o monitoramento:

```
[OCR] PDF recebido: size=1024000 md5=a1b2c3... sha1=x1y2z3...
```

## 🔐 Segurança

- **Validação de Entrada**: Verificação rigorosa de formato e integridade de PDFs
- **Sanitização**: Limpeza e validação de dados Base64
- **Logs Seguros**: Nunca expõe conteúdo sensível nos logs
- **Gestão de Memória**: Limpeza automática de arquivos temporários

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- 🐛 [Reportar um bug](../../issues)
- 💡 [Solicitar uma feature](../../issues)
- 📖 [Documentação do NestJS](https://docs.nestjs.com)

---

<p align="center">
  Feito com ❤️ usando NestJS
</p>
