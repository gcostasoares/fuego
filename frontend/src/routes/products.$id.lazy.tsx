import { createLazyFileRoute } from '@tanstack/react-router'
import { ProductListing } from '../Pages/Products'

export const Route = createLazyFileRoute('/products/$id')({
  component: ProductListing,
})
