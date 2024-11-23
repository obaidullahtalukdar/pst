// Add this at the beginning of your script
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for Tool 3 and Tool 4
    const passwordStrengthInput = document.getElementById('passwordToCheck');
    const crackTimeInput = document.getElementById('crackTimeCheck');

    if (passwordStrengthInput) {
        passwordStrengthInput.addEventListener('input', function() {
            checkStrength();
        });
    }

    if (crackTimeInput) {
        crackTimeInput.addEventListener('input', function() {
            checkCrackTime();
        });
    }
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password length slider
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    if (lengthSlider) {
        lengthSlider.addEventListener('input', () => {
            lengthValue.textContent = lengthSlider.value;
        });
    }
});

// SHA-1 Hash Function
async function sha1(str) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

// Generate Password
function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let charset = '';
    let password = '';

    // Build character set based on selected options
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Validate at least one option is selected
    if (charset === '') {
        alert('Please select at least one character type');
        return;
    }

    // Generate random password
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charsetLength));
    }

    document.getElementById('generatedPassword').value = password;
}

// Tool 3: Password Strength Checker
function checkStrength() {
    const password = document.getElementById('passwordToCheck').value;
    const strengthResult = document.getElementById('strengthResult');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthBox = document.getElementById('strengthBox');
    
    // Calculate strength
    let strength = 0;
    let strengthText = '';

    if (!password) {
        updateStrengthUI(0, 'No Password', '');
        updateRequirements('');  // Reset requirements
        return;
    }

    // Calculate password strength
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    // Determine strength text and class
    let strengthClass = '';
    if (strength >= 100) {
        strengthText = 'Very Strong';
        strengthClass = 'very-strong';
    } else if (strength >= 80) {
        strengthText = 'Strong';
        strengthClass = 'strong';
    } else if (strength >= 60) {
        strengthText = 'Moderate';
        strengthClass = 'moderate';
    } else if (strength >= 40) {
        strengthText = 'Weak';
        strengthClass = 'weak';
    } else {
        strengthText = 'Very Weak';
        strengthClass = 'very-weak';
    }

    updateStrengthUI(strength, strengthText, strengthClass);
    updateRequirements(password);  // Update requirements with current password
}

function updateRequirements(password) {
    // Define requirements with their test conditions
    const requirements = [
        {
            id: 'lengthReq',
            test: password.length >= 8,
            text: 'At least 8 characters'
        },
        {
            id: 'upperReq',
            test: /[A-Z]/.test(password),
            text: 'At least 1 uppercase letter'
        },
        {
            id: 'lowerReq',
            test: /[a-z]/.test(password),
            text: 'At least 1 lowercase letter'
        },
        {
            id: 'numberReq',
            test: /[0-9]/.test(password),
            text: 'At least 1 number'
        },
        {
            id: 'symbolReq',
            test: /[^A-Za-z0-9]/.test(password),
            text: 'At least 1 special character'
        }
    ];

    // Update each requirement
    requirements.forEach(req => {
        const element = document.getElementById(req.id);
        if (element) {
            const icon = element.querySelector('i');
            if (req.test) {
                element.classList.add('valid');
                if (icon) icon.className = 'fas fa-check-circle';
            } else {
                element.classList.remove('valid');
                if (icon) icon.className = 'fas fa-times-circle';
            }
            
            // Update text content (optional, if you want to keep the original text)
            element.innerHTML = `<i class="${icon.className}"></i> ${req.text}`;
        }
    });
}

function updateStrengthUI(strength, strengthText, strengthClass) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthBox = document.getElementById('strengthBox');
    const strengthResult = document.getElementById('strengthResult');

    if (strengthBar) {
        strengthBar.style.width = strength + '%';
        strengthBar.className = 'strength-bar ' + strengthClass;
    }
    
    if (strengthBox) {
        strengthBox.textContent = strengthText;
        strengthBox.className = 'strength-box ' + strengthClass;
    }
    
    if (strengthResult) {
        strengthResult.textContent = strengthText;
        strengthResult.className = 'result-box ' + strengthClass;
    }
}

// Tool 4: Time to Crack Password
function checkCrackTime() {
    const password = document.getElementById('crackTimeCheck').value;
    const charCount = document.getElementById('crackCharCount');
    const timeDisplay = document.getElementById('timeToBreak');
    const analysisDisplay = document.getElementById('passwordAnalysis');
    const entropyValue = document.getElementById('entropyValue');
    const complexityValue = document.getElementById('complexityValue');

    // Reset if no password
    if (!password) {
        updateCrackTimeDisplay('No Password', '', '0 bits', '0/100', '');
        updateCrackCriteria(false, false, false, false);
        charCount.textContent = '0';
        return;
    }

    // Update character count
    charCount.textContent = password.length;

    // Check composition
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    // Update criteria display
    updateCrackCriteria(hasUpper, hasLower, hasNumbers, hasSymbols);

    // Calculate metrics
    const complexity = calculateComplexity(password);
    const entropy = calculateEntropy(password);
    const crackTimeResult = calculateCrackTime(entropy, complexity);

    // Update display
    updateCrackTimeDisplay(
        crackTimeResult.time,
        crackTimeResult.strength,
        Math.round(entropy) + ' bits',
        complexity + '/100',
        crackTimeResult.analysis
    );
}

