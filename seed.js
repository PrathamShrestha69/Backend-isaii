import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/config/database.js';
import Question from './src/models/question.model.js';

const questions = [
  {
    question: "What is the value of x if 3x + 15 = 45?",
    options: ["10", "15", "20", "25"],
    correctAnswer: 0,
    topic: "Quantitative Aptitude",
    difficulty: "easy",
    points: 1
  },
  {
    question: "If A is twice as old as B, and B is 15 years old, how old is A?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    topic: "Quantitative Aptitude",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 2,
    topic: "Quantitative Aptitude",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What comes next: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    topic: "Logical Reasoning",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 1,
    topic: "Data Structures",
    difficulty: "medium",
    points: 2
  },
  {
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 1,
    topic: "Data Structures",
    difficulty: "easy",
    points: 1
  },
  {
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 1,
    topic: "Quantitative Aptitude",
    difficulty: "easy",
    points: 1
  },
  {
    question: "In React, what hook is used for side effects?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    topic: "Programming",
    difficulty: "medium",
    points: 2
  },
  {
    question: "What is the output of: console.log(typeof null)?",
    options: ["null", "undefined", "object", "number"],
    correctAnswer: 2,
    topic: "Programming",
    difficulty: "medium",
    points: 2
  },
  {
    question: "A train travels 120 km in 2 hours. What is its speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
    topic: "Quantitative Aptitude",
    difficulty: "easy",
    points: 1
  }
];

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    await Question.deleteMany({});
    await Question.insertMany(questions);
    
    console.log(' Questions seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());