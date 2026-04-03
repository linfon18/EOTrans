// EOTrans Base64 版本 - 文件与字符串互转

// 切换模式
function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    
    if (mode === 'encode') {
        document.querySelectorAll('.mode-tab')[0].classList.add('active');
        document.getElementById('encodeSection').classList.add('active');
    } else {
        document.querySelectorAll('.mode-tab')[1].classList.add('active');
        document.getElementById('decodeSection').classList.add('active');
    }
}

// 文件转 Base64
let selectedFiles = [];

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    // 显示文件列表
    const fileListDiv = document.getElementById('encodeFileList');
    fileListDiv.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <span>${file.name}</span>
            <span>${formatFileSize(file.size)}</span>
        </div>
    `).join('');
    fileListDiv.classList.remove('hidden');

    // 开始转换
    encodeFiles();
}

async function encodeFiles() {
    const progressDiv = document.getElementById('encodeProgress');
    const progressBar = document.getElementById('encodeProgressBar');
    const statusDiv = document.getElementById('encodeStatus');
    const outputDiv = document.getElementById('encodeOutput');
    const outputTextarea = document.getElementById('base64Output');

    progressDiv.classList.remove('hidden');
    outputDiv.classList.add('hidden');

    const results = [];

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        statusDiv.textContent = `正在转换 ${file.name} (${i + 1}/${selectedFiles.length})...`;
        
        try {
            const base64 = await fileToBase64(file);
            results.push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64
            });
        } catch (err) {
            console.error('转换失败:', err);
            statusDiv.textContent = `转换失败: ${file.name}`;
            statusDiv.className = 'status error';
            return;
        }

        progressBar.style.width = `${((i + 1) / selectedFiles.length) * 100}%`;
    }

    // 生成输出
    const output = {
        version: '1.0',
        count: results.length,
        files: results
    };

    const jsonStr = JSON.stringify(output);
    const compressed = compressString(jsonStr);
    
    outputTextarea.value = compressed;
    outputDiv.classList.remove('hidden');
    statusDiv.textContent = '转换完成！';
    statusDiv.className = 'status success';

    // 自动复制
    copyToClipboard();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 简单的字符串压缩（使用 LZString 如果可用，否则直接返回）
function compressString(str) {
    if (typeof LZString !== 'undefined') {
        return LZString.compressToBase64(str);
    }
    // 简单的 Base64 编码
    return btoa(unescape(encodeURIComponent(str)));
}

function decompressString(str) {
    if (typeof LZString !== 'undefined') {
        try {
            return LZString.decompressFromBase64(str);
        } catch (e) {}
    }
    // 简单的 Base64 解码
    return decodeURIComponent(escape(atob(str)));
}

// 复制到剪贴板
function copyToClipboard() {
    const textarea = document.getElementById('base64Output');
    textarea.select();
    document.execCommand('copy');
    
    // 显示提示
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ 已复制！';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// 下载为文本文件
function downloadAsText() {
    const content = document.getElementById('base64Output').value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eotrans_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// 解码文件
function decodeFile() {
    const input = document.getElementById('base64Input').value.trim();
    if (!input) {
        alert('请输入 Base64 字符串');
        return;
    }

    try {
        // 尝试解压
        const jsonStr = decompressString(input);
        const data = JSON.parse(jsonStr);

        if (data.version && data.files) {
            // 多文件
            if (data.files.length === 1) {
                downloadSingleFile(data.files[0]);
            } else {
                downloadMultipleFiles(data.files);
            }
        } else {
            // 尝试直接作为单个 Base64 处理
            downloadSingleFile({
                name: 'decoded_file',
                type: 'application/octet-stream',
                data: input
            });
        }
    } catch (err) {
        console.error('解码失败:', err);
        alert('解码失败，请检查输入的字符串是否正确');
    }
}

function downloadSingleFile(fileInfo) {
    const byteCharacters = atob(fileInfo.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileInfo.type || 'application/octet-stream' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.name || 'decoded_file';
    a.click();
    URL.revokeObjectURL(url);

    // 显示文件信息
    document.getElementById('decodeFileName').textContent = fileInfo.name || 'decoded_file';
    document.getElementById('decodeFileSize').textContent = formatFileSize(byteArray.length);
    document.getElementById('decodeFileType').textContent = fileInfo.type || 'application/octet-stream';
    document.getElementById('decodeFileInfo').classList.remove('hidden');
}

async function downloadMultipleFiles(files) {
    for (const file of files) {
        await new Promise(resolve => {
            downloadSingleFile(file);
            setTimeout(resolve, 500);
        });
    }
    alert(`已下载 ${files.length} 个文件`);
}

function clearDecode() {
    document.getElementById('base64Input').value = '';
    document.getElementById('decodeFileInfo').classList.add('hidden');
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// 粘贴时自动尝试解码
const base64Input = document.getElementById('base64Input');
base64Input.addEventListener('paste', (e) => {
    setTimeout(() => {
        const value = base64Input.value.trim();
        if (value.length > 100) {
            // 尝试预览文件信息
            try {
                const jsonStr = decompressString(value);
                const data = JSON.parse(jsonStr);
                if (data.files && data.files.length > 0) {
                    const file = data.files[0];
                    document.getElementById('decodeFileName').textContent = file.name;
                    document.getElementById('decodeFileSize').textContent = formatFileSize(file.size);
                    document.getElementById('decodeFileType').textContent = file.type || 'application/octet-stream';
                    document.getElementById('decodeFileInfo').classList.remove('hidden');
                }
            } catch (err) {
                // 忽略错误
            }
        }
    }, 100);
});
