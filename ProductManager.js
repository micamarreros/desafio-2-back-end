const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    constructor(path) {
        this.products = [];
        // la clase debe contar con una variable this.path que se inicializara desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia
        this.path = path;
    }

    async addProduct(newObject) {
        let {title, description, price, thumbnail, code, stock} = newObject;
        // validacion para que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Completá todos los campos porfavor");
            return;
        }

        // validacion para que el codigo sea unico
        if (this.products.some(item=> item.code === code)) {
            console.log("El código ingresado ya existe");
            return;
        }

        // creo el objeto
        const newProduct = {
            id: ++ProductManager.lastId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        // lo agrego al array
        this.products.push(newProduct);

        // guardar el array en el archivo
        await this.saveFile(this.products);
    } 

    //leer el archivo y devolver los productos en formato de arreglo
    getProducts() {
        console.log(this.products);
    }

    async getProductById(id) {
        try {
            const productsArray = await this.readFile();
            const searchProduct = productsArray.find(item => item.id === id);

            if (!searchProduct) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado");
                return searchProduct;
            }

        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const productsArray = JSON.parse(response);
            return productsArray;
        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    async saveFile(productsArray) {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArray, null, 2));
        } catch (error) {
            console.log("Error al guardar archivo", error);
        }
    }
    
    // desafio 2: debe recibir un id y tras leer el archivo debe buscar el producto con el id especificado y devolverlo en formato objeto 
    async getProductById(id) {
        try {
            const productsArray = await this.readFile();
            const searchProduct = productsArray.find(item => item.id === id);

            if (!searchProduct) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado");
                return searchProduct;
            }

        } catch (error) {
            console.log("Error al leer archivo", error);
        }
    }

    // debe tener un metodo "updateProduct" que debe recibir el id del producto a actualizar, asi tambien como el campo a actualizar (puede ser el objeto completo como en una DB) y debe actualizar el producto que tenga ese id en el archivo  (NO DEBE BORRARSE SU ID)
    async updateProduct(id, updatedProduct) {
        try {
            const productsArray = await this.readFile();
            
            const index = productsArray.findIndex(item => item.id === id);
    
            if(index !== -1) {
                productsArray.splice(index, 1, updatedProduct);
                await this.saveFile(productsArray);
            } else {
                console.log("No se encontró el producto");
            }
    
        } catch (error) {
            console.log("Error al actualizar producto", error);
        }
    }

    // debe tener un metodo "deleteProduct" que debe recibir un id y debe eliminar el producto que tenga ese id en el archivo
    async deleteProduct(id) {
        try {
            const deleteAProduct = this.products.filter(item => item.id !== id)

            if(deleteAProduct) {
                console.log("Se eliminó el producto");
                this.products = deleteAProduct;
                await this.saveFile();
            } else {
                console.log("Error al eliminar producto");
            }
        } catch (error) {
            
        }
    }
}

//Testing
// crear instancia de ProductManager
const manager = new ProductManager("./productos.json");

// llamar a getProducts debe devolver un arreglo vacio
manager.getProducts();

//Se llamará al método “addProduct” con los campos:
//title: “producto prueba”
//description:”Este es un producto prueba”
//price:200,
//thumbnail:”Sin imagen”
//code:”abc123”,
//stock:25

const producto1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}

manager.addProduct(producto1);
// el producto debe agregarse satisfactoriamente con un id generado automaticamente sin repetirse

// llamar al metodo getProducts nuevamente, esta vez debe aparecer el producto recien agregado
manager.getProducts();

// agrego un 2do y 3er producto y vuelvo a llamar a getProducts nuevamente 
const producto2 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}

manager.addProduct(producto2);

const producto3 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc125",
    stock: 25
}

manager.addProduct(producto3);

manager.getProducts();

// llamar a getProductById y corroborar que devuelva el producto con el id especificado, en caso de no existir debe arrojar un error
async function testSearchById() {
    const searchProduct = await manager.getProductById(2);
    console.log(searchProduct);
}

testSearchById();

// llamar al metodo updateProduct y se intentara cambiar un campo de algun producto
// se evaluara que no se elimine el id y que si se haya hecho la actualizacion

const product1 = {
    id: 1,
    title: "producto prueba",
    description: "Este es un producto ACTUALIZADO",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}

async function testUpdate() {
    await manager.updateProduct(1, product1);
}

testUpdate();

// llamar al metodo deleteProduct. evaluar que realmente no se elimine el producto o que arroje algun error en caso de no existir
async function testDelete() {
    await manager.deleteProduct(1);
}

testDelete();