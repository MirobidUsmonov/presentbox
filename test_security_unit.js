
const { hashPassword, verifyPassword, signSession, verifySession } = require('./lib/security');

// 1. Test Password Hashing/Verification
console.log("Testing Password Security...");
const password = "Mirobid2020+";
const wrongPassword = "WrongPassword123";

const { hash, salt } = hashPassword(password);
console.log("Generated Hash:", hash.substring(0, 10) + "...");

const isCorrect = verifyPassword(password, hash, salt);
console.log("Password Verification (Correct):", isCorrect === true ? "PASS" : "FAIL");

const isWrong = verifyPassword(wrongPassword, hash, salt);
console.log("Password Verification (Wrong):", isWrong === false ? "PASS" : "FAIL");

// 2. Test Session Signing
console.log("\nTesting Session Security...");
const payload = "bido|1|9999999999999";
const token = signSession(payload);
console.log("Generated Token:", token.substring(0, 20) + "...");

const verifiedPayload = verifySession(token);
console.log("Session Verification (Valid):", verifiedPayload === payload ? "PASS" : "FAIL");

const tamperedToken = token + "fake";
const invalidPayload = verifySession(tamperedToken);
console.log("Session Verification (Tampered):", invalidPayload === null ? "PASS" : "FAIL");

console.log("\nSecurity Check Complete.");
