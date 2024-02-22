////////////////////////////////////
const fileInput = document.getElementById('file');
const keyInput = document.getElementById('key');
const encrypt = document.getElementById('encrypt');
const decrypt = document.getElementById('decrypt');
const generate = document.getElementById('generate');
const fileError = document.getElementById('file-error');
const keyError = document.getElementById('key-error');
const progressBar = document.getElementById('progress-bar');
const download = document.getElementById("download");
const contact = document.getElementById('contact');
let selectedFiles = [];
let downloadFiles = [];

fileInput.onchange = () => {
    selectedFiles = [...fileInput.files];
}

const fileEncrypt = (file, key) => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const binaryData = new Uint8Array(event.target.result);
            for (let i = 0; i < binaryData.length; i++) {
                binaryData[i] ^= key.charCodeAt(i % key.length);
            }

            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            const encryptBlob = new Blob([binaryData], { type: file.type });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(encryptBlob);
            downloadLink.download = fileNameWithoutExtension + ".cipher";
            downloadFiles.push(downloadLink);
            resolve(); // Resolve the Promise to signal completion
        };
        reader.readAsArrayBuffer(file);
    });
};



const fileDecrypt = (file, key) => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const binaryData = new Uint8Array(event.target.result);
            for (let i = 0; i < binaryData.length; i++) {
                binaryData[i] ^= key.charCodeAt(i % key.length);
            }
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            const decryptBlob = new Blob([binaryData], { type: file.type });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(decryptBlob);
            downloadLink.download = fileNameWithoutExtension;
            downloadFiles.push(downloadLink);
            resolve(); // Resolve the Promise to signal completion
        };

        reader.readAsArrayBuffer(file);
    });
};



fileInput.addEventListener('change', () => {
    if (!fileInput.files.length == 0) fileError.innerHTML = '';
});

keyInput.addEventListener('keydown', () => {
    if (keyInput.value == '') keyError.innerHTML = '';
});

generate.addEventListener('click', async (e) => {
    e.preventDefault();
    if (fileInput.files.length == 0) fileError.innerHTML = 'File is empty';
    if (keyInput.value == '') keyError.innerHTML = 'Key is empty';
    if (keyInput.value.length < 6) keyError.innerHTML = 'Key must be at least 6 characters';
    if (!fileInput.files.length == 0 && !keyInput.value == '' && keyInput.value.length >= 6) {
        const progressStep = 100 / fileInput.files.length;
        let progressLength = 0;
        if (!keyInput.value.length == 0) keyError.innerHTML = '';
        downloadFiles = []; // Reset the array for each generation
        progressBar.parentElement.classList.remove('d-none'); //start bar;
        // // Use Promise.all to wait for all asynchronous file operations to complete
        await Promise.all(selectedFiles.map((file,index) => {
            progressLength += progressStep;
            progressBar.style.width = `${progressLength}%`;
            return (encrypt.checked) ? fileEncrypt(file, keyInput.value) : fileDecrypt(file, keyInput.value);
        }));

        download.disabled = false;
        
    }
});

download.addEventListener('click',()=>{
    downloadFiles.forEach(link => {
        link.click();
    });
    download.disabled = true;
    keyInput.value = '';
    fileInput.value = '';
    progressBar.parentElement.classList.add('d-none'); 
})

contact.addEventListener("click",(e)=>{
    window.location.href = "mailto:aungthuhein.dev@email.com";
})