function calculatePasswordEntropy(password) {
    // Define character sets for different types of characters
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialCharacters = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
    // Determine the character set used in the password
    let characterSet = lowercaseLetters;
    if (/[A-Z]/.test(password)) {
      characterSet += uppercaseLetters;
    }
    if (/[0-9]/.test(password)) {
      characterSet += digits;
    }
    if (/[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password)) {
      characterSet += specialCharacters;
    }
  
    // Calculate the entropy
    const passwordLength = password.length;
    const characterSetSize = characterSet.length;
    const entropy = Math.log2(Math.pow(characterSetSize, passwordLength));
  
    return entropy;
  }
  
  // Example usage
  const password = "1\"b3^hN}74Ni''6w";
  const entropy = calculatePasswordEntropy(password);
  console.log(`Password entropy: ${entropy.toFixed(2)} bits`);
  