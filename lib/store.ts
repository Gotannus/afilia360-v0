"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, RankingMember } from "./products-data"
import { products as initialProducts, initialRanking } from "./products-data"

export interface Announcement {
  id: string
  text: string
  type: "info" | "promo" | "update" | "alert"
  active: boolean
  createdAt: string
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    text: "5 NOVOS CRIATIVOS adicionados no Gerador de Criativos IA",
    type: "update",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    text: "FINAL DE SEMANA com 10% a mais de comissão em todos os produtos!",
    type: "promo",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    text: "Nova página de vendas disponível no Recreador - Confira o Drive!",
    type: "update",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    text: "SORTEIO PIX R$500 para os top 3 afiliados da semana!",
    type: "alert",
    active: true,
    createdAt: new Date().toISOString(),
  },
]

interface StoreState {
  products: Product[]
  ranking: RankingMember[]
  announcements: Announcement[]
  _version: number
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addRankingMember: (member: RankingMember) => void
  updateRankingMember: (id: string, member: Partial<RankingMember>) => void
  deleteRankingMember: (id: string) => void
  reorderRanking: (members: RankingMember[]) => void
  addAnnouncement: (announcement: Announcement) => void
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void
  deleteAnnouncement: (id: string) => void
}

const CURRENT_VERSION = 5

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: initialProducts,
      ranking: initialRanking,
      announcements: initialAnnouncements,
      _version: CURRENT_VERSION,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      addRankingMember: (member) => set((state) => ({ ranking: [...state.ranking, member] })),
      updateRankingMember: (id, updatedMember) =>
        set((state) => ({
          ranking: state.ranking.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)),
        })),
      deleteRankingMember: (id) =>
        set((state) => ({
          ranking: state.ranking.filter((m) => m.id !== id),
        })),
      reorderRanking: (members) => set({ ranking: members }),
      addAnnouncement: (announcement) => set((state) => ({ announcements: [...state.announcements, announcement] })),
      updateAnnouncement: (id, updatedAnnouncement) =>
        set((state) => ({
          announcements: state.announcements.map((a) => (a.id === id ? { ...a, ...updatedAnnouncement } : a)),
        })),
      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),
    }),
    {
      name: "afilia360-storage",
      version: CURRENT_VERSION,
      migrate: (persistedState: any, version: number) => {
        if (version < CURRENT_VERSION) {
          return {
            products: initialProducts,
            ranking: initialRanking,
            announcements: initialAnnouncements,
            _version: CURRENT_VERSION,
          }
        }
        return persistedState as StoreState
      },
    },
  ),
)
