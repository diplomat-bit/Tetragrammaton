
import dotenv from 'dotenv';
dotenv.config();

const sqlVars = Object.keys(process.env).filter(key => key.startsWith('SQL_'));
console.log('SQL Variables found:', sqlVars.join(', '));
if (sqlVars.length > 0) {
  sqlVars.forEach(key => {
    console.log(`${key}: ${process.env[key] ? 'PRESENT' : 'EMPTY'}`);
  });
} else {
  console.log('No SQL variables found.');
}
