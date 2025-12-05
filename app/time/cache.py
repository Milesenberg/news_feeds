"""
Consequence Cache - SQLite database for LLM responses
"""
import sqlite3
import hashlib
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / 'consequence_cache.db'


def init_db():
    """Initialize the cache database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consequences (
            action_hash TEXT PRIMARY KEY,
            year INTEGER NOT NULL,
            action TEXT NOT NULL,
            consequence TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()


def get_cache_key(action, year):
    """Generate MD5 hash for caching"""
    content = f"{action.lower().strip()}:{year}"
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def get_cached_consequence(action, year):
    """Retrieve cached consequence if exists"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cache_key = get_cache_key(action, year)
    cursor.execute(
        'SELECT consequence FROM consequences WHERE action_hash = ?',
        (cache_key,)
    )
    
    result = cursor.fetchone()
    conn.close()
    
    return result[0] if result else None


def cache_consequence(action, year, consequence):
    """Store consequence in cache"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cache_key = get_cache_key(action, year)
    
    cursor.execute('''
        INSERT OR REPLACE INTO consequences (action_hash, year, action, consequence, timestamp)
        VALUES (?, ?, ?, ?, ?)
    ''', (cache_key, year, action, consequence, datetime.now()))
    
    conn.commit()
    conn.close()


def get_cache_stats():
    """Get cache statistics"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM consequences')
    total = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(DISTINCT year) FROM consequences')
    unique_years = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        'total_cached': total,
        'unique_years': unique_years
    }


# Initialize database on import
init_db()
