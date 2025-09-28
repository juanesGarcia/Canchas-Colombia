import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { onUploadImages, onUploadImagesServices } from '../../api/auth'; // asegúrate que existan
import { useNavigate } from 'react-router-dom';

interface ImageSelectorProps {
  userId: string;
  type?: 'service' | 'promotion'; // 👉 opcional
}

interface ImagePreview extends File {
  preview: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ userId, type }) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  const handleSubmit = async () => {
    if (acceptedFiles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '¡Aviso!',
        text: 'Por favor, selecciona al menos una imagen.',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      if (type) {
        // 👇 Si se pasa type (service o promotion), usar la API especializada
        await onUploadImagesServices({
          id: userId,
          files: [...acceptedFiles] 
        });
      } else {
        // 👇 Si no se pasa type, usar la API genérica
        await onUploadImages({
          id: userId,
          files: [...acceptedFiles] ,
        });
      }

      Swal.fire({
        icon: 'success',
        title: '¡Subida exitosa!',
        text: 'Las imágenes se han subido correctamente.',
        showConfirmButton: false,
        timer: 1500,
      });

      setImages([]);
      navigate('/Dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: 'Hubo un problema al subir las imágenes. Por favor, inténtalo de nuevo.',
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const thumbs = images.map((file) => (
    <div key={file.name} className="mr-2 mb-2">
      <img
        src={file.preview}
        alt={file.name}
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
        onLoad={() => URL.revokeObjectURL(file.preview)}
      />
    </div>
  ));

  return (
    <div className="container mt-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Sube imágenes para tu {type === 'service' ? 'servicio' : type === 'promotion' ? 'promoción' : 'elemento'}
      </h3>

      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer bg-gray-50 dark:bg-gray-800">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Suelta las imágenes aquí...</p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas</p>
        )}
      </div>
      <div>{userId}</div>

      <aside className="flex flex-wrap mt-4">{thumbs}</aside>

      {images.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-150"
          >
            {loading ? 'Subiendo...' : 'Subir Imágenes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
