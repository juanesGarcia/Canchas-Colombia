import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { onUploadImages } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

interface ImagePreview extends File {
  preview: string;
}

export const ImageSelector: React.FC = () => {
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

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  const handleSubmit = async () => {
    if (!user || !user.token) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'No se pudo obtener el token de usuario. Por favor, inicia sesión de nuevo.',
        showConfirmButton: false,
        timer: 2000,
      });
      setLoading(false);
      return;
    }

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

    const mutableFiles = [...acceptedFiles];

    try {
      await onUploadImages({
        id: user.id,
        files: mutableFiles,
        description: '',
        token: user.token,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Subida exitosa!',
        text: 'Las imágenes se han subido correctamente.',
        showConfirmButton: false,
        timer: 1500,
      });
      
      setImages([]);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: 'Hubo un problema al subir las imágenes. Por favor, inténtalo de nuevo.' + error,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const thumbs = images.map((file) => (
    <div key={file.name}>
      <img
        src={file.preview}
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        alt={file.name}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  return (
    <div className="container">
      <div {...getRootProps()} className="dropzone-area">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta las imágenes aquí...</p>
        ) : (
          <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionarlas</p>
        )}
      </div>

      <aside style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
        {thumbs}
      </aside>

      {images.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Subiendo...' : 'Subir Imágenes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;