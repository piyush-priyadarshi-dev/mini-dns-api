
const PG_ERROR_MAP: Record<string, string> = {
    "23505": "DB Error: Duplicate entry. This record already exists.",
    "23503": "DB Error: Foreign key constraint failed.",
    "23502": "DB Error: A required field is missing.",
    "23514": "DB Error: Field value violates constraints.",
    "22P02": "DB Error: Invalid input format.",
    "22001": "DB Error: Input too long.",
    "42703": "DB Error: Unknown column used.",
    "42P01": "DB Error: Database table does not exist.",
    "42601": "DB Error: Syntax error in query.",
    "40001": "DB Error: Concurrent update conflict. Please try again.",
};


export const sanitizeDBError = (error: Error): { isDbError: boolean; message: string } => {
    const code = (error as any)?.code;

    if (!code || !PG_ERROR_MAP[code]) {
        return { isDbError: false, message: error.message || "Unexpected error" };
    }

    return {
        isDbError: true,
        message: PG_ERROR_MAP[code],
    };
};