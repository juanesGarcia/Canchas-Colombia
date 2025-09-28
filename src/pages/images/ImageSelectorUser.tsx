import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { onUploadImages } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/Button';

interface ImagePreview extends File {
  preview: string;
}

export const ImageSelectorUser: React.FC = () => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
  });

  const handleSubmit = async () => {
    if (!user || !user.token) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Por favor, inicia sesión nuevamente.',
        timer: 2000,
      });
      return;
    }

    if (images.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin imágenes',
        text: 'Debes seleccionar al menos una imagen para subir.',
        timer: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      await onUploadImages({
        id: user.id,
        files: images,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Subida exitosa!',
        text: 'Tus imágenes se subieron correctamente.',
        timer: 1500,
      });

      setImages([]);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: 'Hubo un problema al subir las imágenes.',
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const thumbs = images.map((file, index) => (
    <div
      key={index}
      className="relative w-24 h-24 rounded overflow-hidden border border-gray-300 shadow-sm"
    >
      <img
        src={file.preview}
        alt={`preview-${index}`}
        className="w-full h-full object-cover"
        onLoad={() => URL.revokeObjectURL(file.preview)}
      />
    </div>
  ));

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Subir Imágenes de Perfil
      </h2>

      <div
        {...getRootProps()}
        className="flex items-center justify-center px-6 py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400 font-medium">Suelta las imágenes aquí...</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            Arrastra y suelta imágenes aquí o haz clic para seleccionarlas
          </p>
        )}
      </div>

      {images.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-3 gap-4">{thumbs}</div>

          <div className="mt-6 text-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Subiendo...' : 'Subir Imágenes'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSelectorUser;
