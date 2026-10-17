/**
 * Question Bank – JavaScript Arrays
 * Subtopics: Creating & Accessing Arrays · Array Methods · Iteration Methods
 * 10 easy + 10 medium + 10 hard (together with any questions already in the first seeder)
 *
 * Row format: [subtopic, difficulty, questionText, A, B, C, D, correctAnswer, hint, explanation]
 */
module.exports = [
  // ---------- EASY ----------
  ['Creating & Accessing Arrays', 'easy', 'What is the index of the first element of an array?', '1', '0', '-1', 'It depends on the array', 'B', 'JavaScript counts from zero.', 'Arrays are zero-indexed, so the first element is at index 0.'],
  ['Creating & Accessing Arrays', 'easy', 'Which is the correct way to create an array?', 'let a = [1, 2, 3];', 'let a = (1, 2, 3);', 'let a = {1, 2, 3};', 'let a = <1, 2, 3>;', 'A', 'Arrays use square brackets.', 'Array literals are written with square brackets: [1, 2, 3].'],
  ['Creating & Accessing Arrays', 'easy', 'let arr = ["a", "b", "c"]; What is arr[2]?', '"a"', '"b"', '"c"', 'undefined', 'C', 'Index 2 is the third element.', 'Indexes start at 0, so arr[2] is the third element, "c".'],
  ['Array Methods', 'easy', 'Which method removes the last element of an array?', 'shift()', 'push()', 'slice()', 'pop()', 'D', 'It is the opposite of push().', 'pop() removes the last element and returns it. shift() removes the first element.'],
  ['Array Methods', 'easy', 'Which method adds an element to the beginning of an array?', 'unshift()', 'push()', 'shift()', 'concat()', 'A', 'It is the opposite of shift().', 'unshift() adds one or more elements to the start of an array.'],
  ['Iteration Methods', 'easy', 'Which method runs a function for each element and always returns undefined?', 'map()', 'filter()', 'forEach()', 'reduce()', 'C', 'It is used only for side effects like printing.', 'forEach() calls the function for every element but returns undefined, unlike map() which returns a new array.'],
  ['Array Methods', 'easy', 'What does Array.isArray([]) return?', 'false', 'true', '"array"', 'undefined', 'B', 'The method name asks a yes/no question.', 'Array.isArray() returns true when the value is an array, and [] is an array.'],
  // ---------- MEDIUM ----------
  ['Creating & Accessing Arrays', 'medium', 'let arr = [10, 20, 30]; What is arr[5]?', '30', 'null', 'An error is thrown', 'undefined', 'D', 'Accessing a missing index does not crash.', 'Index 5 does not exist, and reading a missing index returns undefined, not an error.'],
  ['Array Methods', 'medium', 'What does [1, 2, 3, 4].slice(1, 3) return?', '[1, 2, 3]', '[2, 3]', '[2, 3, 4]', '[1, 2]', 'B', 'The end index is not included.', 'slice(1, 3) takes elements from index 1 up to, but not including, index 3: [2, 3].'],
  ['Array Methods', 'medium', 'What does [1, 2, 3].indexOf(5) return?', '0', 'undefined', '-1', 'null', 'C', 'It returns a number even when nothing is found.', 'indexOf() returns -1 when the element is not found in the array.'],
  ['Array Methods', 'medium', 'What does [3, 1, 2].includes(2) return?', 'true', 'false', '2', '1', 'A', 'includes() answers yes or no.', 'includes() returns true because 2 is present in the array.'],
  ['Iteration Methods', 'medium', 'What does [1, 2, 3].map(x => x * 2) return?', '[1, 4, 9]', '[1, 2, 3]', '[2, 4, 6]', '12', 'C', 'map() transforms every element into a new array.', 'map() returns a new array where each element is doubled: [2, 4, 6].'],
  ['Iteration Methods', 'medium', 'What does [1, 2, 3, 4].filter(n => n % 2 === 0) return?', '[1, 3]', '[2, 4]', '[false, true, false, true]', '2', 'B', 'filter() keeps only elements for which the function returns true.', 'Only 2 and 4 are even, so filter() returns [2, 4].'],
  ['Iteration Methods', 'medium', 'What does [1, 2, 3].reduce((sum, n) => sum + n, 0) return?', '[1, 2, 3]', '0', '123', '6', 'D', 'reduce() combines all elements into a single value.', 'Starting from 0, reduce() adds 1, 2 and 3, giving 6.'],
  ['Array Methods', 'medium', 'What does ["a", "b"].join("-") return?', '"a-b"', '["a-b"]', '"ab"', '"a,b"', 'A', 'join() returns a string, not an array.', 'join("-") combines the elements into a single string, separated by "-": "a-b".'],
  // ---------- HARD ----------
  ['Array Methods', 'hard', 'What does [10, 1, 3].sort() return?', '[1, 3, 10]', '[10, 3, 1]', '[1, 10, 3]', 'An error is thrown', 'C', 'Without a compare function, sort() compares values as strings.', 'By default sort() converts elements to strings, and "10" comes before "3" as text, so the result is [1, 10, 3]. Use sort((a, b) => a - b) for numbers.'],
  ['Creating & Accessing Arrays', 'hard', 'const a = [1, 2]; const b = a; b.push(3); console.log(a); What is printed?', '[1, 2]', '[1, 2, 3]', '[3]', 'TypeError', 'B', 'Arrays are stored by reference.', 'b points to the same array as a, so pushing through b also changes a: [1, 2, 3].'],
  ['Creating & Accessing Arrays', 'hard', 'What is the result of [1, 2, 3] === [1, 2, 3]?', 'TypeError', 'true', 'undefined', 'false', 'D', 'Two separate arrays are two separate objects.', 'Arrays are compared by reference, not by content. These are two different arrays in memory, so the result is false.'],
  ['Array Methods', 'hard', 'const arr = [1, 2, 3]; arr.length = 1; console.log(arr); What is printed?', '[1, 2, 3]', '[]', '[1]', 'An error is thrown', 'C', 'length is writable.', 'Setting length to a smaller number cuts off the extra elements, leaving [1].'],
  ['Iteration Methods', 'hard', 'What does [1, 2, 3].map(n => { n * 2 }) return?', '[2, 4, 6]', '[undefined, undefined, undefined]', '[]', 'An error is thrown', 'B', 'Curly braces in an arrow function need an explicit return.', 'With braces, the arrow function body has no return statement, so each call returns undefined.'],
  ['Iteration Methods', 'hard', 'What happens when you run [].reduce((a, b) => a + b)?', 'It returns 0', 'It returns undefined', 'It returns NaN', 'It throws a TypeError', 'D', 'Look at what is missing: an initial value.', 'reduce() on an empty array with no initial value throws "TypeError: Reduce of empty array with no initial value".'],
  ['Iteration Methods', 'hard', 'What does ["1", "2", "3"].map(parseInt) return?', '[1, NaN, NaN]', '[1, 2, 3]', '[NaN, NaN, NaN]', '["1", "2", "3"]', 'A', 'map() passes (element, index) and parseInt takes (string, radix).', 'The calls are parseInt("1", 0) = 1, parseInt("2", 1) = NaN and parseInt("3", 2) = NaN, because the index becomes the radix.'],
  ['Array Methods', 'hard', 'const arr = [1, 2, 3, 4, 5]; arr.splice(1, 2, "x"); console.log(arr); What is printed?', '[2, 3]', '[1, "x", 3, 4, 5]', '[1, "x", 4, 5]', '["x", 4, 5]', 'C', 'splice() removes and inserts in the same array.', 'splice(1, 2, "x") removes 2 elements starting at index 1 (2 and 3) and inserts "x" there: [1, "x", 4, 5].'],
  ['Creating & Accessing Arrays', 'hard', 'const [a, , b] = [1, 2, 3]; console.log(a, b); What is printed?', '1 2', '1 3', '2 3', 'undefined undefined', 'B', 'An empty slot in destructuring skips an element.', 'Array destructuring assigns a = 1, skips 2 because of the empty slot, and assigns b = 3.'],
  ['Array Methods', 'hard', 'What does [1, [2, [3]]].flat() return?', '[1, 2, 3]', '[1, [2, [3]]]', '[[1, 2], 3]', '[1, 2, [3]]', 'D', 'flat() flattens only one level by default.', 'flat() with no argument flattens one level deep, so the inner [3] stays nested: [1, 2, [3]].']
];
