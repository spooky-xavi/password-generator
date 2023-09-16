document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const passphraseLengthInput = document.getElementById('passphraseLength');
    const generatePassphraseButton = document.getElementById('generatePassphrase');
    const generatePassphraseOutput = document.getElementById('generatedPassphrase');

    generatePassphraseButton.addEventListener('click', async function () {
        const passphraseLength = parseInt(passphraseLengthInput.value, 10);

        // Generate a password
        const newPassphrase = await generatePassphrase(passphraseLength);

        // Display the generated password in the HTML
        generatePassphraseOutput.textContent = newPassphrase;
    });

    function getRandomInt(min, max) {
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomValue;
    }

    const generateFiveRolls = async () => {
        let fiveRolls = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = getRandomInt(1, 7);
            let randomNumber = randomIndex;
            fiveRolls += randomNumber;
        }
        return fiveRolls;
    }

    const generatePassphrase = async (passphraseLength) => {
        // Assuming you have a JSON endpoint to fetch the data
        try {
            const response = await fetch('diceware_data.json');
            const jsonData = await response.json();

            const matchingWords = [];

            while (matchingWords.join('-').split('-').length < passphraseLength) {
                const generatedCode = await generateFiveRolls();
                const match = jsonData.find(entry => entry.code === generatedCode);

                if (match) {
                    matchingWords.push(match.word);
                }
            }

            // Slice the matchingWords to match the desired passphrase length
            const slicedWords = matchingWords.slice(0, passphraseLength);

            // Convert the slicedWords to a hyphen-separated string
            const hyphenSeparatedString = slicedWords.join('-');

            return hyphenSeparatedString;
        } catch (error) {
            console.error(error);
        }
    }
});
