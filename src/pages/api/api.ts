import {
    collection,
    getFirestore,
    connectFirestoreEmulator,
    orderBy,
    query,
    where,
    limit,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore'
import type { Product } from '../../utils/types'
import { app } from '../../firebase/client'

const db = getFirestore(app)
let newID = 0

// Connect to Firestore Emulator if running in the emulator environment
if (import.meta.env.PUBLIC_EMULATOR === '1')
    connectFirestoreEmulator(db, 'localhost', 8080)

// Fetch products with optional filtering and pagination
export const fetchProducts = async (
    queryStr = '',
    pageSize = 10
): Promise<{ products: Product[]; totalPages: number }> => {
    const productsRef = collection(db, 'products')
    let products: Product[] = []
    let q = query(productsRef, orderBy('id', 'asc'))

    // If a search query is provided, filter results by name
    if (queryStr) {
        q = query(
            productsRef,
            where('name', '>=', queryStr),
            orderBy('id', 'asc')
        )
    }

    const querySnapshot = await getDocs(q)
    products = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Product
        return { ...data, id: Number(data.id) }
    })

    const totalPages = Math.ceil(products.length / pageSize)

    return { products, totalPages }
}

// Add a new product with an incremented ID
export const addProduct = async (product: Omit<Product, 'id'>) => {
    const productsRef = collection(db, 'products')

    // Fetch the current max ID to increment
    const q = query(productsRef, orderBy('id', 'desc'), limit(1))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
        const lastProduct = snapshot.docs[0].data() as Product
        newID = lastProduct.id + 1
    }

    // Create and add the new product with the incremented ID
    const newProduct = { ...product, id: newID }
    const docRef = await addDoc(productsRef, newProduct)
    if (docRef.id) {
        console.log(`Product added with ID: ${newID}`)
    } else {
        console.error('Failed to add the product.')
    }

    return { id: newID, ...product }
}

// Delete a product by ID
export const deleteProduct = async (productId: number) => {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('id', '==', productId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
        const docToDelete = snapshot.docs[0]
        await deleteDoc(doc(db, 'products', docToDelete.id))
        console.log(`Product with ID ${productId} deleted.`)
        return { id: productId }
    } else {
        console.log(`Product with ID ${productId} not found.`)
    }

    return { id: 0 }
}
