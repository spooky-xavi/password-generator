document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const passwordLengthInput = document.getElementById('passwordLength');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeNumberCheckbox = document.getElementById('includeNumber');
    const includeSymbolCheckbox = document.getElementById('includeSymbol');
    const generateButton = document.getElementById('generatePassword');
    const generatePasswordOutput = document.getElementById('generatedPassword');
    const passwordEntropyOutput = document.getElementById('passwordEntropy');
    const passwordStrengthOutput = document.getElementById('passwordStrength'); // Added for password strength

    generateButton.addEventListener('click', function () {
        // Get user input values
        const passwordLength = parseInt(passwordLengthInput.value, 10);
        const uppercaseOption = includeUppercaseCheckbox.checked;
        const lowercaseOption = includeLowercaseCheckbox.checked;
        const numberOption = includeNumberCheckbox.checked;
        const symbolOption = includeSymbolCheckbox.checked;

        // Generate a password using the provided options
        const newPassword = generatePassword(passwordLength, uppercaseOption, lowercaseOption, numberOption, symbolOption);

        // Calculate and display the password entropy
        const entropy = calculatePasswordEntropy(newPassword);
        passwordEntropyOutput.textContent = `${entropy.toFixed(2)} bits`;

        // Calculate password strength based on entropy
        const passwordStrength = getPasswordStrength(entropy);
        passwordStrengthOutput.textContent = `${passwordStrength}`;

        // Display the generated password in the HTML
        generatePasswordOutput.textContent = newPassword;
    });

    function getRandomInt(min, max) {
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray); // Use window.crypto for web browsers
        const range = max - min;
        const randomValue = (randomArray[0] / 0xFFFFFFFF) * range + min;
        return Math.floor(randomValue);
    }

    function generatePassword(passwordLength, uppercaseOption, lowercaseOption, numberOption, symbolOption) {
        let password = "";
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = lowercaseChars.toUpperCase();
        const digits = '0123456789';
        const symbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

        const selectedOptions = [];

        if (lowercaseOption) {
            selectedOptions.push(lowercaseChars);
        }
        if (uppercaseOption) {
            selectedOptions.push(uppercaseChars);
        }
        if (numberOption) {
            selectedOptions.push(digits);
        }
        if (symbolOption) {
            selectedOptions.push(symbols);
        }

        if (selectedOptions.length === 0) {
            return "Please select at least one option.";
        }

        for (let i = 0; i < passwordLength; i++) {
            const randomOption = selectedOptions[getRandomInt(0, selectedOptions.length)];
            const randomIndexArray = new Uint32Array(1);

            // Rejection sampling to ensure a uniform distribution
            let randomIndex;
            do {
                window.crypto.getRandomValues(randomIndexArray);
                randomIndex = randomIndexArray[0];
            } while (randomIndex >= (0xFFFFFFFF - (0xFFFFFFFF % randomOption.length)));

            randomIndex = randomIndex % randomOption.length;
            password += randomOption.charAt(randomIndex);
        }

        return password;
    }

    // Function to calculate password entropy
    function calculatePasswordEntropy(password) {
        // Define character sets for different types of characters
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specialCharacters = "!@#$%^&*()-_=+[]{}|;:',.<>?/";

        // Determine the character set used in the password
        let characterSet = lowercaseLetters;
        if (/[A-Z]/.test(password)) {
            characterSet += uppercaseLetters;
        }
        if (/[0-9]/.test(password)) {
            characterSet += digits;
        }
        if (/[!@#$%^&*()-_=+[\]{}|;:',.<>?/]/.test(password)) {
            characterSet += specialCharacters;
        }

        // Calculate the entropy
        const passwordLength = password.length;
        const characterSetSize = characterSet.length;
        const entropy = Math.log2(Math.pow(characterSetSize, passwordLength));

        return entropy;
    }

    // Function to determine password strength based on entropy
    function getPasswordStrength(entropy) {
        if (entropy < 30) {
            return 'Weak';
        } else if (entropy < 60) {
            return 'Medium';
        } else if (entropy < 90) {
            return 'Strong';
        } else {
            return 'Very Strong';
        }
    }
});
