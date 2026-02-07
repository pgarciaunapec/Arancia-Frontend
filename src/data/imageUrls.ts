// Imagen URLs centralizadas - importar solo como strings, nunca como módulos
export const imageUrls = {
  "photo-1488477181946-6428a0291777":
    "https://i.ibb.co/nqvghQfR/photo-1488477181946-6428a0291777.jpg",
  "photo-1414235077428-338989a2e8c0":
    "https://i.ibb.co/BRbJn0m/photo-1414235077428-338989a2e8c0.jpg",
  "photo-1559847844-5315695dadae":
    "https://i.ibb.co/0pVN4DX3/photo-1559847844-5315695dadae.jpg",
  "photo-1556909114-f6e7ad7d3136":
    "https://i.ibb.co/tP1sbzs0/photo-1556909114-f6e7ad7d3136.jpg",
  "photo-1552566626-52f8b828add9":
    "https://i.ibb.co/k6XTyDYJ/photo-1552566626-52f8b828add9.jpg",
  "photo-1546833998-877b37c2e5c6":
    "https://i.ibb.co/0yKZV29r/photo-1546833998-877b37c2e5c6.jpg",
  "photo-1546069901-ba9599a7e63c":
    "https://i.ibb.co/fzM0kLRh/photo-1546069901-ba9599a7e63c.jpg",
  "photo-1645112411341-6c4fd023714a":
    "https://i.ibb.co/CK9kCDPv/photo-1645112411341-6c4fd023714a.jpg",
  "photo-1633237308525-cd587cf71926":
    "https://i.ibb.co/v6sZhc8m/photo-1633237308525-cd587cf71926.jpg",
  "photo-1624353365286-3f8d62daad51":
    "https://i.ibb.co/G346DqgN/photo-1624353365286-3f8d62daad51.jpg",
  "photo-1621996346565-e3dbc646d9a9":
    "https://i.ibb.co/ZRg5kk3d/photo-1621996346565-e3dbc646d9a9.jpg",
  "photo-1615141982883-c7ad0e69fd62":
    "https://i.ibb.co/DHZpsB2p/photo-1615141982883-c7ad0e69fd62.jpg",
  "photo-1599084993091-1cb5c0721cc6":
    "https://i.ibb.co/JRNMypR1/photo-1599084993091-1cb5c0721cc6.jpg",
  "photo-1586444248902-2f64eddc13df":
    "https://i.ibb.co/LdyrTzHg/photo-1586444248902-2f64eddc13df.jpg",
  "photo-1580476262798-bddd9f4b7369":
    "https://i.ibb.co/DHNygVbq/photo-1580476262798-bddd9f4b7369.jpg",
  "photo-1577234286642-fc512a5f8f11":
    "https://i.ibb.co/d48R6S6z/photo-1577234286642-fc512a5f8f11.jpg",
  "photo-1574894709920-11b28e7367e3":
    "https://i.ibb.co/wrNrZSD5/photo-1574894709920-11b28e7367e3.jpg",
  "photo-1565958011703-44f9829ba187":
    "https://i.ibb.co/ZRQTw7cF/photo-1565958011703-44f9829ba187.jpg",
  "photo-1565557623262-b51c2513a641":
    "https://i.ibb.co/ds1yy87V/photo-1565557623262-b51c2513a641.jpg",
  "photo-1563379926898-05f4575a45d8":
    "https://i.ibb.co/BVthnd2R/photo-1563379926898-05f4575a45d8.jpg",
  "photo-1517248135467-4c7edcad34c4":
    "https://i.ibb.co/PvJb49T7/photo-1517248135467-4c7edcad34c4.jpg",
  "photo-1512621776951-a57141f2eefd":
    "https://i.ibb.co/vt2zG8d/photo-1512621776951-a57141f2eefd.jpg",
  "photo-1511795409834-ef04bbd61622":
    "https://i.ibb.co/N6r14qd0/photo-1511795409834-ef04bbd61622.jpg",
  "photo-1501443762994-82bd5dace89a":
    "https://i.ibb.co/Sw5XbKy7/photo-1501443762994-82bd5dace89a.jpg",
  "photo-1506905925346-21bda4d32df4":
    "https://i.ibb.co/pjnbj14Y/photo-1506905925346-21bda4d32df4.jpg",
};

export function getImageUrl(photoId: string): string {
  return imageUrls[photoId as keyof typeof imageUrls] || "";
}
