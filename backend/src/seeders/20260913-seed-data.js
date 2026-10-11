'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      name: 'Admin User',
      email: 'admin@eduadapt.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create Students
    const studentPassword = await bcrypt.hash('student123', 10);
    await queryInterface.bulkInsert('users', [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@student.com',
        password: studentPassword,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sara Ali',
        email: 'sara@student.com',
        password: studentPassword,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Topics
    await queryInterface.bulkInsert('topics', [
      { name: 'JavaScript Basics', description: 'Variables, data types, operators, and basic syntax', icon: '📘', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'JavaScript Arrays', description: 'Array methods, manipulation, and iteration', icon: '📦', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'JavaScript Functions', description: 'Function declarations, expressions, arrow functions, and scope', icon: '⚡', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'HTML & CSS', description: 'HTML structure and CSS styling fundamentals', icon: '🎨', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'React Basics', description: 'Components, JSX, props, and state management', icon: '⚛️', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Node.js & Express', description: 'Server-side JavaScript, REST APIs, and middleware', icon: '🖥️', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Database Basics', description: 'SQL, PostgreSQL, and database design', icon: '🗄️', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Git & Version Control', description: 'Git commands, branching, and collaboration', icon: '🔀', isActive: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Create Questions - JavaScript Basics
    await queryInterface.bulkInsert('questions', [
      {
        topicId: 1,
        questionText: 'Which keyword is used to declare a variable that can be reassigned?',
        optionA: 'const',
        optionB: 'let',
        optionC: 'var',
        optionD: 'static',
        correctAnswer: 'B',
        difficulty: 'easy',
        hint: 'Think about block scope and reassignment.',
        explanation: 'let allows reassignment while maintaining block scope. const cannot be reassigned, and var has function scope.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 1,
        questionText: 'What is the result of typeof null in JavaScript?',
        optionA: '"null"',
        optionB: '"undefined"',
        optionC: '"object"',
        optionD: '"boolean"',
        correctAnswer: 'C',
        difficulty: 'medium',
        hint: 'This is a known quirk in JavaScript.',
        explanation: 'typeof null returns "object" due to a historical bug in JavaScript that was never fixed for backward compatibility.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 1,
        questionText: 'Which method converts a JSON string to a JavaScript object?',
        optionA: 'JSON.stringify()',
        optionB: 'JSON.parse()',
        optionC: 'JSON.convert()',
        optionD: 'JSON.toObject()',
        correctAnswer: 'B',
        difficulty: 'easy',
        hint: 'The name suggests parsing or reading.',
        explanation: 'JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() does the opposite.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 1,
        questionText: 'What does the === operator check?',
        optionA: 'Value only',
        optionB: 'Type only',
        optionC: 'Value and type',
        optionD: 'Reference only',
        correctAnswer: 'C',
        difficulty: 'easy',
        hint: 'It is called the strict equality operator.',
        explanation: 'The === operator (strict equality) checks both value and type without type coercion.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 1,
        questionText: 'Which of the following is NOT a primitive data type in JavaScript?',
        optionA: 'String',
        optionB: 'Boolean',
        optionC: 'Object',
        optionD: 'Number',
        correctAnswer: 'C',
        difficulty: 'medium',
        hint: 'Primitives are immutable basic values.',
        explanation: 'Object is not a primitive. Primitives in JS are: string, number, boolean, null, undefined, symbol, and bigint.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Questions - JavaScript Arrays
    await queryInterface.bulkInsert('questions', [
      {
        topicId: 2,
        questionText: 'Which method adds an element to the end of an array?',
        optionA: 'unshift()',
        optionB: 'push()',
        optionC: 'pop()',
        optionD: 'shift()',
        correctAnswer: 'B',
        difficulty: 'easy',
        hint: 'Think about pushing something onto a stack.',
        explanation: 'push() adds elements to the end. unshift() adds to the beginning. pop() removes from end. shift() removes from beginning.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 2,
        questionText: 'What does Array.prototype.map() return?',
        optionA: 'The original array',
        optionB: 'A new transformed array',
        optionC: 'A single value',
        optionD: 'undefined',
        correctAnswer: 'B',
        difficulty: 'medium',
        hint: 'It creates a new array by transforming each element.',
        explanation: 'map() returns a new array with the results of calling a function on every element. It does not modify the original.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 2,
        questionText: 'How do you find the length of an array named arr?',
        optionA: 'arr.length()',
        optionB: 'arr.size',
        optionC: 'arr.length',
        optionD: 'arr.count()',
        correctAnswer: 'C',
        difficulty: 'easy',
        hint: 'It is a property, not a method.',
        explanation: 'length is a property of arrays in JavaScript, not a method. No parentheses needed.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 2,
        questionText: 'Which method filters elements based on a condition?',
        optionA: 'map()',
        optionB: 'forEach()',
        optionC: 'filter()',
        optionD: 'reduce()',
        correctAnswer: 'C',
        difficulty: 'easy',
        hint: 'The name describes its purpose.',
        explanation: 'filter() creates a new array with elements that pass a test provided by a callback function.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 2,
        questionText: 'What is the output of [1,2,3].splice(1,1)?',
        optionA: '[1, 3]',
        optionB: '[2]',
        optionC: '[1, 2, 3]',
        optionD: '[1, 2]',
        correctAnswer: 'B',
        difficulty: 'medium',
        hint: 'splice modifies the original array and returns removed elements.',
        explanation: 'splice(1,1) removes 1 element starting at index 1, returning [2]. The original array becomes [1,3].',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Questions - JavaScript Functions
    await queryInterface.bulkInsert('questions', [
      {
        topicId: 3,
        questionText: 'What is the difference between function declaration and expression?',
        optionA: 'No difference',
        optionB: 'Declarations are hoisted, expressions are not',
        optionC: 'Expressions are hoisted, declarations are not',
        optionD: 'Both are hoisted',
        correctAnswer: 'B',
        difficulty: 'medium',
        hint: 'Think about how the JavaScript engine processes them.',
        explanation: 'Function declarations are hoisted (can be called before defined). Function expressions are assigned to variables and not hoisted.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 3,
        questionText: 'What is an arrow function?',
        optionA: 'A function that uses the => syntax',
        optionB: 'A function that returns an arrow',
        optionC: 'A deprecated function type',
        optionD: 'A function only used in React',
        correctAnswer: 'A',
        difficulty: 'easy',
        hint: 'It is named after a symbol.',
        explanation: 'Arrow functions use => syntax, provide shorter syntax, and do not have their own "this" context.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 3,
        questionText: 'What is a callback function?',
        optionA: 'A function that calls itself',
        optionB: 'A function passed as an argument to another function',
        optionC: 'A function that returns nothing',
        optionD: 'A function that runs last',
        correctAnswer: 'B',
        difficulty: 'medium',
        hint: 'Think of it as "calling you back" later.',
        explanation: 'A callback is a function passed as an argument to another function, to be executed later (e.g., in setTimeout, event handlers).',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 3,
        questionText: 'What does the "this" keyword refer to in a regular function?',
        optionA: 'The function itself',
        optionB: 'The global object (in non-strict mode)',
        optionC: 'The parent function',
        optionD: 'Always undefined',
        correctAnswer: 'B',
        difficulty: 'hard',
        hint: 'It depends on how the function is called.',
        explanation: 'In regular functions, "this" refers to the global object (window in browsers) in non-strict mode, or undefined in strict mode.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 3,
        questionText: 'What is closure in JavaScript?',
        optionA: 'Closing a browser tab',
        optionB: 'A function remembering its outer scope variables',
        optionC: 'A way to end a loop',
        optionD: 'A private variable',
        correctAnswer: 'B',
        difficulty: 'hard',
        hint: 'It involves nested functions and scope.',
        explanation: 'A closure is when an inner function remembers and can access variables from its outer function scope, even after the outer function has returned.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Questions - React Basics
    await queryInterface.bulkInsert('questions', [
      {
        topicId: 5,
        questionText: 'What is JSX?',
        optionA: 'A new programming language',
        optionB: 'A syntax extension for JavaScript',
        optionC: 'A CSS framework',
        optionD: 'A database query language',
        correctAnswer: 'B',
        difficulty: 'easy',
        hint: 'It stands for JavaScript XML.',
        explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript, which gets compiled to React.createElement() calls.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 5,
        questionText: 'What is the virtual DOM?',
        optionA: 'The actual browser DOM',
        optionB: 'A lightweight copy of the real DOM',
        optionC: 'A debugging tool',
        optionD: 'A server-side DOM',
        correctAnswer: 'B',
        difficulty: 'medium',
        hint: 'It is used for performance optimization.',
        explanation: 'The virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to batch updates efficiently.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 5,
        questionText: 'How do you pass data from parent to child in React?',
        optionA: 'Using state',
        optionB: 'Using props',
        optionC: 'Using context only',
        optionD: 'Using localStorage',
        correctAnswer: 'B',
        difficulty: 'easy',
        hint: 'Short for "properties".',
        explanation: 'Props (properties) are used to pass data from parent components to child components in a one-way data flow.',
        status: 'approved',
        isAIGenerated: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create Resources
    await queryInterface.bulkInsert('resources', [
      {
        topicId: 1,
        title: 'MDN JavaScript Guide',
        description: 'Comprehensive guide to JavaScript fundamentals from Mozilla',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        type: 'documentation',
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 2,
        title: 'JavaScript Array Methods',
        description: 'Visual guide to all array methods',
        url: 'https://javascript.info/array-methods',
        type: 'article',
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 3,
        title: 'Functions in JavaScript',
        description: 'Complete guide to JavaScript functions',
        url: 'https://javascript.info/function-basics',
        type: 'article',
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 5,
        title: 'React Official Tutorial',
        description: 'Official React tutorial and documentation',
        url: 'https://react.dev/learn',
        type: 'documentation',
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 6,
        title: 'Express.js Guide',
        description: 'Learn Express.js from the official docs',
        url: 'https://expressjs.com/en/guide/routing.html',
        type: 'documentation',
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        topicId: 7,
        title: 'PostgreSQL Tutorial',
        description: 'Learn SQL with PostgreSQL',
        url: 'https://www.postgresqltutorial.com/',
        type: 'tutorial',
        difficulty: 'easy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('resources', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('topics', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
