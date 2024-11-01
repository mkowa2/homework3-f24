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

    // TODO Render the products in the grid
    // This component is given the full list of products and the current page
    // Return a list of ProductCard components for the products on the current page
    const renderProducts = () => {
        // Your code here
        const links = []
        const startingIndex = (currentPage - 1) * 10
        const endingIndex = startingIndex + 10
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
