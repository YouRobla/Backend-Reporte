// Endpoints de la API organizados por funcionalidad
export const API_ENDPOINTS = {
    REPORTES: {
        BASE: '/api/reportes',
        COMPLETOS: '/api/reportes-completos',
        CRUD: {
            CREATE: '/',
            GET_ALL: '/',
            GET_BY_ID: '/:id',
            UPDATE: '/:id',
            DELETE: '/:id',
            BY_ESTADO: '/estado/:estado',
            BY_NUMERO: '/numero-registro/:numero_registro'
        },
        EVIDENCIAS: {
            ADD: '/:reporteId/evidencias'
        }
    },
    ACCIONES: {
        BASE: '/api/acciones',
        CRUD: {
            CREATE: '/',
            GET_ALL: '/',
            GET_BY_ID: '/:id',
            UPDATE: '/:id',
            DELETE: '/:id',
            BY_REPORTE: '/reporte/:reporteId'
        }
    },
    EVIDENCIAS: {
        BASE: '/api/evidencias',
        CRUD: {
            CREATE: '/',
            GET_ALL: '/',
            GET_BY_ID: '/:id',
            UPDATE: '/:id',
            DELETE: '/:id',
            BY_REPORTE: '/reporte/:reporteId',
            BY_ACCION: '/accion/:accionId'
        }
    },
    UPLOAD: {
        BASE: '/api/upload',
        SINGLE: '/single',
        MULTIPLE: '/multiple',
        DELETE: '/:id',
        OPTIMIZE: '/optimize'
    }
};
