const db = require('../../database');

class Usuario {
    static async create(dadosUsuario) {
        return new Promise((resolve, reject) => {
            const { nomeCompleto, email, curso, semestre, senha } = dadosUsuario;
            
            const query = `
                INSERT INTO usuarios (nomeCompleto, email, curso, semestre, senha)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            db.run(query, [nomeCompleto, email, curso, semestre, senha], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }
    
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            
            db.get(query, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, nomeCompleto, email, curso, semestre, created_at FROM usuarios WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    static async getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, nomeCompleto, email, curso, semestre, created_at FROM usuarios ORDER BY created_at DESC';
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Usuario;