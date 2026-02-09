import { Request, Response } from 'express';
import { Image } from '../models/Image';

export const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            res.status(404).json({ error: 'Imagen no encontrada' });
            return;
        }

        res.set('Content-Type', image.contentType);
        res.send(image.data);
    } catch (error) {
        console.error('Error getting image:', error);
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
};
