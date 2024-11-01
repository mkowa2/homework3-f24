import React from 'react'
import type { Product } from '../utils/types'
import ProductCard from './ProductCard'
import '../styles/ProductList.css'

interface ProductListProps {
    products: Product[]
    currentPage: number
    totalPages: number
    setCurrentPage: (page: number) => void
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    const itemsPerPage = 10

    const renderPaginationLinks = () => {
        const links = []
        for (let i = 1; i <= totalPages; i++) {
            links.push(
                <a
                    key={i}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i)
                    }}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </a>
            )
        }
        return links
    }

    const renderProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const currentProducts = products.slice(
            startIndex,
            startIndex + itemsPerPage
        )

        return currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))
    }

    return (
        <div className="product-list">
            <h2>Products</h2>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">{renderProducts()}</div>
            )}
            <div className="pagination">{renderPaginationLinks()}</div>
        </div>
    )
}

export default ProductList
