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
// Connect to Firestore Emulator
if (import.meta.env.PUBLIC_EMULATOR === '1')
    connectFirestoreEmulator(db, 'localhost', 8080)

// TODO Finalize this function to fetch ALL the products from Firestore
// The function also takes the query as an argument to filter the products.
// The query can be empty. In this case, return all the products.
// If the query is not empty, filter the results based on the query.
//! Order the products by ID in ascending order
export const fetchProducts = async (
    queryStr = '',
    pageSize = 10
): Promise<{ products: Product[]; totalPages: number }> => {
    const productsRef = collection(db, 'products')
    const products: Product[] = []
    let totalPages = 0

    // Your code here
    let q = query(productsRef, orderBy('id', 'asc'))

    if (queryStr) {
        q = query(
            productsRef,
            where('name', '>=', queryStr),
            orderBy('id', 'asc')
        )
    }

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        const data = doc.data() as Product
        products.push({ ...data, id: Number(doc.id) }) // Ensure `id` is a number
    })

    totalPages = Math.ceil(products.length / pageSize)

    return { products, totalPages }
}

// TODO Finalize this function to add a product to Firestore
// The new product should have an ID that is one greater than the current maximum ID in the db
export const addProduct = async (product: Omit<Product, 'id'>) => {
    let newID = 0

    // Your code here
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('id', 'desc'), limit(1))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
        const lastProduct = snapshot.docs[0].data() as Product
        newID = lastProduct.id + 1
    }

    const newProduct = { ...product, id: newID }
    await addDoc(productsRef, newProduct)

    return { id: newID, ...product }
}

// TODO Finalize this function to delete a product from Firestore
export const deleteProduct = async (productId: number) => {
    // Your code here
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('id', '==', productId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
        const docToDelete = snapshot.docs[0]
        await deleteDoc(doc(db, 'products', docToDelete.id))
        return { id: productId }
    } else {
        console.log('Product with the ID ${productId} not found')
    }

    return { id: 0 }
}
