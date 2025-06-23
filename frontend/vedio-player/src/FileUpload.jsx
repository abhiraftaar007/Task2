import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PreviewURL from './PreviewURL';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadURL, setDLURL] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [fileType, setFileType] = useState('');
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setMessage('');
        setDLURL('');
    }

    const getFileType = (file) => {
        if (!file) return '';
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type === 'application/pdf') return 'pdf';
        return 'other';
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setMessage('Please choose a file first');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (evt) => {
                    // evt.total is only available in browsers
                    if (evt.total) {
                        const percent = Math.round((evt.loaded * 100) / evt.total);
                        setProgress(percent);
                    }
                }
            });

            setProgress(100);
            setTimeout(() => setProgress(0), 500);

            setMessage(`${data.message} (${data.size})`);
            setDLURL(data.downloadFile);
            setPreviewUrl(data.previewUrl);
            setFileType(getFileType(file));

        } catch (err) {
            setProgress(0);
            const txt = err.response?.data?.error || 'Upload failed';
            setMessage(txt);
        }
    }

    const handleDownload = async () => {
        if (!downloadURL) return setMessage('No file to download yet');
        try {
            const res = await axios.get(downloadURL, { responseType: 'blob' });
            let filename = 'download';
            const cd = res.headers['content-disposition'];
            if (cd && cd.includes('filename=')) {
                filename = cd
                    .split('filename=')[1]
                    .split(';')[0]
                    .replace(/['"]/g, '');
            }
            else {
                filename = downloadURL.split('/').slice(-2, -1)[0];
            }

            const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
            setMessage('Downloaded');

        } catch (error) {
            setMessage('Download failed.')
        }
    }

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md transition-all">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Upload a File</h2>

                <form className="space-y-5" onSubmit={handleUpload}>
                    <label className="block">
                        <span className="block text-sm font-medium text-gray-700 mb-1">Choose File</span>
                        <input
                            type="file"
                            accept=".pdf,image/*, video/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-800 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
                    >
                        Upload
                    </button>
                </form>

                {progress > 0 && (
                    <>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-150 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="mt-1 text-center text-sm text-gray-600">
                            {progress}%
                        </div>
                    </>
                )}

                {message && (
                    <div className="mt-4 text-sm text-center text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {message}
                    </div>
                )}

                {<PreviewURL previewUrl={previewUrl} downloadURL={downloadURL} fileType={fileType} />}

                {downloadURL && (
                    <button
                        onClick={handleDownload}
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition duration-200"
                    >
                        Download File
                    </button>
                )}
            </div>
        </div>
    )
}

export default FileUpload