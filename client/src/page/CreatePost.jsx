import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAssistantChange = (e) => setAssistantMessage(e.target.value);
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

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

        const blob = await response.blob();
        const base64Image = await convertBlobToBase64(blob);
        setForm({ ...form, photo: base64Image, prompt }); // Actualizar form con photo y prompt
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('message', assistantMessage);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (assistantMessage) {
      try {
        const response = await fetch('http://localhost:8080/api/v1/assistant', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setAssistantResponse(data.response);

        // Generate image with assistant's response as prompt
        await generateImage(data.response);
      } catch (err) {
        alert(err);
      }
    } else {
      alert('Please provide a message for the assistant');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        if (response.ok) {
          await response.json();
          alert('Success');
          navigate('/');
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
        <h1 className="font-extrabold text-[#e0e3f1] text-[32px]">Create</h1>
        <p className="mt-2 text-[#dfe4e8] text-[14px] max-w-[500px]">Dale una idea a prompter, transformará tu prompt en uno detallado y te dará una imagen de calidad</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Message"
            type="text"
            name="message"
            placeholder="Ask the assistant..."
            value={assistantMessage}
            handleChange={handleAssistantChange}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {assistantResponse && (
            <div className="mt-5">
              <p className="text-[#666e75] text-[14px]">{assistantResponse}</p>
            </div>
          )}
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={assistantResponse}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="submit"
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Create'}
          </button>
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