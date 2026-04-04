// EOTrans Base64 版本 - 文件与字符串互转

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // 获取 DOM 元素
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const base64Input = document.getElementById('base64Input');

    // 绑定事件
    if (dropZone) {
        dropZone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (fileInput) {
                fileInput.click();
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        });
    }

    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        });
    }

    // 粘贴时自动尝试解码
    if (base64Input) {
        base64Input.addEventListener('paste', function() {
            setTimeout(function() {
                const value = base64Input.value.trim();
                if (value.length > 100) {
                    tryPreview(value);
                }
            }, 100);
        });
    }
}

// 切换模式
function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.section').forEach(function(section) {
        section.classList.remove('active');
    });
    
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

function handleFiles(files) {
    selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    // 显示文件列表
    const fileListDiv = document.getElementById('encodeFileList');
    if (fileListDiv) {
        fileListDiv.innerHTML = selectedFiles.map(function(file) {
            return '<div class="file-item"><span>' + file.name + '</span><span>' + formatFileSize(file.size) + '</span></div>';
        }).join('');
        fileListDiv.classList.remove('hidden');
    }

    // 开始转换
    encodeFiles();
}

async function encodeFiles() {
    const progressDiv = document.getElementById('encodeProgress');
    const progressBar = document.getElementById('encodeProgressBar');
    const statusDiv = document.getElementById('encodeStatus');
    const outputDiv = document.getElementById('encodeOutput');

    if (progressDiv) progressDiv.classList.remove('hidden');
    if (outputDiv) outputDiv.classList.add('hidden');

    const results = [];

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (statusDiv) {
            statusDiv.textContent = '正在转换 ' + file.name + ' (' + (i + 1) + '/' + selectedFiles.length + ')...';
        }
        
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
            if (statusDiv) {
                statusDiv.textContent = '转换失败: ' + file.name;
                statusDiv.className = 'status error';
            }
            return;
        }

        if (progressBar) {
            progressBar.style.width = ((i + 1) / selectedFiles.length * 100) + '%';
        }
    }

    // 生成输出
    const output = {
        version: '1.0',
        count: results.length,
        files: results
    };

    const jsonStr = JSON.stringify(output);
    const compressed = compressString(jsonStr);
    
    const outputTextarea = document.getElementById('base64Output');
    if (outputTextarea) {
        outputTextarea.value = compressed;
    }
    
    if (outputDiv) outputDiv.classList.remove('hidden');
    if (statusDiv) {
        statusDiv.textContent = '转换完成！';
        statusDiv.className = 'status success';
    }
}

function fileToBase64(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function() {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 简单的字符串压缩
function compressString(str) {
    // 简单的 Base64 编码
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        return str;
    }
}

function decompressString(str) {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        return str;
    }
}

// 复制到剪贴板
function copyToClipboard(btn) {
    const textarea = document.getElementById('base64Output');
    if (!textarea) return;
    
    textarea.select();
    document.execCommand('copy');
    
    // 显示提示
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制！';
        setTimeout(function() {
            btn.textContent = originalText;
        }, 2000);
    }
}

// 下载为文本文件
function downloadAsText() {
    const content = document.getElementById('base64Output');
    if (!content || !content.value) return;
    
    const blob = new Blob([content.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eotrans_' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// 尝试预览文件信息
function tryPreview(value) {
    try {
        const jsonStr = decompressString(value);
        const data = JSON.parse(jsonStr);
        if (data.files && data.files.length > 0) {
            const file = data.files[0];
            const nameEl = document.getElementById('decodeFileName');
            const sizeEl = document.getElementById('decodeFileSize');
            const typeEl = document.getElementById('decodeFileType');
            const infoEl = document.getElementById('decodeFileInfo');
            
            if (nameEl) nameEl.textContent = file.name;
            if (sizeEl) sizeEl.textContent = formatFileSize(file.size);
            if (typeEl) typeEl.textContent = file.type || 'application/octet-stream';
            if (infoEl) infoEl.classList.remove('hidden');
        }
    } catch (err) {
        // 忽略错误
    }
}

// 解码文件
function decodeFile() {
    const input = document.getElementById('base64Input');
    if (!input || !input.value.trim()) {
        alert('请输入 Base64 字符串');
        return;
    }

    const value = input.value.trim();

    try {
        // 尝试解压
        const jsonStr = decompressString(value);
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
                data: value
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
    const nameEl = document.getElementById('decodeFileName');
    const sizeEl = document.getElementById('decodeFileSize');
    const typeEl = document.getElementById('decodeFileType');
    const infoEl = document.getElementById('decodeFileInfo');
    
    if (nameEl) nameEl.textContent = fileInfo.name || 'decoded_file';
    if (sizeEl) sizeEl.textContent = formatFileSize(byteArray.length);
    if (typeEl) typeEl.textContent = fileInfo.type || 'application/octet-stream';
    if (infoEl) infoEl.classList.remove('hidden');
}

async function downloadMultipleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        await new Promise(function(resolve) {
            downloadSingleFile(files[i]);
            setTimeout(resolve, 500);
        });
    }
    alert('已下载 ' + files.length + ' 个文件');
}

function clearDecode() {
    const input = document.getElementById('base64Input');
    const info = document.getElementById('decodeFileInfo');
    if (input) input.value = '';
    if (info) info.classList.add('hidden');
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
