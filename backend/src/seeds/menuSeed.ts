import mongoose from 'mongoose';
import { MenuItem } from '../models/index';
import { connectDatabase } from '../config/database';

// Menu data from frontend (copied from src/data/menuData.ts)
const menuData = [
    // 🥤 Jugos Tropicales
    { name: "Agrio", category: "Jugos", price: 150, ingredients: ["Chinola", "limón", "naranja"], image: "https://lh3.googleusercontent.com/d/1tGEPmnXDq7AL38aStHexEm081CUNEbkZ" },
    { name: "Piña", category: "Jugos", price: 120, ingredients: ["Piña fresca"], image: "https://lh3.googleusercontent.com/d/1-FKB762z7ati5cGGxCduLSGF9_SNCHrl" },
    { name: "Mangola", category: "Jugos", price: 160, ingredients: ["Mango", "chinola"], image: "https://lh3.googleusercontent.com/d/1okUydf8EhEspD0hSVtDtZs5U3lxtxzAt" },
    { name: "Pasión Caribeña", category: "Jugos", price: 170, ingredients: ["Maracuyá", "frutas tropicales"], image: "https://lh3.googleusercontent.com/d/12qUzoqJX7rxQt2XhaVaJ5kjactG24xV8" },
    { name: "Sonrisa Tropical", category: "Jugos", price: 180, ingredients: ["Frutas mixtas"], image: "https://lh3.googleusercontent.com/d/1Nobycr3fnYtr3YfD5P6Eg1EQ0WMPAYq5" },
    { name: "Zapote", category: "Jugos", price: 140, ingredients: ["Zapote maduro"], image: "https://lh3.googleusercontent.com/d/11vOqHjLgspCRO083PHJKxr2qNPnQHITZ" },
    { name: "Fresa Tropical", category: "Jugos", price: 160, ingredients: ["Fresas", "leche condensada"], image: "https://lh3.googleusercontent.com/d/13U_tjM8SXNePA4G0mLvVd2ZHZ4aDZ3y2" },
    { name: "Melón", category: "Jugos", price: 130, ingredients: ["Melón", "limón"], image: "https://lh3.googleusercontent.com/d/1PpDqwkXrvtvpDDNTJKmd-8dTzo0lgnjb" },
    { name: "Granadilla", category: "Jugos", price: 170, ingredients: ["Granadilla", "miel"], image: "https://lh3.googleusercontent.com/d/1b7dX7xIBz1T26uzWm9hWoqcnn58TPDR1" },
    { name: "Lechoza", category: "Jugos", price: 150, ingredients: ["Lechoza", "jengibre"], image: "https://lh3.googleusercontent.com/d/1ukhM4mIh61fVTv2MpO2pxV4hFaiz6CeR" },
    { name: "Frechiza", category: "Jugos", price: 190, ingredients: ["Fresa", "higo", "zarzamora"], image: "https://lh3.googleusercontent.com/d/13TaxQxX-oKUal1Grx2VekuCEzFaqG8iq" },
    { name: "Combinación Tropical", category: "Jugos", price: 200, ingredients: ["Variedad de frutas tropicales"], image: "https://lh3.googleusercontent.com/d/1ZbXr4JPY5j8xgtL3-5B3T2FPwu7Ep7ur" },

    // 🍹 Cócteles Tropicales
    { name: "Vodka Tropical", category: "Cócteles", price: 350, ingredients: ["Vodka", "jugos tropicales", "hielo"], image: "https://lh3.googleusercontent.com/d/1V-x0_V07mzDJTwa99AwGUSC9zBny3u3M" },
    { name: "Copa de Sangría", category: "Cócteles", price: 300, ingredients: ["Vino tinto", "frutas", "azúcar"], image: "https://lh3.googleusercontent.com/d/13FudNjWsXqFv9mEeFv7aUp1qT-0lD_13" },
    { name: "Trabucazo", category: "Cócteles", price: 380, ingredients: ["Ron", "licores variados", "frutas"], image: "https://lh3.googleusercontent.com/d/1goRQnNUbxtt0jfncTAglk23Wkt5lSRmn" },
    { name: "Néctar Caribe", category: "Cócteles", price: 320, ingredients: ["Ron", "coco", "piña"], image: "https://lh3.googleusercontent.com/d/1UXYEzSPP5FQuCVTbW39Y2WXWQWmu1eRr" },
    { name: "Piña Colada Tropical", category: "Cócteles", price: 340, ingredients: ["Ron", "crema de coco", "piña"], image: "https://lh3.googleusercontent.com/d/1UXYEzSPP5FQuCVTbW39Y2WXWQWmu1eRr" },
    { name: "Margarita", category: "Cócteles", price: 310, ingredients: ["Tequila", "licor de naranja", "limón"], image: "https://lh3.googleusercontent.com/d/12xoFQcnRjWzdvsusfpTRhq5pOz9RhJzp" },
    { name: "Suave Diferencia", category: "Cócteles", price: 360, ingredients: ["Whiskey", "licor de durazno", "limón"], image: "https://lh3.googleusercontent.com/d/1jnKQdkzhYb8nCFYLTyt7pZAKHa_3qPeS" },
    { name: "Amor de Verano", category: "Cócteles", price: 330, ingredients: ["Vodka", "licor de fresa", "limón"], image: "https://lh3.googleusercontent.com/d/1sYRww4wLmEm0rpuTXDHQLrYUObxTjdOf" },
    { name: "Licor Tropical", category: "Cócteles", price: 280, ingredients: ["Licor de frutas tropicales"], image: "https://lh3.googleusercontent.com/d/1sYRww4wLmEm0rpuTXDHQLrYUObxTjdOf" },

    // 🍽️ Entradas / Aperitivos
    { name: "Croquetas de Pollo", category: "Entradas", price: 220, ingredients: ["Pollo desmenuzado", "pan rallado", "especias"], image: "https://lh3.googleusercontent.com/d/1W_v3msi-wuzWFMPpTmNTsFs8sV3OdviS" },
    { name: "Salchichas a la Parrilla", category: "Entradas", price: 250, ingredients: ["Salchichas premium", "salsa especial"], image: "https://lh3.googleusercontent.com/d/1FJSy70Rvl3t53xs2TGHbAA-IY8Zck1S8" },
    { name: "Medio Sabrococho", category: "Entradas", price: 180, ingredients: ["Sopa tradicional dominicana"], image: "https://lh3.googleusercontent.com/d/1xkNgLI6MaBR7NFla4-yU4SWWfSu_bM4T" },
    { name: "Arepa rellena", category: "Entradas", price: 120, ingredients: ["Harina de maíz", "queso", "aceite"], image: "https://lh3.googleusercontent.com/d/15Wxm_AtV9B1FDD4uhh0qRU1B0LKqPcQP" },
    { name: "Cóctel de Camarones", category: "Entradas", price: 380, ingredients: ["Camarones frescos", "cóctel de mariscos"], image: "https://lh3.googleusercontent.com/d/12XCtt0ddjfJ7RkVkF4wopZWUmYe-32A2" },
    { name: "Palitos del Mar", category: "Entradas", price: 280, ingredients: ["Pescado empanizado", "salsa tártara"], image: "https://lh3.googleusercontent.com/d/1lcUNCbfQvUHzfaHRNAhJ2QLhQJ7gyFCR" },
    { name: "Bolitas de Pescado", category: "Entradas", price: 260, ingredients: ["Pescado molido", "especias", "harina"], image: "https://lh3.googleusercontent.com/d/1DgZg7GoWh1h0yIh4SckEAzYa3x5mFFLH" },
    { name: "Ceviche Tropical", category: "Entradas", price: 320, ingredients: ["Pescado blanco", "limón", "cebolla morada", "cilantro"], image: "https://lh3.googleusercontent.com/d/1E4RtPtYb8TUnY7NZfF0jQSdRvvCpiy29" },
    { name: "Salpicón de Chicharrón", category: "Entradas", price: 290, ingredients: ["Chicharrón de cerdo", "verduras", "salsa"], image: "https://lh3.googleusercontent.com/d/1Pw7dWkucQQm-7e89ovqjIApV6G0MD6aI" },
    { name: "Catibías", category: "Entradas", price: 240, ingredients: ["Masa de maíz", "relleno de cerdo/queso/Angus"], image: "https://lh3.googleusercontent.com/d/1HuaM0PCoVB9kKt_E4Hg27fS5IDFR_bjB" },
    { name: "Quipe Árabe", category: "Entradas", price: 230, ingredients: ["Carne molida", "especias árabes", "pan plano"], image: "https://lh3.googleusercontent.com/d/1jrT5cOFQSTnCjSuV726GpVgKJCSkcj3J" },

    // 🍲 Sopas y Caldos
    { name: "Sabrococho", category: "Sopas", price: 200, ingredients: ["Carne de res", "yuca", "plátano", "maíz"], image: "https://lh3.googleusercontent.com/d/1LzutHOWvQ9xiXnoc4Inxk_hICsyykQgM" },
    { name: "Cocido", category: "Sopas", price: 220, ingredients: ["Carne de res", "verduras", "frijoles"], image: "https://lh3.googleusercontent.com/d/1qD2CqMpgNErKKiCrnneTGGbiPxbRgIYi" },
    { name: "Mondongo", category: "Sopas", price: 250, ingredients: ["Mondongo", "verduras", "yuca"], image: "https://lh3.googleusercontent.com/d/1jzbV76aeDHGxseb9UzO2e-CbP2c1zfwW" },
    { name: "Sopa de Pollo", category: "Sopas", price: 180, ingredients: ["Pollo", "fideos", "zanahoria", "apio"], image: "https://lh3.googleusercontent.com/d/1cvZlwWLb45VGtUPvRyGW55GJr-_hso9_" },
    { name: "Sopa del Mar", category: "Sopas", price: 320, ingredients: ["Mariscos variados", "caldo de pescado"], image: "https://lh3.googleusercontent.com/d/12J3K4p-a354D5b3EJHE0OYHy4f6EjJv-" },

    // 🍗 Fritos & Mofongos
    { name: "Mini Mofongo", category: "Fritos", price: 180, ingredients: ["Plátanos verdes", "cerdo", "caldo"], image: "https://lh3.googleusercontent.com/d/1wk8JYGAmHUnK_RudwQUeU6HkmKZLVtL9" },
    { name: "Mofongo", category: "Fritos", price: 280, ingredients: ["Plátanos verdes", "carne", "caldo"], image: "https://lh3.googleusercontent.com/d/1EeEJEW1AkVZ3lF5XNwv_AYjoE7_ku9kj" },
    { name: "Mofongo Combi", category: "Fritos", price: 320, ingredients: ["Plátanos verdes", "combinación de carnes"], image: "https://lh3.googleusercontent.com/d/1VbkmaOTcMAuLMH09hmNUwZ9DDS4g-R8r" },
    { name: "Res Frita", category: "Fritos", price: 350, ingredients: ["Carne de res frita", "tajadas", "ensalada"], image: "https://lh3.googleusercontent.com/d/1inUCfc3ioYM9exVNTxTTl6lguHH3uphq" },
    { name: "Cerdo Frito", category: "Fritos", price: 320, ingredients: ["Cerdo frito", "tajadas", "ensalada"], image: "https://lh3.googleusercontent.com/d/1SmYMW3_b54PoS3mK76yMWVcl5MziKAEI" },
    { name: "Longaniza", category: "Fritos", price: 280, ingredients: ["Longaniza dominicana", "tajadas"], image: "https://lh3.googleusercontent.com/d/1N8dfPXAOCDgj6EELcqCEXfpThqzxe89U" },
    { name: "Fritura Combi", category: "Fritos", price: 380, ingredients: ["Combinación de carnes fritas"], image: "https://lh3.googleusercontent.com/d/1iYRUh_GyO4zLFAzfmE3VCthts4RKaT4B" },
    { name: "Chichapollito", category: "Fritos", price: 260, ingredients: ["Pollo frito", "chicharrón"], image: "https://lh3.googleusercontent.com/d/12xDZJ8zbkXyyrRtgJeYcFgWiWa5fMs4K" },

    // 🍔 Sandwiches & Parrilladas
    { name: "Club", category: "Sandwiches", price: 320, ingredients: ["Pan tostado", "pollo", "tocino", "lechuga", "tomate"], image: "https://lh3.googleusercontent.com/d/17Ar0dkrvmL5Buf4t4tKiP8QBTmBzoJkO" },
    { name: "Hamburger", category: "Sandwiches", price: 280, ingredients: ["Carne de res", "queso", "lechuga", "tomate", "pan artesanal"], image: "https://lh3.googleusercontent.com/d/1BKlZSGKLPuVIC8SLlVemFVZJlgQzpppX" },
    { name: "Pollo", category: "Sandwiches", price: 260, ingredients: ["Pechuga de pollo", "lechuga", "tomate", "mayonesa"], image: "https://lh3.googleusercontent.com/d/1kf61-q265GuddM_rCLt-sMWQmDYjuGgj" },
    { name: "Solomo", category: "Sandwiches", price: 380, ingredients: ["Solomillo de res", "queso", "cebolla caramelizada"], image: "https://lh3.googleusercontent.com/d/1LXClP5gStXuz5xXWSfQ5lGLOq2CGfKkG" },
    { name: "Filete de Res", category: "Sandwiches", price: 420, ingredients: ["Filete de res", "hongos", "cebolla", "mostaza"], image: "https://lh3.googleusercontent.com/d/11jYO1uPJ4x0OsRuHXoN4Pl68dbcTa7oD" },
    { name: "Parrillada Adrián", category: "Sandwiches", price: 450, ingredients: ["Selección de carnes a la parrilla"], image: "https://lh3.googleusercontent.com/d/1ZiOVB54FZ1ER22Jjie1vTSYrGyRtG2Qk" },

    // 🍗 Carnes Asadas / Grill
    { name: "Pollo Asado", category: "Carnes Asadas", price: 400, ingredients: ["Pollo entero", "adobo tropical", "guarnición"], image: "https://lh3.googleusercontent.com/d/1osLHPqkNpwudQUV9KX_4ZTk3C0PaVq6m" },
    { name: "Chuletas de Cerdo", category: "Carnes Asadas", price: 380, ingredients: ["Chuletas de cerdo", "salsa especial"], image: "https://lh3.googleusercontent.com/d/1HGwCNwgaUds0fCqP-gWN-aLUjfa-5P0D" },
    { name: "Pechuga a la Cordon Bleu", category: "Carnes Asadas", price: 420, ingredients: ["Pechuga de pollo", "jamón", "queso", "pan rallado"], image: "https://lh3.googleusercontent.com/d/1T34ctBYUrdTCGpSzk9eEgevg7H2ueSEW" },
    { name: "Pechuga de Pollo", category: "Carnes Asadas", price: 350, ingredients: ["Pechuga de pollo a la parrilla"], image: "https://lh3.googleusercontent.com/d/1T34ctBYUrdTCGpSzk9eEgevg7H2ueSEW" },
    { name: "Filetillo de Cerdo", category: "Carnes Asadas", price: 400, ingredients: ["Filete de cerdo tierno"], image: "https://lh3.googleusercontent.com/d/1u9IJJQt3vCRIhwdSQ3uF26Sr8d1FL1Di" },
    { name: "Costillas de Cerdo", category: "Carnes Asadas", price: 480, ingredients: ["Costillas BBQ", "salsa ahumada"], image: "https://lh3.googleusercontent.com/d/1u9IJJQt3vCRIhwdSQ3uF26Sr8d1FL1Di" },

    // 🍛 Criollos y Arroces
    { name: "Asopao de Pollo", category: "Criollos", price: 280, ingredients: ["Arroz", "pollo", "verduras", "caldo"], image: "https://lh3.googleusercontent.com/d/14i4IeMh142uLJfgb0PMF23HIuvpMtims" },
    { name: "Arroz con Pollo", category: "Criollos", price: 260, ingredients: ["Arroz dorado", "pollo", "habichuelas rojas"], image: "https://lh3.googleusercontent.com/d/1XPnqXuUFROL7OO2bzHzqe5o6a9gtuuhJ" },
    { name: "Bacalao", category: "Criollos", price: 320, ingredients: ["Bacalao desalado", "ñames", "pimientos"], image: "https://lh3.googleusercontent.com/d/1qv4dnVOeGwZmAOHgvQvIteV7x7Ziwy-g" },
    { name: "Arenque", category: "Criollos", price: 300, ingredients: ["Arenque en escabeche", "plátano", "cebolla"], image: "https://lh3.googleusercontent.com/d/19l-eoGqeF2tqSUo4SOvzljwZbSO_M6Q4" },
    { name: "Chivo Guisado", category: "Criollos", price: 420, ingredients: ["Cabrito guisado", "verduras", "especias"], image: "https://lh3.googleusercontent.com/d/1-OXs03PUQXIyCRgDWdPJQEazIqXcCRp-" },
    { name: "Chowfan", category: "Criollos", price: 350, ingredients: ["Arroz frito", "verduras", "carne/pollo"], image: "https://lh3.googleusercontent.com/d/1t5P8L-SycX0Uaw8igEasCXOy0MA_4bT5" },
    { name: "Bistec de Filete", category: "Criollos", price: 450, ingredients: ["Filete de res", "cebollas", "pimientos"], image: "https://lh3.googleusercontent.com/d/17TF-iKZNj0e_JoROEhOQaEzER-A-td5R" },

    // 🥗 Ensaladas
    { name: "Constanza", category: "Ensaladas", price: 220, ingredients: ["Lechuga", "tomate", "cebolla", "atún", "huevo"], image: "https://i.ibb.co/fzM0kLRh/photo-1546069901-ba9599a7e63c.jpg" },
    { name: "Frutas", category: "Ensaladas", price: 250, ingredients: ["Frutas tropicales", "lechuga", "queso fresco"], image: "https://via.placeholder.com/400x300" },
    { name: "San Juan", category: "Ensaladas", price: 240, ingredients: ["Mix de hojas", "frutos secos", "vinagreta especial"], image: "https://i.ibb.co/vt2zG8d/photo-1512621776951-a57141f2eefd.jpg" },

    // 🍝 Pastas
    { name: "Espaguetis al Gusto", category: "Pastas", price: 280, ingredients: ["Espaguetis", "salsa de tomate", "carne molida"], image: "https://i.ibb.co/ZRg5kk3d/photo-1621996346565-e3dbc646d9a9.jpg" },
    { name: "Espaguetis con Mariscos", category: "Pastas", price: 320, ingredients: ["Espaguetis", "mariscos", "salsa blanca"], image: "https://i.ibb.co/BVthnd2R/photo-1563379926898-05f4575a45d8.jpg" },
    { name: "Canelones Rellenos", category: "Pastas", price: 350, ingredients: ["Canelones", "carne molida", "bechamel", "queso"], image: "https://i.ibb.co/wrNrZSD5/photo-1574894709920-11b28e7367e3.jpg" },

    // 🦐 Rincón Marino (Mariscos & Pescados)
    { name: "Camarofongo", category: "Rincón Marino", price: 480, ingredients: ["Camarones", "mofongo", "salsa de camarones"], image: "https://i.ibb.co/ds1yy87V/photo-1565557623262-b51c2513a641.jpg" },
    { name: "Mini Camarofongo", category: "Rincón Marino", price: 320, ingredients: ["Porción menor de camarofongo"], image: "https://i.ibb.co/ds1yy87V/photo-1565557623262-b51c2513a641.jpg" },
    { name: "Camarones al Ajillo", category: "Rincón Marino", price: 450, ingredients: ["Camarones al ajillo", "salsa tropical"], image: "https://via.placeholder.com/400x300" },
    { name: "Pescado Boca Chica", category: "Rincón Marino", price: 520, ingredients: ["Pescado fresco Boca Chica", "limón", "especias"], image: "https://i.ibb.co/JRNMypR1/photo-1599084993091-1cb5c0721cc6.jpg" },
    { name: "Pescado Samaná", category: "Rincón Marino", price: 550, ingredients: ["Pescado Samaná", "mojo criollo", "tajadas"], image: "https://i.ibb.co/DHNygVbq/photo-1580476262798-bddd9f4b7369.jpg" },
    { name: "Espaguetis Rincón Marino", category: "Rincón Marino", price: 380, ingredients: ["Espaguetis con mariscos", "salsa marinera"], image: "https://i.ibb.co/BVthnd2R/photo-1563379926898-05f4575a45d8.jpg" },
    { name: "Espaguetis con Camarones", category: "Rincón Marino", price: 420, ingredients: ["Espaguetis", "camarones", "salsa de ajo"], image: "https://i.ibb.co/CK9kCDPv/photo-1645112411341-6c4fd023714a.jpg" },
    { name: "Arroz con Camarones", category: "Rincón Marino", price: 400, ingredients: ["Arroz", "camarones", "salsa especial"], image: "https://i.ibb.co/v6sZhc8m/photo-1633237308525-cd587cf71926.jpg" },
    { name: "Asopao de Camarones", category: "Rincón Marino", price: 450, ingredients: ["Arroz", "camarones", "caldo de mariscos"], image: "https://i.ibb.co/0pVN4DX3/photo-1559847844-5315695dadae.jpg" },
    { name: "Arroz Rincón Marino", category: "Rincón Marino", price: 380, ingredients: ["Arroz con mariscos variados"], image: "https://i.ibb.co/0pVN4DX3/photo-1559847844-5315695dadae.jpg" },
    { name: "Salpicón de Mariscos", category: "Rincón Marino", price: 480, ingredients: ["Mezcla de mariscos", "salsa especial"], image: "https://i.ibb.co/DHZpsB2p/photo-1615141982883-c7ad0e69fd62.jpg" },
    { name: "Filete de Pescado", category: "Rincón Marino", price: 420, ingredients: ["Filete de pescado fresco", "preparaciones variadas"], image: "https://via.placeholder.com/400x300" },

    // 🍰 Postres
    { name: "Pudin de Pan", category: "Postres", price: 150, ingredients: ["Pan viejo", "leche", "huevos", "azúcar"], image: "https://i.ibb.co/LdyrTzHg/photo-1586444248902-2f64eddc13df.jpg" },
    { name: "Coco al Horno", category: "Postres", price: 180, ingredients: ["Coco rallado", "azúcar", "leche condensada"], image: "https://via.placeholder.com/400x300" },
    { name: "Flan de Leche", category: "Postres", price: 160, ingredients: ["Leche", "huevos", "caramelo"], image: "https://i.ibb.co/ZRQTw7cF/photo-1565958011703-44f9829ba187.jpg" },
    { name: "Ensalada de Frutas", category: "Postres", price: 140, ingredients: ["Frutas de temporada", "leche condensada"], image: "https://i.ibb.co/0yKZV29r/photo-1546833998-877b37c2e5c6.jpg" },
    { name: "Sorbete", category: "Postres", price: 120, ingredients: ["Frutas naturales", "hielo"], image: "https://i.ibb.co/Sw5XbKy7/photo-1501443762994-82bd5dace89a.jpg" },
    { name: "Leche Cortada", category: "Postres", price: 130, ingredients: ["Leche", "limón", "canela"], image: "https://i.ibb.co/nqvghQfR/photo-1488477181946-6428a0291777.jpg" },
    { name: "Frutas en Almíbar", category: "Postres", price: 170, ingredients: ["Frutas confitadas", "almíbar"], image: "https://i.ibb.co/d48R6S6z/photo-1577234286642-fc512a5f8f11.jpg" },
    { name: "Tres Leches", category: "Postres", price: 190, ingredients: ["Bizcocho", "tres tipos de leche", "merengue"], image: "https://i.ibb.co/G346DqgN/photo-1624353365286-3f8d62daad51.jpg" },
    { name: "Majarete", category: "Postres", price: 150, ingredients: ["Maíz", "leche", "canela", "pasas"], image: "https://via.placeholder.com/400x300" },
];

const seedMenu = async () => {
    try {
        await connectDatabase();

        console.log('🗑️ Eliminando datos existentes del menú...');
        await MenuItem.deleteMany({});

        console.log('📝 Insertando datos del menú...');
        const items = menuData.map(item => ({
            ...item,
            available: true,
        }));

        await MenuItem.insertMany(items);

        console.log(`✅ ${items.length} items del menú creados exitosamente`);

        // Show categories summary
        const categories = await MenuItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📊 Resumen por categoría:');
        categories.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} items`);
        });

    } catch (error) {
        console.error('❌ Error en seed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Conexión cerrada');
        process.exit(0);
    }
};

seedMenu();
