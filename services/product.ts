import apiClient from '@/lib/api-client'
import { Product } from '@/types/product'

export interface CreateProductPayload {
  name: string
  sku: string
  price: number
  category: string
  quantity:number
}

export interface UpdateProductPayload extends CreateProductPayload {}

export const getProducts = async () => {
  const response = await apiClient.get<{ products: Product[] }>('/api/products')
  return response.data
}

export const getProduct = async (id: string | number) => {
  const response = await apiClient.get<{ product: Product }>(`/api/products/${id}`)
  return response.data
}

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await apiClient.post<{ message?: string; student?: Product }>('/api/products', payload)
  return response.data
}

export const updateProduct = async (id: string | number, payload: UpdateProductPayload) => {
  const response = await apiClient.put<{ message?: string; student?: Product }>(`/api/products/${id}`, payload)
  return response.data
}

export const deleteProduct = async (id: string | number) => {
  const response = await apiClient.delete<{ message?: string }>(`/api/products/${id}`)
  return response.data
}
