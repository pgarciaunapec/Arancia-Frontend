import type { MenuItem } from '../types';
import { getImageUrl } from './imageUrls';


export const menuData: MenuItem[] = [
  // 🥤 Jugos Tropicales
  { id: 1, name: "Agrio", category: "Jugos", price: 150, ingredients: ["Chinola", "limón", "naranja"], image: "http://localhost:5000/api/images/69b08f14369bf051156111be" },
  { id: 2, name: "Piña", category: "Jugos", price: 120, ingredients: ["Piña fresca"], image: "http://localhost:5000/api/images/69b08f15369bf051156111c5" },
  { id: 3, name: "Mangola", category: "Jugos", price: 160, ingredients: ["Mango", "chinola"], image: "http://localhost:5000/api/images/69b08f17369bf051156111cc" },
  { id: 4, name: "Pasión Caribeña", category: "Jugos", price: 170, ingredients: ["Maracuyá", "frutas tropicales"], image: "http://localhost:5000/api/images/69b08f18369bf051156111d4" },
  { id: 5, name: "Sonrisa Tropical", category: "Jugos", price: 180, ingredients: ["Frutas mixtas"], image: "http://localhost:5000/api/images/69b08f18369bf051156111dc" },
  { id: 6, name: "Zapote", category: "Jugos", price: 140, ingredients: ["Zapote maduro"], image: "http://localhost:5000/api/images/69b08f19369bf051156111e4" },
  { id: 7, name: "Fresa Tropical", category: "Jugos", price: 160, ingredients: ["Fresas", "leche condensada"], image: "http://localhost:5000/api/images/69b08f19369bf051156111ec" },
  { id: 8, name: "Melón", category: "Jugos", price: 130, ingredients: ["Melón", "limón"], image: "http://localhost:5000/api/images/69b08f1a369bf051156111f4" },
  { id: 9, name: "Granadilla", category: "Jugos", price: 170, ingredients: ["Granadilla", "miel"], image: "http://localhost:5000/api/images/69b08f1a369bf051156111fc" },
  { id: 10, name: "Lechoza", category: "Jugos", price: 150, ingredients: ["Lechoza", "jengibre"], image: "http://localhost:5000/api/images/69b08f1a369bf05115611204" },
  { id: 11, name: "Frechiza", category: "Jugos", price: 190, ingredients: ["Fresa", "higo", "zarzamora"], image: "http://localhost:5000/api/images/69b08f1b369bf0511561120c" },
  { id: 12, name: "Combinación Tropical", category: "Jugos", price: 200, ingredients: ["Variedad de frutas tropicales"], image: "http://localhost:5000/api/images/69b08f1b369bf05115611214" },

  // 🍹 Cócteles Tropicales
  { id: 13, name: "Vodka Tropical", category: "Cócteles", price: 350, ingredients: ["Vodka", "jugos tropicales", "hielo"], image: "http://localhost:5000/api/images/69b08f1b369bf0511561121c" },
  { id: 14, name: "Copa de Sangría", category: "Cócteles", price: 300, ingredients: ["Vino tinto", "frutas", "azúcar"], image: "http://localhost:5000/api/images/69b08f1c369bf05115611223" },
  { id: 15, name: "Trabucazo", category: "Cócteles", price: 380, ingredients: ["Ron", "licores variados", "frutas"], image: "http://localhost:5000/api/images/69b08f1c369bf0511561122a" },
  { id: 16, name: "Néctar Caribe", category: "Cócteles", price: 320, ingredients: ["Ron", "coco", "piña"], image: "http://localhost:5000/api/images/69b08f1d369bf05115611232" },
  { id: 17, name: "Piña Colada Tropical", category: "Cócteles", price: 340, ingredients: ["Ron", "crema de coco", "piña"], image: "http://localhost:5000/api/images/69b08f1d369bf05115611232" },
  { id: 18, name: "Margarita", category: "Cócteles", price: 310, ingredients: ["Tequila", "licor de naranja", "limón"], image: "http://localhost:5000/api/images/69b08f1d369bf0511561123a" },
  { id: 19, name: "Suave Diferencia", category: "Cócteles", price: 360, ingredients: ["Whiskey", "licor de durazno", "limón"], image: "http://localhost:5000/api/images/69b08f1d369bf0511561123c" },
  { id: 20, name: "Amor de Verano", category: "Cócteles", price: 330, ingredients: ["Vodka", "licor de fresa", "limón"], image: "http://localhost:5000/api/images/69b08f1d369bf05115611244" },
  { id: 21, name: "Licor Tropical", category: "Cócteles", price: 280, ingredients: ["Licor de frutas tropicales"], image: "http://localhost:5000/api/images/69b08f1d369bf05115611244" },

  // 🍽️ Entradas / Aperitivos
  { id: 22, name: "Croquetas de Pollo", category: "Entradas", price: 220, ingredients: ["Pollo desmenuzado", "pan rallado", "especias"], image: "http://localhost:5000/api/images/69b08f1e369bf0511561124b" },
  { id: 23, name: "Salchichas a la Parrilla", category: "Entradas", price: 250, ingredients: ["Salchichas premium", "salsa especial"], image: "http://localhost:5000/api/images/69b08f1e369bf05115611252" },
  { id: 24, name: "Medio Sabrococho", category: "Entradas", price: 180, ingredients: ["Sopa tradicional dominicana"], image: "http://localhost:5000/api/images/69b08f1e369bf05115611259" },
  { id: 25, name: "Arepa rellena", category: "Entradas", price: 120, ingredients: ["Harina de maíz", "queso", "aceite"], image: "http://localhost:5000/api/images/69b08f1e369bf05115611261" },
  { id: 26, name: "Cóctel de Camarones", category: "Entradas", price: 380, ingredients: ["Camarones frescos", "cóctel de mariscos"], image: "http://localhost:5000/api/images/69b08f1f369bf05115611269" },
  { id: 27, name: "Palitos del Mar", category: "Entradas", price: 280, ingredients: ["Pescado empanizado", "salsa tártara"], image: "http://localhost:5000/api/images/69b08f1f369bf05115611271" },
  { id: 28, name: "Bolitas de Pescado", category: "Entradas", price: 260, ingredients: ["Pescado molido", "especias", "harina"], image: "http://localhost:5000/api/images/69b08f20369bf05115611278" },
  { id: 29, name: "Ceviche Tropical", category: "Entradas", price: 320, ingredients: ["Pescado blanco", "limón", "cebolla morada", "cilantro"], image: "http://localhost:5000/api/images/69b08f21369bf05115611281"},
  { id: 30, name: "Salpicón de Chicharrón", category: "Entradas", price: 290, ingredients: ["Chicharrón de cerdo", "verduras", "salsa"], image: "http://localhost:5000/api/images/69b08f21369bf05115611289"},
  { id: 31, name: "Catibías", category: "Entradas", price: 240, ingredients: ["Masa de maíz", "relleno de cerdo/queso/Angus"], image: "http://localhost:5000/api/images/69b08f21369bf0511561128b"},
  { id: 32, name: "Quipe Árabe", category: "Entradas", price: 230, ingredients: ["Carne molida", "especias árabes", "pan plano"], image: "http://localhost:5000/api/images/69b08f22369bf05115611293" },

  // 🍲 Sopas y Caldos
  { id: 33, name: "Sabrococho", category: "Sopas", price: 200, ingredients: ["Carne de res", "yuca", "plátano", "maíz"], image: "http://localhost:5000/api/images/69b08f22369bf0511561129b" },
  { id: 34, name: "Cocido", category: "Sopas", price: 220, ingredients: ["Carne de res", "verduras", "frijoles"], image: "http://localhost:5000/api/images/69b08f23369bf051156112a3" },
  { id: 35, name: "Mondongo", category: "Sopas", price: 250, ingredients: ["Mondongo", "verduras", "yuca"], image: "http://localhost:5000/api/images/69b08f23369bf051156112ab" },
  { id: 36, name: "Sopa de Pollo", category: "Sopas", price: 180, ingredients: ["Pollo", "fideos", "zanahoria", "apio"], image: "http://localhost:5000/api/images/69b08f23369bf051156112b3" },
  { id: 37, name: "Sopa del Mar", category: "Sopas", price: 320, ingredients: ["Mariscos variados", "caldo de pescado"], image: "http://localhost:5000/api/images/69b08f24369bf051156112bb" },

  // 🍗 Fritos & Mofongos
  { id: 38, name: "Mini Mofongo", category: "Fritos", price: 180, ingredients: ["Plátanos verdes", "cerdo", "caldo"], image: "http://localhost:5000/api/images/69b08f24369bf051156112c4" },
  { id: 39, name: "Mofongo", category: "Fritos", price: 280, ingredients: ["Plátanos verdes", "carne", "caldo"], image: "http://localhost:5000/api/images/69b08f25369bf051156112cd" },
  { id: 40, name: "Mofongo Combi", category: "Fritos", price: 320, ingredients: ["Plátanos verdes", "combinación de carnes"], image: "http://localhost:5000/api/images/69b08f25369bf051156112d6" },
  { id: 41, name: "Res Frita", category: "Fritos", price: 350, ingredients: ["Carne de res frita", "tajadas", "ensalada"], image: "http://localhost:5000/api/images/69b08f26369bf051156112df" },
  { id: 42, name: "Cerdo Frito", category: "Fritos", price: 320, ingredients: ["Cerdo frito", "tajadas", "ensalada"], image: "http://localhost:5000/api/images/69b08f26369bf051156112e7" },
  { id: 43, name: "Longaniza", category: "Fritos", price: 280, ingredients: ["Longaniza dominicana", "tajadas"], image: "http://localhost:5000/api/images/69b08f26369bf051156112ef" },
  { id: 44, name: "Fritura Combi", category: "Fritos", price: 380, ingredients: ["Combinación de carnes fritas"], image: "http://localhost:5000/api/images/69b08f27369bf051156112f8" },
  { id: 45, name: "Chichapollito", category: "Fritos", price: 260, ingredients: ["Pollo frito", "chicharrón"], image: "http://localhost:5000/api/images/69b08f28369bf05115611302" },

  // 🍔 Sandwiches & Parrilladas
  { id: 46, name: "Club", category: "Sandwiches", price: 320, ingredients: ["Pan tostado", "pollo", "tocino", "lechuga", "tomate"], image: "http://localhost:5000/api/images/69b08f28369bf0511561130c" },
  { id: 47, name: "Hamburger", category: "Sandwiches", price: 280, ingredients: ["Carne de res", "queso", "lechuga", "tomate", "pan artesanal"], image: "http://localhost:5000/api/images/69b08f29369bf05115611315" },
  { id: 48, name: "Pollo", category: "Sandwiches", price: 260, ingredients: ["Pechuga de pollo", "lechuga", "tomate", "mayonesa"], image: "http://localhost:5000/api/images/69b08f2a369bf0511561131e" },
  { id: 49, name: "Solomo", category: "Sandwiches", price: 380, ingredients: ["Solomillo de res", "queso", "cebolla caramelizada"], image: "http://localhost:5000/api/images/69b08f2a369bf05115611327" },
  { id: 50, name: "Filete de Res", category: "Sandwiches", price: 420, ingredients: ["Filete de res", "hongos", "cebolla", "mostaza"], image: "http://localhost:5000/api/images/69b08f2b369bf05115611330" },
  { id: 51, name: "Parrillada Adrián", category: "Sandwiches", price: 450, ingredients: ["Selección de carnes a la parrilla"], image: "http://localhost:5000/api/images/69b08f2c369bf05115611339" },

  // 🍗 Carnes Asadas / Grill
  { id: 52, name: "Pollo", category: "Carnes Asadas", price: 400, ingredients: ["Pollo entero", "adobo tropical", "guarnición"], image: "http://localhost:5000/api/images/69b08f2c369bf05115611343" },
  { id: 53, name: "Chuletas de Cerdo", category: "Carnes Asadas", price: 380, ingredients: ["Chuletas de cerdo", "salsa especial"], image: "http://localhost:5000/api/images/69b08f2d369bf0511561134d" },
  { id: 54, name: "Pechuga a la Cordon Bleu", category: "Carnes Asadas", price: 420, ingredients: ["Pechuga de pollo", "jamón", "queso", "pan rallado"], image: "http://localhost:5000/api/images/69b08f2e369bf05115611356" },
  { id: 55, name: "Pechuga de Pollo", category: "Carnes Asadas", price: 350, ingredients: ["Pechuga de pollo a la parrilla"], image: "http://localhost:5000/api/images/69b08f2e369bf05115611356" },
  { id: 56, name: "Filetillo de Cerdo", category: "Carnes Asadas", price: 400, ingredients: ["Filete de cerdo tierno"], image: "http://localhost:5000/api/images/69b08f2e369bf0511561135f" },
  { id: 57, name: "Costillas de Cerdo", category: "Carnes Asadas", price: 480, ingredients: ["Costillas BBQ", "salsa ahumada"], image: "http://localhost:5000/api/images/69b08f2e369bf0511561135f" },

  // 🍛 Criollos y Arroces
  { id: 58, name: "Asopao de Pollo", category: "Criollos", price: 280, ingredients: ["Arroz", "pollo", "verduras", "caldo"], image: "http://localhost:5000/api/images/69b08f2f369bf05115611367" },
  { id: 59, name: "Arroz con Pollo", category: "Criollos", price: 260, ingredients: ["Arroz dorado", "pollo", "habichuelas rojas"], image: "http://localhost:5000/api/images/69b08f30369bf0511561136f" },
  { id: 60, name: "Bacalao", category: "Criollos", price: 320, ingredients: ["Bacalao desalado", "ñames", "pimientos"], image: "http://localhost:5000/api/images/69b08f30369bf05115611377" },
  { id: 61, name: "Arenque", category: "Criollos", price: 300, ingredients: ["Arenque en escabeche", "plátano", "cebolla"], image: "http://localhost:5000/api/images/69b08f31369bf0511561137f" },
  { id: 62, name: "Chivo Guisado", category: "Criollos", price: 420, ingredients: ["Cabrito guisado", "verduras", "especias"], image: "http://localhost:5000/api/images/69b08f31369bf05115611387" },
  { id: 63, name: "Chowfan", category: "Criollos", price: 350, ingredients: ["Arroz frito", "verduras", "carne/pollo"], image: "http://localhost:5000/api/images/69b08f32369bf0511561138f" },
  { id: 64, name: "Bistec de Filete", category: "Criollos", price: 450, ingredients: ["Filete de res", "cebollas", "pimientos"], image: "http://localhost:5000/api/images/69b08f32369bf05115611398" },

  // 🥗 Ensaladas
  { id: 65, name: "Constanza", category: "Ensaladas", price: 220, ingredients: ["Lechuga", "tomate", "cebolla", "atún", "huevo"], image: "http://localhost:5000/api/images/69b08f33369bf051156113a0" },
  { id: 66, name: "Frutas", category: "Ensaladas", price: 250, ingredients: ["Frutas tropicales", "lechuga", "queso fresco"], image: "https://via.placeholder.com/400x300" },
  { id: 67, name: "San Juan", category: "Ensaladas", price: 240, ingredients: ["Mix de hojas", "frutos secos", "vinagreta especial"], image: "http://localhost:5000/api/images/69b08f34369bf051156113ae" },

  // 🍝 Pastas
  { id: 68, name: "Espaguetis al Gusto", category: "Pastas", price: 280, ingredients: ["Espaguetis", "salsa de tomate", "carne molida"], image: "http://localhost:5000/api/images/69b08f36369bf051156113c0" },
  { id: 69, name: "Espaguetis con Mariscos", category: "Pastas", price: 320, ingredients: ["Espaguetis", "mariscos", "salsa blanca"], image: "http://localhost:5000/api/images/69b08f36369bf051156113c7" },
  { id: 70, name: "Canelones Rellenos", category: "Pastas", price: 350, ingredients: ["Canelones", "carne molida", "bechamel", "queso"], image: "http://localhost:5000/api/images/69b08f37369bf051156113cc" },

  // 🦐 Rincón Marino (Mariscos & Pescados)
  { id: 71, name: "Camarofongo", category: "Rincón Marino", price: 480, ingredients: ["Camarones", "mofongo", "salsa de camarones"], image: "http://localhost:5000/api/images/69b08f38369bf051156113d8" },
  { id: 72, name: "Mini Camarofongo", category: "Rincón Marino", price: 320, ingredients: ["Porción menor de camarofongo"], image: "http://localhost:5000/api/images/69b08f38369bf051156113d8" },
  { id: 73, name: "Camarones al Ajillo", category: "Rincón Marino", price: 450, ingredients: ["Camarones al ajillo", "salsa tropical"], image: "https://via.placeholder.com/400x300" },
  { id: 74, name: "Pescado Boca Chica", category: "Rincón Marino", price: 520, ingredients: ["Pescado fresco Boca Chica", "limón", "especias"], image: "http://localhost:5000/api/images/69b08f39369bf051156113e8" },
  { id: 75, name: "Pescado Samaná", category: "Rincón Marino", price: 550, ingredients: ["Pescado Samaná", "mojo criollo", "tajadas"], image: "http://localhost:5000/api/images/69b08f3a369bf051156113f3" },
  { id: 76, name: "Espaguetis Rincón Marino", category: "Rincón Marino", price: 380, ingredients: ["Espaguetis con mariscos", "salsa marinera"], image: "http://localhost:5000/api/images/69b08f36369bf051156113c7" },
  { id: 77, name: "Espaguetis con Camarones", category: "Rincón Marino", price: 420, ingredients: ["Espaguetis", "camarones", "salsa de ajo"], image: "http://localhost:5000/api/images/69b08f3b369bf05115611403" },
  { id: 78, name: "Arroz con Camarones", category: "Rincón Marino", price: 400, ingredients: ["Arroz", "camarones", "salsa especial"], image: "http://localhost:5000/api/images/69b08f3c369bf0511561141b" },
  { id: 79, name: "Asopao de Camarones", category: "Rincón Marino", price: 450, ingredients: ["Arroz", "camarones", "caldo de mariscos"], image: "http://localhost:5000/api/images/69b08f3c369bf05115611420" },
  { id: 80, name: "Arroz Rincón Marino", category: "Rincón Marino", price: 380, ingredients: ["Arroz con mariscos variados"], image: "http://localhost:5000/api/images/69b08f3c369bf05115611420" },
  { id: 81, name: "Salpicón de Mariscos", category: "Rincón Marino", price: 480, ingredients: ["Mezcla de mariscos", "salsa especial"], image: "http://localhost:5000/api/images/69b08f3d369bf0511561142c" },
  { id: 82, name: "Filete de Pescado", category: "Rincón Marino", price: 420, ingredients: ["Filete de pescado fresco", "preparaciones variadas"], image: "https://via.placeholder.com/400x300" },

  // 🍰 Postres
  { id: 83, name: "Pudin de Pan", category: "Postres", price: 150, ingredients: ["Pan viejo", "leche", "huevos", "azúcar"], image: "http://localhost:5000/api/images/69b08f3e369bf05115611438" },
  { id: 84, name: "Coco al Horno", category: "Postres", price: 180, ingredients: ["Coco rallado", "azúcar", "leche condensada"], image: "https://via.placeholder.com/400x300" },
  { id: 85, name: "Flan de Leche", category: "Postres", price: 160, ingredients: ["Leche", "huevos", "caramelo"], image: "http://localhost:5000/api/images/69b08f3e369bf05115611442" },
  { id: 86, name: "Ensalada de Frutas", category: "Postres", price: 140, ingredients: ["Frutas de temporada", "leche condensada"], image: "http://localhost:5000/api/images/69b08f3e369bf0511561144a" },
  { id: 87, name: "Sorbete", category: "Postres", price: 120, ingredients: ["Frutas naturales", "hielo"], image: "http://localhost:5000/api/images/69b08f40369bf0511561145e" },
  { id: 88, name: "Leche Cortada", category: "Postres", price: 130, ingredients: ["Leche", "limón", "canela"], image: "http://localhost:5000/api/images/69b08f41369bf05115611470" },
  { id: 89, name: "Frutas en Almíbar", category: "Postres", price: 170, ingredients: ["Frutas confitadas", "almíbar"], image: "http://localhost:5000/api/images/69b08f41369bf05115611476" },
  { id: 90, name: "Tres Leches", category: "Postres", price: 190, ingredients: ["Bizcocho", "tres tipos de leche", "merengue"], image: "http://localhost:5000/api/images/69b08f42369bf05115611482" },
  { id: 91, name: "Majarete", category: "Postres", price: 150, ingredients: ["Maíz", "leche", "canela", "pasas"], image: "https://via.placeholder.com/400x300" }
];
