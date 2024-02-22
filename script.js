const fileInput = document.getElementById('file');
const keyInput = document.getElementById('key');
const encrypt = document.getElementById('encrypt');
const decrypt = document.getElementById('decrypt');
const generate = document.getElementById('generate');
const fileError = document.getElementById('file-error');
const keyError = document.getElementById('key-error');
let selectedFiles = [];
let downloadFiles = [];


fileInput.onchange = () => {
    selectedFiles = [...fileInput.files];
  }
  const fileEncrypt = (file, key) => {
    console.log(file, key);

    const reader = new FileReader();

    reader.onload = function (event) {
        const binaryData = new Uint8Array(event.target.result);
        for (let i = 0; i < binaryData.length; i++) {
            binaryData[i] ^= key.charCodeAt(i % key.length);
        }

        // Extract the file name without extension
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');

        // Create a Blob with the encrypted data and the ".cipher" extension
        const encryptBlob = new Blob([binaryData], { type: file.type });

        // Create a download link and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(encryptBlob);
        downloadLink.download = fileNameWithoutExtension + '.cipher'; // Append ".cipher" to the file name
        downloadLink.click();
    };

    reader.readAsArrayBuffer(file);
};


const fileDecrypt = (file, key) => {
    console.log(file, key);

    const reader = new FileReader();

    reader.onload = function (event) {
        const binaryData = new Uint8Array(event.target.result);
        for (let i = 0; i < binaryData.length; i++) {
            binaryData[i] ^= key.charCodeAt(i % key.length);
        }

        // Extract the file name without extension
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');

        // Create a Blob with the decrypted data and the original file type
        const decryptBlob = new Blob([binaryData], { type: file.type });

        // Create a download link and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(decryptBlob);
        downloadLink.download = fileNameWithoutExtension; // Use the original file name without ".cipher" extension
        downloadLink.click();
    };

    reader.readAsArrayBuffer(file);
};


generate.addEventListener('click',(e)=>{
    e.preventDefault();
    if(fileInput.files.length == 0) fileError.innerHTML = 'File is empyt';
    if(keyInput.value == '') keyError.innerHTML = 'Key is empyt';
    if(keyInput.value.length == 0) keyError.innerHTML = 'Key must be greater than 6';
    if(!fileInput.files.length == 0 && !keyInput.value == '' && !keyInput.value.length == 0){
        if(encrypt.value.checked){
            selectedFiles.forEach(file => {
                fileEncrypt(file,key.value);
            });
        }else{
            selectedFiles.forEach(file => {
                fileDecrypt(file,key.value);
            });
        }
        keyInput.value = '';
        fileInput.files = '';
    }
})
