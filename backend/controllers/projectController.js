import { pool } from '../config/db.js';

export const createProject = async(req, res) =>{
    const {nombre,estado,fecha,horas_asignadas,horas_aumentadas}=req.body;

    if (!nombre || !estado || !horas_asignadas) {
        return res.status(400).json({ error: 'Los campos obligatorios deben ser completados.' });
    }
    try {
    // 1. Verificar si el nombre del proyecto ya existe
    const [existingProject] = await pool.query(
      'SELECT Id_proyecto FROM proyectos WHERE nombre = ?',
      [nombre]
    );

    if (existingProject.length > 0) {
      return res.status(400).json({ error: 'El nombre del proyecto ya está registrado.' });
    }

    // 2. Crear el codigo de acceso y verificar que no existe
    const codigoAcceso = Math.floor(1000 + Math.random() * 9000).toString();
    const codigo = await existing(codigoAcceso)

    async function existing (code){
        const [existingCode] = await pool.query(
        'select Id_proyecto from proyectos where codigo_acceso = ?',
        [code]
        );
        if(existingCode.length===0){
            return code
        }else{
            const codigoAcceso = Math.floor(1000 + Math.random() * 9000).toString();
        return await existing(codigoAcceso)
        }
    }
    // 3. Insertar el nuevo proyecto en la base de datos

    const [result] = await pool.query(
      'INSERT INTO proyectos (Id_proyecto, nombre, Id_estado, fecha_inicio, horas_asignadas, horas_aumentadas,codigo_acceso) values (?,?,?,?,?,?,?)',
      [null,nombre,estado,fecha||new Date(),horas_asignadas,horas_aumentadas||0,codigo] 
    );

    return res.status(201).json({
      message: 'Proyecto creado exitosamente.',
      proyectoId: result.insertId,
      proyectoNom: nombre,
      proyectoCode: codigo
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el proyecto en la base de datos.' });
  }
};