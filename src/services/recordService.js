const pool = require("../config/db");

// Lista de itens que não devem ser cobrados (exceções)
const FREE_EXTRAS = ['São Miguel']; 

// Função auxiliar privada
const calculatePrice = (priceConfig, status, extras) => {

  // 1. Valor Base
  let total = status === 'Fez' 
    ? Number(priceConfig.value_done) 
    : Number(priceConfig.value_not_done);

  // 2. Cálculo dos Adicionais com Exceção
  if (extras && extras.length > 0) {
    // Filtra: Mantém apenas os extras que NÃO estão na lista de gratuitos
    const payableExtras = extras.filter(extra => !FREE_EXTRAS.includes(extra));

    // Multiplica o valor adicional pela quantidade de itens pagáveis (Limpeza + Toalhas = 2 itens * R$17)
    total += (Number(priceConfig.value_additional) * payableExtras.length);
  }

  return total;
};

async function getAllRecords() {
    const result = await pool.query(`
        SELECT
        id,
        date::text AS date, 
        collaborator_id,
        procedure_id,
        status,
        notes,
        extras,
        calculated_value,
        created_at
        FROM service_records
        ORDER BY date DESC, created_at DESC; 
    `);
    return result.rows;
}

async function createRecord(data) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { date, collaboratorId, procedureId, status, notes, extras } = data;

        // 1. BUSCAR CONFIGURAÇÃO DE PREÇO
        const priceRes = await client.query(
            "SELECT * FROM price_configs WHERE procedure_id = $1", 
            [procedureId]
        );

        const priceConfig = priceRes.rows[0];

        if (!priceConfig) {
            throw new Error(`Preço não configurado para o procedimento ID: ${procedureId}`);
        }

        // 2. CALCULAR VALOR (Usando a função auxiliar)
        const finalValue = calculatePrice(priceConfig, status, extras);
        console.log('Final calculated value:', finalValue);

        // 3. INSERIR O REGISTRO
        const resRecord = await client.query(
            `INSERT INTO service_records 
            (date, collaborator_id, procedure_id, status, notes, extras, calculated_value)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [date, collaboratorId, procedureId, status, notes, extras, finalValue]
        );

        await client.query("COMMIT");
        return resRecord.rows[0];

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function deleteRecord(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        await client.query(
            "DELETE FROM service_records WHERE id = $1",
            [id]
        );

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    getAllRecords,
    createRecord,
    deleteRecord,
};