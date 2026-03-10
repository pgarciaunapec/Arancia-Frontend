// Imagen URLs centralizadas - importar solo como strings, nunca como módulos
export const imageUrls = {
  "photo-1488477181946-6428a0291777":
    "http://localhost:5000/api/images/69b08f41369bf05115611470",
  "photo-1414235077428-338989a2e8c0":
    "http://localhost:5000/api/images/69b08f43369bf0511561148d",
  "photo-1559847844-5315695dadae":
    "http://localhost:5000/api/images/69b08f3c369bf05115611420",
  "photo-1556909114-f6e7ad7d3136":
    "http://localhost:5000/api/images/69b08f43369bf05115611497",
  "photo-1552566626-52f8b828add9":
    "http://localhost:5000/api/images/69b08f44369bf0511561149f",
  "photo-1546833998-877b37c2e5c6":
    "http://localhost:5000/api/images/69b08f3e369bf0511561144a",
  "photo-1546069901-ba9599a7e63c":
    "http://localhost:5000/api/images/69b08f33369bf051156113a0",
  "photo-1645112411341-6c4fd023714a":
    "http://localhost:5000/api/images/69b08f3b369bf05115611403",
  "photo-1633237308525-cd587cf71926":
    "http://localhost:5000/api/images/69b08f3c369bf0511561141b",
  "photo-1624353365286-3f8d62daad51":
    "http://localhost:5000/api/images/69b08f42369bf05115611482",
  "photo-1621996346565-e3dbc646d9a9":
    "http://localhost:5000/api/images/69b08f36369bf051156113c0",
  "photo-1615141982883-c7ad0e69fd62":
    "http://localhost:5000/api/images/69b08f3d369bf0511561142c",
  "photo-1599084993091-1cb5c0721cc6":
    "http://localhost:5000/api/images/69b08f39369bf051156113e8",
  "photo-1586444248902-2f64eddc13df":
    "http://localhost:5000/api/images/69b08f3e369bf05115611438",
  "photo-1580476262798-bddd9f4b7369":
    "http://localhost:5000/api/images/69b08f3a369bf051156113f3",
  "photo-1577234286642-fc512a5f8f11":
    "http://localhost:5000/api/images/69b08f41369bf05115611476",
  "photo-1574894709920-11b28e7367e3":
    "http://localhost:5000/api/images/69b08f37369bf051156113cc",
  "photo-1565958011703-44f9829ba187":
    "http://localhost:5000/api/images/69b08f3e369bf05115611442",
  "photo-1565557623262-b51c2513a641":
    "http://localhost:5000/api/images/69b08f38369bf051156113d8",
  "photo-1563379926898-05f4575a45d8":
    "http://localhost:5000/api/images/69b08f36369bf051156113c7",
  "photo-1517248135467-4c7edcad34c4":
    "http://localhost:5000/api/images/69b08f45369bf051156114b7",
  "photo-1512621776951-a57141f2eefd":
    "http://localhost:5000/api/images/69b08f34369bf051156113ae",
  "photo-1511795409834-ef04bbd61622":
    "http://localhost:5000/api/images/69b08f46369bf051156114cb",
  "photo-1501443762994-82bd5dace89a":
    "http://localhost:5000/api/images/69b08f40369bf0511561145e",
  "photo-1506905925346-21bda4d32df4":
    "http://localhost:5000/api/images/69b08f46369bf051156114d5",
};

export function getImageUrl(photoId: string): string {
  return imageUrls[photoId as keyof typeof imageUrls] || "";
}
