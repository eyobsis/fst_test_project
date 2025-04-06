import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { hash } from 'bcryptjs';
import path from 'path';

// Database singleton to prevent multiple connections
let db: any = null;

export async function getDb() {
  if (db) return db;
  
  try {
    db = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function initializeDb() {
  try {
    const db = await getDb();
    
    // Create users table with proper password storage
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create subscriptions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id TEXT NOT NULL,
        billing_cycle TEXT NOT NULL,
        status TEXT NOT NULL,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    // Create offices table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS offices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )
    `);
    
    // Add some dummy data if the database is empty
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    
    if (userCount.count === 0) {
      // Hash passwords for security
      const adminPassword = await hash('admin123', 10);
      const userPassword = await hash('user123', 10);
      
      // Add dummy users
      await db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin@example.com', adminPassword, 'Admin User', 'admin']
      );
      
      await db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        ['user@example.com', userPassword, 'Regular User', 'user']
      );
      
      console.log('Database initialized with dummy data');
    }
    
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw new Error('Failed to initialize database');
  }
}