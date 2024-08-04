document.addEventListener('DOMContentLoaded', () => {
    const fullPagePopup = document.getElementById('fullPagePopup');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const acceptBtn = document.getElementById('acceptBtn');

    function hidePopup() {
        fullPagePopup.classList.add('fade-out');
        welcomeMessage.classList.add('fade-out');
        setTimeout(() => {
            fullPagePopup.style.display = 'none';
            welcomeMessage.style.display = 'none';
        }, 6000); // Hide after fade-out transition
    }

    setTimeout(hidePopup, 1000); // Show the popup after 1 second delay

    acceptBtn.addEventListener('click', hidePopup);

    window.generateCodes = function() {
        const numCodes = parseInt(document.getElementById('numCodes').value) || 1;
        const exampleCodes = document.getElementById('exampleCodes').value.split('\n').filter(code => code.trim());

        let codes = [];

        if (exampleCodes.length > 0) {
            // Generate similar codes based on example codes
            for (let i = 0; i < numCodes; i++) {
                codes.push(generateSimilarCode(exampleCodes[i % exampleCodes.length]));
            }
        } else {
            // Fallback to default code generation logic if no example codes are provided
            const codeLength = parseInt(document.getElementById('codeLength').value) || 10;
            const charset = document.getElementById('charset').value || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const prefix = document.getElementById('prefix').value || '';
            const postfix = document.getElementById('postfix').value || '';
            const pattern = document.getElementById('pattern').value || '';

            if (pattern) {
                for (let i = 0; i < numCodes; i++) {
                    codes.push(generatePatternCode(pattern, charset, prefix, postfix));
                }
            } else {
                for (let i = 0; i < numCodes; i++) {
                    codes.push(generateRandomCode(codeLength, charset, prefix, postfix));
                }
            }
        }

        displayCodes(codes);
    }

    function generateRandomCode(length, charset, prefix, postfix) {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return prefix + code + postfix;
    }

    function generatePatternCode(pattern, charset, prefix, postfix) {
        let code = '';
        for (let char of pattern) {
            code += char === '#' ? charset.charAt(Math.floor(Math.random() * charset.length)) : char;
        }
        return prefix + code + postfix;
    }

    function generateSimilarCode(exampleCode) {
        const pattern = extractPattern(exampleCode);
        let similarCode = '';

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === '#') {
                similarCode += generateRandomCharacter();
            } else {
                similarCode += pattern[i];
            }
        }

        return similarCode;
    }

    function extractPattern(exampleCode) {
        return exampleCode.split('').map(char => {
            return /[A-Z0-9]/.test(char) ? '#' : char;
        }).join('');
    }

    function generateRandomCharacter() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define charset for random characters
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    window.useTemplate = function(template) {
        document.getElementById('exampleCodes').value = template;
    }

    window.clearFields = function() {
        document.getElementById('codeForm').reset();
        document.getElementById('generatedCodes').innerHTML = '';
    }

    function displayCodes(codes) {
        const codesContainer = document.getElementById('generatedCodes');
        codesContainer.innerHTML = `
            <button class="copy-all-btn" onclick="copyAllCodes()">Copy All</button>
        ` + codes.map(code => `
            <div class="code" data-code="${code}">
                <span>${code}</span>
                <button class="copy-btn" onclick="copyCode('${code}')">Copy</button>
            </div>
        `).join('');
    }

    function copyCode(code) {
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Code copied: ' + code);
    }

    window.copyAllCodes = function() {
        const codes = Array.from(document.querySelectorAll('.code')).map(code => code.dataset.code).join('\n');
        const tempInput = document.createElement('input');
        tempInput.value = codes;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('All codes copied!');
    }
});