function updateCrackCriteria(hasUpper, hasLower, hasNumbers, hasSymbols) {
    const criteria = {
        'crackHasUpper': hasUpper,
        'crackHasLower': hasLower,
        'crackHasNumbers': hasNumbers,
        'crackHasSymbols': hasSymbols
    };

    for (let [id, value] of Object.entries(criteria)) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle('active', value);
        }
    }
}

function updateCrackTimeDisplay(time, strength, entropy, complexity, analysis) {
    const elements = {
        'timeToBreak': time,
        'entropyValue': entropy,
        'complexityValue': complexity,
        'passwordAnalysis': analysis
    };

    for (let [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            if (id === 'timeToBreak') {
                element.className = 'time-display ' + strength;
            }
        }
    }
}

function calculateComplexity(password) {
    let complexity = 0;
    
    // Length score (up to 40 points)
    complexity += Math.min(password.length * 4, 40);
    
    // Character variety (up to 60 points)
    if (/[A-Z]/.test(password)) complexity += 15;
    if (/[a-z]/.test(password)) complexity += 15;
    if (/[0-9]/.test(password)) complexity += 15;
    if (/[^A-Za-z0-9]/.test(password)) complexity += 15;
    
    return Math.min(complexity, 100);
}

function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;
    
    return Math.log2(Math.pow(charsetSize, password.length));
}

function calculateCrackTime(entropy, complexity) {
    const combinations = Math.pow(2, entropy);
    const guessesPerSecond = 1000000000000; // 1 trillion guesses per second
    const seconds = combinations / guessesPerSecond;
    
    let timeText, strength, analysis;
    
    if (seconds < 1) {
        timeText = 'Instantly';
        strength = 'very-weak';
        analysis = 'This password can be cracked instantly. Consider using a stronger password.';
    } else if (seconds < 3600) {
        timeText = formatTimeUnit(seconds, 'second');
        strength = 'weak';
        analysis = 'This password is too weak for sensitive accounts.';
    } else if (seconds < 86400) {
        timeText = formatTimeUnit(seconds / 3600, 'hour');
        strength = 'moderate';
        analysis = 'This password provides moderate protection.';
    } else if (seconds < 31536000) {
        timeText = formatTimeUnit(seconds / 86400, 'day');
        strength = 'strong';
        analysis = 'This password provides good protection.';
    } else {
        timeText = formatTimeUnit(seconds / 31536000, 'year');
        strength = 'very-strong';
        analysis = 'This password provides excellent protection.';
    }
    
    return { time: timeText, strength, analysis };
}

function formatTimeUnit(value, unit) {
    value = Math.round(value);
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
}

// Check for Password Breaches
async function checkBreaches() {
    const password = document.getElementById('breachPassword').value;
    const resultDiv = document.getElementById('breachResult');

    if (!password) {
        resultDiv.textContent = 'Please enter a password';
        resultDiv.style.color = '#ff4444';
        return;
    }

    try {
        resultDiv.textContent = 'Checking...';
        resultDiv.style.color = '#ffffff';

        // Generate SHA-1 hash
        const hashHex = await sha1(password);
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);

        // Query the API
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            method: 'GET',
            headers: {
                'Add-Padding': 'true'
            }
        });

        if (!response.ok) throw new Error('API request failed');

        const text = await response.text();
        const breachData = text.split('\r\n').map(line => line.split(':'));
        const match = breachData.find(([hash]) => hash === suffix);

        if (match) {
            const count = parseInt(match[1]);
            resultDiv.style.color = '#ff4444';
            resultDiv.innerHTML = `
                ⚠️ This password has been found in ${count.toLocaleString()} data breaches.<br>
                <span style="font-size: 0.9em">Please choose a different password.</span>
            `;
        } else {
            resultDiv.style.color = '#00C851';
            resultDiv.innerHTML = '✅ Good news! This password hasn\'t been found in any known data breaches.';
        }
    } catch (error) {
        resultDiv.style.color = '#ff4444';
        resultDiv.textContent = 'An error occurred while checking. Please try again later.';
        console.error('Breach check error:', error);
    }
}

// Toggle Password Visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Copy password to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Password copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy password');
        });
}

// Add event listeners when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add copy button functionality to generated password
    const generatedPassword = document.getElementById('generatedPassword');
    if (generatedPassword) {
        generatedPassword.addEventListener('click', () => {
            if (generatedPassword.value) {
                copyToClipboard(generatedPassword.value);
            }
        });
    }

    // Initialize password generation
    generatePassword();
});