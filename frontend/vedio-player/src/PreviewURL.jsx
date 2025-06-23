import React from 'react'

const PreviewURL = ({previewUrl, downloadURL, fileType}) => {
  return (
    <div>
          {previewUrl && (
              <div>
                  <button
                      type='button'
                      className='w-full my-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition duration-200'
                      onClick={() => window.open(previewUrl, '_blank')}
                  >
                      Open Preview in New Tab
                  </button>

                  <div>
                      {!downloadURL && fileType === 'image' && (
                          <img src={previewUrl} alt="Preview" className='w-full max-h-96 object-contain' />
                      )}

                      {!downloadURL && fileType === 'video' && (
                          <video controls className='w-full max-h-96'>
                              <source src={previewUrl} type={fileType} />
                              Your browser does not support the video tag.
                          </video>
                      )}

                      {!downloadURL && fileType === 'pdf' && (
                          <iframe
                              src={previewUrl}
                              title="PDF Preview"
                              className="w-full h-96 border rounded"
                          />
                      )}
                  </div>
              </div>
          )}
    </div>
  )
}

export default PreviewURL