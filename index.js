/**
 * Function to read and encode a file in chunks.
 * @param {File} file - The file to be read.
 * @param {Function} callback - Callback function to handle the encoded data URL.
 */
function readAndEncodeFileInChunks(file, callback) {
  // Define the chunk size, considering a multiple of 3 for Base64
  const CHUNK_SIZE = 3 * 1024 * 1024;
  let currentOffset = 0;
  const reader = new FileReader();
  let base64Parts = [];

  reader.onload = function (event) {
    const base64ChunkWithoutPrefix = event.target.result.split(',')[1];
    base64Parts.push(base64ChunkWithoutPrefix);

    if (currentOffset < file.size) {
      readNextChunk();
    } else {
      // All chunks are read and encoded, now concatenate
      const fullBase64 = base64Parts.join('');
      const dataUrl = `data:${file.type};base64,${fullBase64}`;

      // Handle the dataUrl as needed
      callback(dataUrl);
    }
  };

  function readNextChunk() {
    // Adjust end boundary to ensure it's on a 3-byte boundary
    const endBoundary = currentOffset + CHUNK_SIZE;
    const adjustedEndBoundary = endBoundary - (endBoundary % 3);

    const chunk = file.slice(currentOffset, adjustedEndBoundary);
    reader.readAsDataURL(chunk);
    currentOffset = adjustedEndBoundary;
  }

  readNextChunk();
}
