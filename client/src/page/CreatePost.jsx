import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    prompt: '',
    photo: '',
  });

  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Nuevo estado para la vista previa de la imagen
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAssistantChange = (e) => setAssistantMessage(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Establecer la URL de la imagen seleccionada
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateImage = async (prompt) => {
    if (prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        if (!response.ok) {
          throw new Error('Prediction failed: Error generating image: NSFW content detected.');
        }

        const blob = await response.blob();
        const base64Image = await convertBlobToBase64(blob);
        setForm({ ...form, photo: base64Image, prompt }); // Actualizar form con photo y prompt
        setErrorMessage(''); // Clear any previous error message
      } catch (err) {
        setErrorMessage('Hay contenido inválido en el prompt');
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingImg(true); // Establecer el estado generatingImg en true al inicio
  
    const formData = new FormData();
    formData.append('message', assistantMessage || 'prompt'); // Completar con "prompt" si está vacío
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    if (assistantMessage || imageFile) {
      try {
        const response = await fetch('http://localhost:8080/api/v1/assistant', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        setAssistantResponse(data.response);
  
        // Generate image with assistant's response as prompt
        if (assistantMessage) {
          await generateImage(data.response);
        }
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false); // Establecer el estado generatingImg en false al finalizar
      }
    } else {
      alert('Please provide a message for the assistant or upload an image');
      setGeneratingImg(false); // Establecer el estado generatingImg en false si no hay mensaje ni imagen
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();

    if (form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form, prompt: form.prompt || 'prompt' }), // Completar con "prompt" si está vacío
        });

        if (response.ok) {
          await response.json();
          alert('Success');
          window.location.reload(); // Recargar la página después de compartir la imagen
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#e0e3f1] text-[32px]">Crea una imagen</h1>
        <p className="mt-2 text-[#dfe4e8] text-[14px] max-w-[500px]">Dale una idea a prompter, transformará tu prompt en uno detallado y te dará una imagen de mayor calidad</p>
      </div>

      <form className="mt-16 max-w-full" onSubmit={handleSubmit}>
        <div className="md:flex md:gap-10">
          <div className="md:w-1/2 flex flex-col gap-5">
            <FormField
              labelName="Escribe tu idea"
              type="text"
              name="message"
              placeholder="dos manos sujetando un cassete con la palabra helicon dentro.."
              value={assistantMessage}
              handleChange={handleAssistantChange}
            />
            <div className="flex flex-col items-left">
              <label className="block text-sm font-medium text-white">También puedes añadir una imagen y crear similares o modificarlas </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer p-1 bg-white rounded-md font-medium text-black hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Seleccionar imagen</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="ml-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              {imagePreview && (
                <div className="relative mt-5 w-32 h-32">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-1 right-1 bg-[#383738] text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              )}
              {assistantResponse && (
                <div className="mt-5">
                  <p className="text-[#666e75] text-[14px]">{assistantResponse}</p>
                </div>
              )}
              {errorMessage && (
                <div className="mt-5">
                  <p className="text-red-500 text-[14px]">{errorMessage}</p>
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-5">
              <button
                type="submit"
                className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {generatingImg ? 'Generating...' : 'Create'}
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 h-96 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={assistantResponse}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="button"
            onClick={handleShare}
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;