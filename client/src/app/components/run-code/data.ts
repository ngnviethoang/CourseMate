export const exercises = [
    {
        title: 'Add Two Numbers',
        question: `
            <p>Write a function that takes two numbers as input and returns their sum.</p>
            <p><strong>Example:</strong></p>
            <pre>Input: a = 5, b = 3
Output: 8</pre>
            <p><strong>Constraints:</strong></p>
            <ul>
                <li>a and b are integers.</li>
            </ul>
        `,
        difficulty: 'easy',
        testCases: [
            { input: '5, 3', expected: "8", output: null, passed: false },
            { input: '10, 20', expected: "30", output: null, passed: false },
            { input: '0, 0', expected: "0", output: null, passed: false },
            { input: '10, 20', expected: "30", output: null, passed: false },
            { input: '1, 0', expected: "1", output: null, passed: false }
        ],
        userCode: `function addTwoNumbers(a, b) {
}`
    },
    {
        title: 'Multiply Two Numbers',
        question: `
            <p>Write a function that takes two numbers as input and returns their product.</p>
            <p><strong>Example:</strong></p>
            <pre>Input: a = 5, b = 3
Output: 15</pre>
            <p><strong>Constraints:</strong></p>
            <ul>
                <li>a and b are integers.</li>
            </ul>
        `,
        difficulty: 'easy',
        testCases: [
            { input: '5, 3', expected: "15", output: null, passed: false },
            { input: '2, 8', expected: "16", output: null, passed: false },
            { input: '1, 0', expected: "0", output: null, passed: false }
        ],
        userCode: `function multiplyTwoNumbers(a, b) {
            // input
}`
    },
    {
        title: 'Check Prime Number',
        question: `
        <p>Write a function that checks if a number is a prime number.</p>
        <p><strong>Example:</strong></p>
        <pre>Input: n = 7
Output: true</pre>
        <p><strong>Constraints:</strong></p>
        <ul>
            <li>n is an integer greater than or equal to 2.</li>
        </ul>
    `,
        difficulty: 'easy',
        testCases: [
            { input: '2', expected: "true", output: null, passed: false },
            { input: '4', expected: "false", output: null, passed: false },
            { input: '13', expected: "true", output: null, passed: false },

        ],
        userCode: `function isPrime(n) {
}`
    },
    {
        title: 'Check Beautiful Number',
        question: `
        <p>Write a function that checks if a number is beautiful. A beautiful number is defined as a number where the sum of its digits is even.</p>
        <p><strong>Example:</strong></p>
        <pre>Input: n = 1234
Output: true (1+2+3+4 = 10)</pre>
    `,
        difficulty: 'easy',
        testCases: [
            { input: '1234', expected: "true", output: null, passed: false },
            { input: '1357', expected: "false", output: null, passed: false },
            { input: '2222', expected: "true", output: null, passed: false }
        ],
        userCode: `function isBeautifulNumber(n) {
}`
    },
    {
        title: 'Check Palindrome Number',
        question: `
        <p>Write a function that checks if a number is a palindrome.</p>
        <p><strong>Example:</strong></p>
        <pre>Input: n = 121
Output: true</pre>
        <p><strong>Constraints:</strong></p>
        <ul>
            <li>n is a non-negative integer.</li>
        </ul>
    `,
        difficulty: 'easy',
        testCases: [
            { input: '121', expected: "true", output: null, passed: false },
            { input: '123', expected: "false", output: null, passed: false },
            { input: '0', expected: "true", output: null, passed: false }
        ],
        userCode: `function isPalindrome(n) {
    // your code here
}`
    },


];
