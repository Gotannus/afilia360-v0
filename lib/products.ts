// Mapeamento de produtos conhecidos
export const PRODUCTS = {
  // AFILIA360
  AFILIA360_BASIC: {
    code: "FYGCVIHI",
    name: "AFILIA 360 - Basic",
    category: "AFILIA360",
  },
  AFILIA360_PRO: {
    code: "ZOXLWXI9",
    name: "AFILIA 360 - Pro",
    category: "AFILIA360",
  },
  // Livros
  LIVRO_ENQUANTO_TE_ESCOLHIA: {
    code: "JF3XMLU5", // Corrigido de JF5KMLVS para JF3XMLU5 (código correto do webhook)
    name: "Livro: Enquanto te escolhia me esqueci",
    category: "Livros",
  },
  LIVRO_CASADO_SOZINHO: {
    code: "PO4DW6TQ",
    name: "Livro: Casado e Sozinho",
    category: "Livros",
  },
  LIVRO_ME_LEMBRA: {
    code: "SEQF6JKB",
    name: "Livro: Me Lembra Quem Eu Sou",
    category: "Livros",
  },
  LIVRO_PESO_CAMA: {
    code: "GIGTIA6U",
    name: "Livro: O Peso da Cama Feita",
    category: "Livros",
  },
  LIVRO_FUGAS: {
    code: "HO2X7F4X",
    name: "Livro: Fugas Emocionais",
    category: "Livros",
  },
  // Infoprodutos
  ANGULOS_COPY: {
    code: "5YGV9ACL",
    name: "ÂNGULOS ILEGAIS DE COPY",
    category: "Infoprodutos",
  },
  MANUAL_PROMESSA: {
    code: "PNEWUY4V",
    name: "O MANUAL DA PROMESSA IRRESISTÍVEL",
    category: "Infoprodutos",
  },
  IMERSAO_COPY: {
    code: "NVPXX68S",
    name: "Imersão Copy Guerrilha",
    category: "Infoprodutos",
  },
  GRAVACAO_IMERSAO: {
    code: "7V6V04RN",
    name: "Gravação Imersão",
    category: "Infoprodutos",
  },
} as const

export const PRODUCT_CODES = Object.values(PRODUCTS).map((p) => p.code)

export function getProductByCode(code: string) {
  return Object.values(PRODUCTS).find((p) => p.code === code)
}

export function getProductFromCode(code: string) {
  return getProductByCode(code)
}

export function getProductFromWebhook(rawData: any): { code: string; name: string } | null {
  try {
    const firstItem = rawData?.items?.[0]
    if (!firstItem) return null

    const code = firstItem.code
    const name = firstItem.name

    if (!code || !name) return null

    return { code, name }
  } catch (error) {
    return null
  }
}

export function isAFILIA360Product(code: string) {
  return code === "FYGCVIHI" || code === "ZOXLWXI9"
}

export function isTestSale(productCode: string, productName?: string) {
  // Filtrar vendas de teste
  if (!productCode || !productName) return true

  // Produtos genéricos de teste
  if (productName.includes("Produto 1") || productName.includes("Produto 2") || productName.includes("Produto 3")) {
    return true
  }

  // Códigos não conhecidos (possivelmente testes)
  const knownCodes = PRODUCT_CODES
  return !knownCodes.includes(productCode)
}
