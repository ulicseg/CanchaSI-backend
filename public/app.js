// ========== CONFIGURACIÓN ==========
// ========== CONFIGURACIÓN ==========
const BASE_URL = 'https://api-fmpiiqdxzq-uc.a.run.app'; // URL unificada

const API_ENDPOINTS = {
    management: `${BASE_URL}/management`,
    bookings: `${BASE_URL}/bookings`,
    social: `${BASE_URL}/social`
};

// ========== ESTADO GLOBAL ==========
let currentUser = null;
let idToken = null;
let currentEndpoint = null;
let contextStore = {}; // Smart Context Store

// ========== DEFINICIÓN DE ENDPOINTS ==========
const ENDPOINTS = {
    management: [
        {
            id: 'owner-register',
            method: 'POST',
            path: '/owners/register',
            module: 'management',
            description: 'Registrar un nuevo propietario',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                email: { type: 'string', required: false, example: 'juan@example.com', description: 'Email (opcional)' }
            }
        },
        {
            id: 'owner-profile-get',
            method: 'GET',
            path: '/owners/profile',
            module: 'management',
            description: 'Obtener perfil del propietario autenticado',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'owner-profile-update',
            method: 'PUT',
            path: '/owners/profile',
            module: 'management',
            description: 'Actualizar perfil del propietario',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                name: { type: 'string', required: false, example: 'Juan Pérez', description: 'Nombre' },
                phone: { type: 'string', required: false, example: '+5491112345678', description: 'Teléfono' }
            }
        },
        {
            id: 'complex-create',
            method: 'POST',
            path: '/complexes',
            module: 'management',
            description: 'Crear un nuevo complejo deportivo',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                name: { type: 'string', required: true, example: 'Complejo El Monumental', description: 'Nombre del complejo' },
                description: { type: 'string', required: false, example: 'El mejor complejo de la zona', description: 'Descripción' },
                addressText: { type: 'string', required: true, example: 'Av. Figueroa Alcorta 7597', description: 'Dirección' },
                phone: { type: 'string', required: false, example: '1112345678', description: 'Teléfono' },
                openHour: { type: 'number', required: true, example: 9, description: 'Hora de apertura (0-23)' },
                closeHour: { type: 'number', required: true, example: 23, description: 'Hora de cierre (0-23)' },
                geo: { type: 'object', required: false, example: { lat: -34.54, lng: -58.44 }, description: 'Coordenadas geográficas' }
            }
        },
        {
            id: 'complex-update',
            method: 'PUT',
            path: '/complexes/:id',
            module: 'management',
            description: 'Actualizar un complejo existente',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: {
                name: { type: 'string', required: false, example: 'Complejo El Monumental', description: 'Nombre' },
                description: { type: 'string', required: false, example: 'El mejor complejo', description: 'Descripción' },
                addressText: { type: 'string', required: false, example: 'Av. Figueroa Alcorta 7597', description: 'Dirección' },
                phone: { type: 'string', required: false, example: '1112345678', description: 'Teléfono' },
                openHour: { type: 'number', required: false, example: 9, description: 'Hora apertura' },
                closeHour: { type: 'number', required: false, example: 23, description: 'Hora cierre' }
            }
        },
        {
            id: 'complex-mine',
            method: 'GET',
            path: '/complexes/mine',
            module: 'management',
            description: 'Listar complejos del propietario autenticado',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'complex-photos-add',
            method: 'POST',
            path: '/complexes/:id/photos',
            module: 'management',
            description: 'Agregar foto a un complejo',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: {
                photoUrl: { type: 'string', required: true, example: 'https://example.com/photo.jpg', description: 'URL de la foto' }
            }
        },
        {
            id: 'complex-photos-delete',
            method: 'DELETE',
            path: '/complexes/:id/photos/:index',
            module: 'management',
            description: 'Eliminar una foto de un complejo',
            requiresAuth: true,
            params: [
                { name: 'id', type: 'string', required: true, description: 'ID del complejo' },
                { name: 'index', type: 'number', required: true, description: 'Índice de la foto' }
            ],
            query: [],
            body: null
        },
        {
            id: 'complex-reservations',
            method: 'GET',
            path: '/complexes/:id/reservations',
            module: 'management',
            description: 'Listar reservas de un complejo',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: null
        },
        {
            id: 'dashboard-stats',
            method: 'GET',
            path: '/dashboard/stats',
            module: 'management',
            description: 'Obtener estadísticas del dashboard',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'field-create',
            method: 'POST',
            path: '/fields',
            module: 'management',
            description: 'Crear una nueva cancha',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                complexId: { type: 'string', required: true, example: 'complex_123', description: 'ID del complejo' },
                name: { type: 'string', required: true, example: 'Cancha 1 - Techada', description: 'Nombre de la cancha' },
                type: { type: 'string', required: true, example: 'Futbol 5', description: 'Tipo de cancha' },
                pricePerHour: { type: 'number', required: true, example: 10000, description: 'Precio por hora' },
                indoor: { type: 'boolean', required: false, example: true, description: '¿Es techada?' },
                surface: { type: 'string', required: false, example: 'Sintético', description: 'Superficie' }
            }
        },
        {
            id: 'field-update',
            method: 'PUT',
            path: '/fields/:id',
            module: 'management',
            description: 'Actualizar una cancha',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la cancha' }],
            query: [],
            body: {
                name: { type: 'string', required: false, example: 'Cancha 1', description: 'Nombre' },
                pricePerHour: { type: 'number', required: false, example: 12000, description: 'Precio por hora' },
                type: { type: 'string', required: false, example: 'Futbol 5', description: 'Tipo' }
            }
        },
        {
            id: 'field-delete',
            method: 'DELETE',
            path: '/fields/:id',
            module: 'management',
            description: 'Eliminar una cancha',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la cancha' }],
            query: [],
            body: null
        }
    ],
    bookings: [
        {
            id: 'search-complexes',
            method: 'GET',
            path: '/search/complexes',
            module: 'bookings',
            description: 'Listar todos los complejos deportivos',
            requiresAuth: false,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'search-complex-detail',
            method: 'GET',
            path: '/search/complexes/:id',
            module: 'bookings',
            description: 'Obtener detalles de un complejo',
            requiresAuth: false,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: null
        },
        {
            id: 'availability',
            method: 'GET',
            path: '/availability/:fieldId',
            module: 'bookings',
            description: 'Obtener disponibilidad de una cancha',
            requiresAuth: true,
            params: [{ name: 'fieldId', type: 'string', required: true, description: 'ID de la cancha' }],
            query: [
                { name: 'date', type: 'string', required: true, example: '2024-01-15', description: 'Fecha (YYYY-MM-DD)' },
                { name: 'time', type: 'string', required: false, example: '14:00', description: 'Hora (HH:mm) - Opcional' }
            ],
            body: null
        },
        {
            id: 'hold-create',
            method: 'POST',
            path: '/bookings/hold',
            module: 'bookings',
            description: 'Bloquear temporalmente una cancha (15 min)',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                fieldId: { type: 'string', required: true, example: 'field_123', description: 'ID de la cancha' },
                date: { type: 'string', required: true, example: '2024-01-15', description: 'Fecha (YYYY-MM-DD)' },
                time: { type: 'string', required: true, example: '14:00', description: 'Hora (HH:mm)' }
            }
        },
        {
            id: 'payment-preference',
            method: 'POST',
            path: '/mp/create-preference',
            module: 'bookings',
            description: 'Crear preferencia de pago (MercadoPago)',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                holdId: { type: 'string', required: true, example: 'hold_123', description: 'ID del hold' }
            }
        },
        {
            id: 'bookings-my',
            method: 'GET',
            path: '/bookings/my',
            module: 'bookings',
            description: 'Obtener mis reservas',
            requiresAuth: true,
            params: [],
            query: [
                { name: 'status', type: 'string', required: false, example: 'confirmed', description: 'Filtrar por estado' },
                { name: 'limit', type: 'number', required: false, example: 50, description: 'Límite de resultados' }
            ],
            body: null
        },
        {
            id: 'booking-detail',
            method: 'GET',
            path: '/bookings/:id',
            module: 'bookings',
            description: 'Obtener detalle de una reserva',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la reserva' }],
            query: [],
            body: null
        },
        {
            id: 'booking-cancel',
            method: 'DELETE',
            path: '/bookings/:id',
            module: 'bookings',
            description: 'Cancelar una reserva',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la reserva' }],
            query: [],
            body: null
        },
        {
            id: 'favorites-add',
            method: 'POST',
            path: '/favorites/:complexId',
            module: 'bookings',
            description: 'Agregar complejo a favoritos',
            requiresAuth: true,
            params: [{ name: 'complexId', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: null
        },
        {
            id: 'favorites-remove',
            method: 'DELETE',
            path: '/favorites/:complexId',
            module: 'bookings',
            description: 'Eliminar complejo de favoritos',
            requiresAuth: true,
            params: [{ name: 'complexId', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: null
        },
        {
            id: 'favorites-list',
            method: 'GET',
            path: '/favorites',
            module: 'bookings',
            description: 'Listar favoritos del usuario',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'owner-booking-manual',
            method: 'POST',
            path: '/owner/bookings/manual',
            module: 'bookings',
            description: 'Crear reserva manual (propietario)',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                fieldId: { type: 'string', required: true, example: 'field_123', description: 'ID de la cancha' },
                date: { type: 'string', required: true, example: '2024-01-15', description: 'Fecha (YYYY-MM-DD)' },
                time: { type: 'string', required: true, example: '14:00', description: 'Hora (HH:mm)' },
                customerName: { type: 'string', required: true, example: 'Juan Pérez', description: 'Nombre del cliente' },
                customerPhone: { type: 'string', required: false, example: '+5491112345678', description: 'Teléfono' },
                customerEmail: { type: 'string', required: false, example: 'cliente@example.com', description: 'Email' },
                notes: { type: 'string', required: false, example: 'Reserva especial', description: 'Notas' }
            }
        },
        {
            id: 'owner-booking-cancel',
            method: 'POST',
            path: '/owner/bookings/:id/cancel',
            module: 'bookings',
            description: 'Cancelar reserva como propietario',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la reserva' }],
            query: [],
            body: {
                reason: { type: 'string', required: false, example: 'Cancelación por mantenimiento', description: 'Razón de cancelación' }
            }
        },

    ],
    social: [
        {
            id: 'player-auth',
            method: 'POST',
            path: '/players/auth',
            module: 'social',
            description: 'Autenticar/registrar jugador',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'player-profile',
            method: 'GET',
            path: '/players/me',
            module: 'social',
            description: 'Obtener perfil del jugador',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'player-update',
            method: 'PUT',
            path: '/players/me',
            module: 'social',
            description: 'Actualizar perfil del jugador',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                name: { type: 'string', required: false, example: 'Lionel Messi', description: 'Nombre' },
                phone: { type: 'string', required: false, example: '+5491112345678', description: 'Teléfono' },
                positionLevel: { type: 'string', required: false, example: 'Delantero / Experto', description: 'Posición' },
                photoURL: { type: 'string', required: false, example: 'https://example.com/photo.jpg', description: 'Foto' }
            }
        },
        {
            id: 'matchmaking-create',
            method: 'POST',
            path: '/matchmaking/create',
            module: 'social',
            description: 'Crear partido para matchmaking',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                bookingId: { type: 'string', required: true, example: 'booking_123', description: 'ID de reserva (obligatorio)' },
                totalPlayers: { type: 'number', required: false, example: 10, description: 'Total de jugadores' },
                missingPlayers: { type: 'number', required: true, example: 3, description: 'Jugadores faltantes' },
                description: { type: 'string', required: false, example: 'Partido amistoso', description: 'Descripción' }
            }
        },
        {
            id: 'matchmaking-feed',
            method: 'GET',
            path: '/matchmaking/feed',
            module: 'social',
            description: 'Obtener feed de partidos disponibles',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'matchmaking-apply',
            method: 'POST',
            path: '/matchmaking/:id/apply',
            module: 'social',
            description: 'Aplicar para participar en un partido',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del partido' }],
            query: [],
            body: null
        },
        {
            id: 'matchmaking-applicants',
            method: 'GET',
            path: '/matchmaking/:id/applicants',
            module: 'social',
            description: 'Listar aplicantes a un partido',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID del partido' }],
            query: [],
            body: null
        },
        {
            id: 'matchmaking-accept',
            method: 'PUT',
            path: '/matchmaking/applicant/:matchId/:applicantId/accept',
            module: 'social',
            description: 'Aceptar a un jugador en un partido',
            requiresAuth: true,
            params: [
                { name: 'matchId', type: 'string', required: true, description: 'ID del partido' },
                { name: 'applicantId', type: 'string', required: true, description: 'ID del aplicante' }
            ],
            query: [],
            body: null
        },
        {
            id: 'matchmaking-reject',
            method: 'PUT',
            path: '/matchmaking/applicant/:matchId/:applicantId/reject',
            module: 'social',
            description: 'Rechazar a un jugador en un partido',
            requiresAuth: true,
            params: [
                { name: 'matchId', type: 'string', required: true, description: 'ID del partido' },
                { name: 'applicantId', type: 'string', required: true, description: 'ID del aplicante' }
            ],
            query: [],
            body: null
        },
        {
            id: 'review-create',
            method: 'POST',
            path: '/reviews',
            module: 'social',
            description: 'Crear reseña para un complejo',
            requiresAuth: true,
            params: [],
            query: [],
            body: {
                complexId: { type: 'string', required: true, example: 'complex_123', description: 'ID del complejo' },
                rating: { type: 'number', required: true, example: 5, description: 'Rating (1-5)' },
                comment: { type: 'string', required: false, example: 'Excelente complejo', description: 'Comentario' }
            }
        },
        {
            id: 'review-list',
            method: 'GET',
            path: '/reviews/:complexId',
            module: 'social',
            description: 'Obtener reseñas de un complejo',
            requiresAuth: true,
            params: [{ name: 'complexId', type: 'string', required: true, description: 'ID del complejo' }],
            query: [],
            body: null
        },
        {
            id: 'notifications-list',
            method: 'GET',
            path: '/notifications',
            module: 'social',
            description: 'Leer notificaciones (histórico)',
            requiresAuth: true,
            params: [],
            query: [],
            body: null
        },
        {
            id: 'notification-read',
            method: 'PUT',
            path: '/notifications/:id/read',
            module: 'social',
            description: 'Marcar notificación como leída',
            requiresAuth: true,
            params: [{ name: 'id', type: 'string', required: true, description: 'ID de la notificación' }],
            query: [],
            body: null
        }
    ]
};

// ========== INICIALIZACIÓN ==========
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { ref, onValue, off } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Renderizar navegación
    renderNavigation();

    // Listeners
    document.getElementById('authBtn').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'flex';
    });

    document.getElementById('closeAuthModal').addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });

    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('endpointSearch').addEventListener('input', filterEndpoints);
    document.getElementById('endpointSearch').addEventListener('input', filterEndpoints);
    document.getElementById('toggleClipboard').addEventListener('click', toggleClipboard);
    document.getElementById('toggleNotifications').addEventListener('click', toggleNotificationsPanel);

    // Inicializar clipboard y context
    initClipboard();
    loadClipboard();
    initContext();

    // Auth state observer
    if (window.firebaseAuth) {
        onAuthStateChanged(window.firebaseAuth, async (user) => {
            if (user) {
                currentUser = user;
                idToken = await user.getIdToken();
                updateAuthStatus(true, user.email);
                setupRealtimeNotifications();
            } else {
                updateAuthStatus(false);
                stopRealtimeNotifications();
            }
        });
    }
}

// ========== AUTENTICACIÓN ==========
async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        document.getElementById('authModal').style.display = 'none';
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
                document.getElementById('authModal').style.display = 'none';
            } catch (createError) {
                alert('Error: ' + createError.message);
            }
        } else {
            alert('Error: ' + error.message);
        }
    }
}

async function handleLogout() {
    await signOut(window.firebaseAuth);
    currentUser = null;
    idToken = null;
}

function updateAuthStatus(authenticated, email = '') {
    const status = document.getElementById('authStatus');
    const indicator = status.querySelector('.status-indicator');
    const btn = document.getElementById('authBtn');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');

    if (authenticated) {
        indicator.className = 'status-indicator online';
        status.querySelector('span:last-child').textContent = 'Autenticado';
        btn.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = email;
    } else {
        indicator.className = 'status-indicator offline';
        status.querySelector('span:last-child').textContent = 'No autenticado';
        btn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

// ========== NAVEGACIÓN ==========
function renderNavigation() {
    const nav = document.getElementById('endpointNav');
    let html = '';

    Object.keys(ENDPOINTS).forEach(module => {
        const moduleName = module.charAt(0).toUpperCase() + module.slice(1);
        html += `<div class="nav-group" data-module="${module}">`;
        html += `<div class="nav-group-header"><h3>${moduleName}</h3><span class="endpoint-count">${ENDPOINTS[module].length}</span></div>`;
        html += `<div class="nav-group-content">`;

        ENDPOINTS[module].forEach(endpoint => {
            const methodColor = getMethodColor(endpoint.method);
            html += `
                <div class="nav-item" data-endpoint-id="${endpoint.id}" onclick="selectEndpoint('${endpoint.id}')">
                    <span class="method-badge ${methodColor}">${endpoint.method}</span>
                    <span class="endpoint-path">${endpoint.path}</span>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    nav.innerHTML = html;
}

function filterEndpoints(e) {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.nav-item');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

function getMethodColor(method) {
    const colors = {
        'GET': 'method-get',
        'POST': 'method-post',
        'PUT': 'method-put',
        'DELETE': 'method-delete'
    };
    return colors[method] || 'method-default';
}

// ========== SELECCIÓN DE ENDPOINT ==========
function selectEndpoint(endpointId) {
    // Encontrar el endpoint
    let endpoint = null;
    for (const module of Object.values(ENDPOINTS)) {
        endpoint = module.find(e => e.id === endpointId);
        if (endpoint) break;
    }

    if (!endpoint) return;

    currentEndpoint = endpoint;

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.endpointId === endpointId) {
            item.classList.add('active');
        }
    });

    // Renderizar endpoint
    renderEndpoint(endpoint);
}

function renderEndpoint(endpoint) {
    const viewer = document.getElementById('endpointViewer');
    const methodColor = getMethodColor(endpoint.method);
    const fullUrl = `${API_ENDPOINTS[endpoint.module]}${endpoint.path}`;

    let html = `
        <div class="endpoint-card">
            <div class="endpoint-header">
                <div class="endpoint-title">
                    <span class="method-badge-large ${methodColor}">${endpoint.method}</span>
                    <h2>${endpoint.path}</h2>
                </div>
                <p class="endpoint-description">${endpoint.description}</p>
                <div class="endpoint-url">
                    <span class="url-label">URL:</span>
                    <code>${fullUrl}</code>
                </div>
            </div>
            
            <div class="endpoint-body">
                ${renderEndpointForm(endpoint)}
            </div>
            
            <div class="endpoint-response" id="responsePanel" style="display: none;">
                <div class="response-header">
                    <h3>Respuesta</h3>
                    <button class="btn-clear" onclick="clearResponse()">Limpiar</button>
                </div>
                <div class="response-content" id="responseContent"></div>
            </div>
        </div>
    `;

    viewer.innerHTML = html;
}

function renderEndpointForm(endpoint) {
    let html = '<form class="endpoint-form" id="endpointForm" onsubmit="executeEndpoint(event)">';

    // Parámetros de ruta
    if (endpoint.params.length > 0) {
        html += '<div class="form-section"><h4>📌 Parámetros de Ruta</h4>';
        endpoint.params.forEach(param => {
            html += `
                <div class="form-group-compact">
                    <label>${param.name} <span class="required">*</span></label>
                    <input type="${param.type === 'number' ? 'number' : 'text'}" 
                           name="param_${param.name}" 
                           placeholder="${param.description}"
                           required>
                </div>
            `;
        });
        html += '</div>';
    }

    // Query parameters
    if (endpoint.query.length > 0) {
        html += '<div class="form-section"><h4>🔍 Query Parameters</h4>';
        endpoint.query.forEach(query => {
            html += `
                <div class="form-group-compact">
                    <label>${query.name}${query.required ? ' <span class="required">*</span>' : ''}</label>
                    <input type="${query.type === 'number' ? 'number' : 'text'}" 
                           name="query_${query.name}" 
                           placeholder="${query.example || query.description}"
                           ${query.required ? 'required' : ''}>
                </div>
            `;
        });
        html += '</div>';
    }

    // Body
    if (endpoint.body) {
        html += '<div class="form-section"><h4>📦 Request Body</h4>';
        const bodyKeys = Object.keys(endpoint.body);
        const bodyFields = bodyKeys.slice(0, 4); // Mostrar solo primeros 4 campos
        const hasMore = bodyKeys.length > 4;

        bodyFields.forEach(key => {
            const field = endpoint.body[key];
            const optionalText = !field.required ? ' <span style="font-size: 0.8em; color: #888;">(Opcional)</span>' : '';
            html += `
                <div class="form-group-compact">
                    <label>${key}${field.required ? ' <span class="required">*</span>' : ''}${optionalText}</label>
                    ${renderFieldInput(key, field)}
                </div>
            `;
        });

        if (hasMore) {
            html += `<div class="form-more-fields" id="moreFields" style="display: none;">`;
            bodyKeys.slice(4).forEach(key => {
                const field = endpoint.body[key];
                const optionalText = !field.required ? ' <span style="font-size: 0.8em; color: #888;">(Opcional)</span>' : '';
                html += `
                    <div class="form-group-compact">
                        <label>${key}${field.required ? ' <span class="required">*</span>' : ''}${optionalText}</label>
                        ${renderFieldInput(key, field)}
                    </div>
                `;
            });
            html += `</div>`;
            html += `<button type="button" class="btn-show-more" onclick="toggleMoreFields()">Ver ${bodyKeys.length - 4} campos más</button>`;
        }

        html += '</div>';
    }

    // Auth warning
    if (endpoint.requiresAuth && !idToken) {
        html += '<div class="auth-warning">⚠️ Este endpoint requiere autenticación</div>';
    }

    html += '<button type="submit" class="btn-execute">▶️ Ejecutar Request</button>';
    html += '</form>';

    return html;
}

function renderFieldInput(name, field) {
    // Buscar valor en contexto
    let contextValue = '';
    let isAutoFilled = false;

    // 1. Busqueda exacta (ej: complexId)
    if (contextStore[name]) {
        contextValue = contextStore[name];
        isAutoFilled = true;
    }
    // 2. Busqueda por heurística para 'id' genérico (params)
    else if (name === 'id') {
        // Si estamos en management/complexes, el 'id' probablemente sea un complexId
        if (currentEndpoint.module === 'management' && currentEndpoint.path.includes('complexes')) {
            if (contextStore['complexId']) {
                contextValue = contextStore['complexId'];
                isAutoFilled = true;
            }
        } else if (currentEndpoint.module === 'management' && currentEndpoint.path.includes('fields')) {
            if (contextStore['fieldId']) {
                contextValue = contextStore['fieldId'];
                isAutoFilled = true;
            }
        } else if (currentEndpoint.module === 'bookings' && currentEndpoint.path.includes('bookings')) {
            if (contextStore['bookingId']) {
                contextValue = contextStore['bookingId'];
                isAutoFilled = true;
            }
        }
    }
    // 3. Auto-fill email from current user
    else if (name === 'email' && currentUser && currentUser.email) {
        contextValue = currentUser.email;
        isAutoFilled = true;
    }

    const autoFillClass = isAutoFilled ? 'auto-filled' : '';
    const titleAttr = isAutoFilled ? `title="✨ Auto-completado desde Smart Context: ${contextValue}"` : '';
    const requiredAttr = field.required ? 'required' : '';

    if (field.type === 'boolean') {
        return `<input type="checkbox" name="body_${name}" ${requiredAttr} ${contextValue ? 'checked' : ''} class="${autoFillClass}" ${titleAttr}>`;
    } else if (field.type === 'number') {
        return `<input type="number" name="body_${name}" placeholder="${field.example}" ${requiredAttr} value="${contextValue}" class="${autoFillClass}" ${titleAttr}>`;
    } else if (field.type === 'object') {
        return `<textarea name="body_${name}" placeholder='${JSON.stringify(field.example, null, 2)}' ${requiredAttr} class="${autoFillClass}" ${titleAttr}>${contextValue ? JSON.stringify(contextValue) : ''}</textarea>`;
    } else {
        return `<input type="text" name="body_${name}" placeholder="${field.example}" ${requiredAttr} value="${contextValue}" class="${autoFillClass}" ${titleAttr}>`;
    }
}

// ========== EJECUCIÓN DE ENDPOINT ==========
async function executeEndpoint(e) {
    e.preventDefault();

    if (!currentEndpoint) return;

    // Verificar autenticación
    if (currentEndpoint.requiresAuth && !idToken) {
        alert('Este endpoint requiere autenticación. Por favor, autentícate primero.');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);

    // Construir URL con parámetros
    let url = `${API_ENDPOINTS[currentEndpoint.module]}${currentEndpoint.path}`;

    // Reemplazar parámetros de ruta
    currentEndpoint.params.forEach(param => {
        const value = formData.get(`param_${param.name}`);
        url = url.replace(`:${param.name}`, value);
    });

    // Agregar query parameters
    const queryParams = [];
    currentEndpoint.query.forEach(query => {
        const value = formData.get(`query_${query.name}`);
        if (value) {
            queryParams.push(`${query.name}=${encodeURIComponent(value)}`);
        }
    });
    if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
    }

    // Construir body
    let body = null;
    if (currentEndpoint.body) {
        body = {};
        Object.keys(currentEndpoint.body).forEach(key => {
            const value = formData.get(`body_${key}`);
            if (value !== null && value !== '') {
                const field = currentEndpoint.body[key];
                if (field.type === 'number') {
                    body[key] = parseFloat(value);
                } else if (field.type === 'boolean') {
                    body[key] = formData.get(`body_${key}`) === 'on';
                } else if (field.type === 'object') {
                    try {
                        body[key] = JSON.parse(value);
                    } catch {
                        body[key] = value;
                    }
                } else {
                    body[key] = value;
                }
            }
        });
    }

    // Ejecutar request
    const startTime = Date.now();
    const responsePanel = document.getElementById('responsePanel');
    const responseContent = document.getElementById('responseContent');

    responsePanel.style.display = 'block';
    responseContent.innerHTML = '<div class="loading">⏳ Ejecutando request...</div>';

    try {
        const options = {
            method: currentEndpoint.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (idToken) {
            options.headers['Authorization'] = `Bearer ${idToken}`;
        }

        if (body && (currentEndpoint.method === 'POST' || currentEndpoint.method === 'PUT')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const responseTime = Date.now() - startTime;
        const responseData = await response.json();

        // Extraer y sugerir IDs
        const ids = extractIdsFromResponse(responseData);
        let suggestionsHtml = '';
        if (ids.length > 0) {
            suggestionsHtml = '<div class="id-suggestions"><h4>💡 IDs encontrados - ¿Guardar en portapapeles?</h4>';
            ids.forEach(id => {
                suggestionsHtml += `
                    <div class="id-suggestion-item">
                        <span><strong>${id.label}:</strong> <code>${id.value}</code></span>
                        <button class="btn-save-id" onclick="quickSaveId('${id.label}', '${id.value}')">💾 Guardar</button>
                    </div>
                `;
            });
            suggestionsHtml += '</div>';
        }

        // Mostrar respuesta
        const statusClass = response.ok ? 'status-success' : 'status-error';
        responseContent.innerHTML = suggestionsHtml + `
            <div class="response-info">
                <div class="response-status ${statusClass}">
                    <span>Status: ${response.status} ${response.statusText}</span>
                    <span>⏱️ ${responseTime}ms</span>
                </div>
                <div class="response-headers">
                    <h4>Headers de Respuesta:</h4>
                    <pre>${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}</pre>
                </div>
                <div class="response-body">
                    <h4>Body de Respuesta:</h4>
                    <pre class="json-response">${JSON.stringify(responseData, null, 2)}</pre>
                </div>
                <div class="request-details">
                    <h4>Request Enviado:</h4>
                    <div class="request-info">
                        <p><strong>Method:</strong> ${currentEndpoint.method}</p>
                        <p><strong>URL:</strong> <code>${url}</code></p>
                        ${body ? `<p><strong>Body:</strong></p><pre>${JSON.stringify(body, null, 2)}</pre>` : ''}
                        ${options.headers['Authorization'] ? '<p><strong>Authorization:</strong> Bearer [token]</p>' : ''}
                    </div>
                </div>
            </div>
        `;

        // Actualizar Smart Context
        updateContext(currentEndpoint, responseData);

    } catch (error) {
        responseContent.innerHTML = `
            <div class="response-error">
                <h4>❌ Error</h4>
                <p>${error.message}</p>
                <pre>${error.stack}</pre>
            </div>
        `;
    }
}

function clearResponse() {
    document.getElementById('responsePanel').style.display = 'none';
}

// ========== CLIPBOARD ==========
let clipboard = [];

function initClipboard() {
    // Cargar desde localStorage
    const saved = localStorage.getItem('canchasi_clipboard');
    if (saved) {
        try {
            clipboard = JSON.parse(saved);
        } catch (e) {
            clipboard = [];
        }
    }
}

function saveClipboard() {
    localStorage.setItem('canchasi_clipboard', JSON.stringify(clipboard));
    renderClipboard();
}

function loadClipboard() {
    renderClipboard();
}

function addToClipboard() {
    const label = document.getElementById('clipboardLabel').value.trim();
    const value = document.getElementById('clipboardValue').value.trim();

    if (!label || !value) {
        alert('Por favor completa ambos campos');
        return;
    }

    clipboard.push({
        id: Date.now().toString(),
        label: label,
        value: value,
        timestamp: new Date().toLocaleString()
    });

    document.getElementById('clipboardLabel').value = '';
    document.getElementById('clipboardValue').value = '';

    saveClipboard();
}

function removeFromClipboard(id) {
    clipboard = clipboard.filter(item => item.id !== id);
    saveClipboard();
}

function copyToClipboard(value, btnElement = null) {
    navigator.clipboard.writeText(value).then(() => {
        // Mostrar feedback visual
        if (btnElement) {
            const originalText = btnElement.textContent;
            btnElement.textContent = '✓ Copiado';
            btnElement.style.background = 'var(--swagger-green)';
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.style.background = '';
            }, 2000);
        }
    }).catch(err => {
        alert('Error al copiar: ' + err.message);
    });
}

function renderClipboard() {
    const container = document.getElementById('clipboardItems');

    if (clipboard.length === 0) {
        container.innerHTML = '<div class="clipboard-empty">No hay items guardados. Agrega IDs para reutilizarlos.</div>';
        return;
    }

    container.innerHTML = clipboard.map(item => `
        <div class="clipboard-item">
            <div class="clipboard-item-info" onclick="pasteToForm('${item.value.replace(/'/g, "\\'")}')" style="cursor: pointer;" title="Clic para pegar en el campo activo">
                <span class="clipboard-label">${item.label}</span>
                <code class="clipboard-value">${item.value}</code>
                <span class="clipboard-time">${item.timestamp}</span>
            </div>
            <div class="clipboard-item-actions">
                <button class="btn-copy" onclick="event.stopPropagation(); copyToClipboard('${item.value.replace(/'/g, "\\'")}', this)">📋 Copiar</button>
                <button class="btn-remove" onclick="event.stopPropagation(); removeFromClipboard('${item.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function pasteToForm(value) {
    // Buscar el campo activo o el primer campo de input/textarea
    const activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.value = value;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.focus();

        // Feedback visual
        const originalBg = activeElement.style.background;
        activeElement.style.background = 'rgba(73, 204, 144, 0.2)';
        setTimeout(() => {
            activeElement.style.background = originalBg;
        }, 1000);
    } else {
        // Si no hay campo activo, copiar al portapapeles
        copyToClipboard(value);
    }
}

function toggleClipboard() {
    const body = document.getElementById('clipboardBody');
    const btn = document.getElementById('toggleClipboard');

    if (body.style.display === 'none') {
        body.style.display = 'block';
        btn.textContent = '▼';
    } else {
        body.style.display = 'none';
        btn.textContent = '▲';
    }
}

// Función para extraer IDs automáticamente de respuestas
function extractIdsFromResponse(responseData) {
    if (!responseData || typeof responseData !== 'object') return;

    const ids = [];

    // Buscar IDs comunes en la respuesta
    function findIds(obj, path = '') {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                findIds(item, `${path}[${index}]`);
            });
        } else if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                const currentPath = path ? `${path}.${key}` : key;

                // Si la clave contiene "id" o "Id" y el valor es string/number
                if ((key.toLowerCase().includes('id') || key === 'complexId' || key === 'fieldId' || key === 'bookingId' || key === 'matchId' || key === 'applicantId' || key === 'reviewId' || key === 'notificationId') &&
                    (typeof value === 'string' || typeof value === 'number') &&
                    value.toString().length > 0) {
                    ids.push({
                        label: `${key}${path ? ` (${path})` : ''}`,
                        value: value.toString()
                    });
                }

                if (typeof value === 'object') {
                    findIds(value, currentPath);
                }
            });
        }
    }

    findIds(responseData);
    return ids;
}

// Modificar la función de respuesta para sugerir guardar IDs
function showIdSuggestions(responseData) {
    const ids = extractIdsFromResponse(responseData);
    if (ids.length === 0) return;

    const responseContent = document.getElementById('responseContent');
    const existingContent = responseContent.innerHTML;

    let suggestionsHtml = '<div class="id-suggestions"><h4>💡 IDs encontrados - ¿Guardar en portapapeles?</h4>';
    ids.forEach(id => {
        suggestionsHtml += `
            <div class="id-suggestion-item">
                <span><strong>${id.label}:</strong> <code>${id.value}</code></span>
                <button class="btn-save-id" onclick="quickSaveId('${id.label}', '${id.value}')">💾 Guardar</button>
            </div>
        `;
    });
    suggestionsHtml += '</div>';

    responseContent.innerHTML = suggestionsHtml + existingContent;
}

function quickSaveId(label, value) {
    clipboard.push({
        id: Date.now().toString(),
        label: label,
        value: value,
        timestamp: new Date().toLocaleString()
    });
    saveClipboard();

    // Feedback
    const btn = event.target;
    btn.textContent = '✓ Guardado';
    btn.style.background = 'var(--swagger-green)';
    setTimeout(() => {
        btn.textContent = '💾 Guardar';
        btn.style.background = '';
    }, 2000);
}

// Modificar executeEndpoint para mostrar sugerencias
function modifyExecuteEndpoint() {
    const originalExecute = executeEndpoint;
    // Ya está definida, solo necesito modificar la parte de mostrar respuesta
}

// ========== NOTIFICACIONES EN TIEMPO REAL ==========
let notificationsListener = null;
let notifications = [];

function setupRealtimeNotifications() {
    if (!currentUser || !window.firebaseDB) return;

    // Remover listener anterior
    if (notificationsListener) {
        off(notificationsListener);
    }

    const notificationsRef = ref(window.firebaseDB, `notifications/${currentUser.uid}`);

    notificationsListener = onValue(notificationsRef, (snapshot) => {
        notifications = [];
        snapshot.forEach((child) => {
            notifications.push({
                id: child.key,
                ...child.val()
            });
        });

        // Ordenar por timestamp (más recientes primero)
        notifications.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        renderNotifications();
    });
}

function stopRealtimeNotifications() {
    if (notificationsListener) {
        off(notificationsListener);
        notificationsListener = null;
    }
    notifications = [];
    renderNotifications();
}

function renderNotifications() {
    const container = document.getElementById('notificationsBody');

    if (notifications.length === 0) {
        container.innerHTML = '<div class="notifications-empty">No hay notificaciones</div>';
        return;
    }

    container.innerHTML = notifications.map(notif => {
        const date = new Date(notif.timestamp);
        const timeStr = date.toLocaleString('es-AR');

        let actionsHtml = '';

        // Si es notificación de nuevo postulante, mostrar botones de acción rápida
        if (notif.type === 'NEW_APPLICANT' && notif.matchId && notif.applicantId) {
            actionsHtml = `
                <div class="notification-actions">
                    <button class="btn-accept-small" onclick="quickAcceptApplicant('${notif.matchId}', '${notif.applicantId}', '${notif.id}')">✅ Aceptar</button>
                    <button class="btn-reject-small" onclick="quickRejectApplicant('${notif.matchId}', '${notif.applicantId}', '${notif.id}')">❌ Rechazar</button>
                </div>
            `;
        }

        return `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-notif-id="${notif.id}">
                <div class="notification-content">
                    <div class="notification-message">${notif.message}</div>
                    <div class="notification-meta">
                        <span class="notification-type">${notif.type || 'NOTIFICATION'}</span>
                        <span class="notification-time">${timeStr}</span>
                    </div>
                    ${notif.matchId ? `<div class="notification-ids"><small>Match: <code>${notif.matchId}</code></small></div>` : ''}
                    ${notif.applicantId ? `<div class="notification-ids"><small>Applicant: <code>${notif.applicantId}</code></small></div>` : ''}
                </div>
                ${actionsHtml}
            </div>
        `;
    }).join('');
}

// ========== API CLIENT ==========
async function apiCall(module, method, endpoint, data = null) {
    const baseUrl = API_ENDPOINTS[module];
    const url = `${baseUrl}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (idToken) {
        options.headers['Authorization'] = `Bearer ${idToken}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error en la petición');
        }

        return result;
    } catch (error) {
        throw error;
    }
}

async function quickAcceptApplicant(matchId, applicantId, notificationId) {
    if (!confirm('¿Aceptar a este jugador en el partido?')) return;

    try {
        const result = await apiCall('social', 'PUT', `/matchmaking/applicant/${matchId}/${applicantId}/accept`);
        alert('✅ Jugador aceptado exitosamente');

        // Marcar notificación como leída
        if (notificationId) {
            await markNotificationRead(notificationId);
        }

        // Recargar notificaciones
        renderNotifications();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function quickRejectApplicant(matchId, applicantId, notificationId) {
    if (!confirm('¿Rechazar a este jugador?')) return;

    try {
        const result = await apiCall('social', 'PUT', `/matchmaking/applicant/${matchId}/${applicantId}/reject`);
        alert('❌ Jugador rechazado');

        // Marcar notificación como leída
        if (notificationId) {
            await markNotificationRead(notificationId);
        }

        // Recargar notificaciones
        renderNotifications();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function markNotificationRead(notificationId) {
    try {
        await apiCall('social', 'PUT', `/notifications/${notificationId}/read`);
    } catch (error) {
        console.error('Error marcando notificación como leída:', error);
    }
}

function toggleMoreFields() {
    const moreFields = document.getElementById('moreFields');
    const btn = event.target;

    if (moreFields.style.display === 'none') {
        moreFields.style.display = 'block';
        btn.textContent = 'Ocultar campos adicionales';
    } else {
        moreFields.style.display = 'none';
        const bodyKeys = Object.keys(currentEndpoint.body);
        btn.textContent = `Ver ${bodyKeys.length - 4} campos más`;
    }
}

function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    const btn = document.getElementById('toggleNotifications');

    panel.classList.toggle('collapsed');

    if (panel.classList.contains('collapsed')) {
        btn.textContent = '▼';
    } else {
        btn.textContent = '▲';
    }
}

// Hacer funciones globales
window.selectEndpoint = selectEndpoint;
window.executeEndpoint = executeEndpoint;
window.clearResponse = clearResponse;
window.addToClipboard = addToClipboard;
window.removeFromClipboard = removeFromClipboard;
window.copyToClipboard = copyToClipboard;
window.quickSaveId = quickSaveId;
window.pasteToForm = pasteToForm;
window.quickAcceptApplicant = quickAcceptApplicant;
window.quickRejectApplicant = quickRejectApplicant;
window.toggleNotificationsPanel = toggleNotificationsPanel;
window.toggleMoreFields = toggleMoreFields;

// ========== SMART CONTEXT LOGIC ==========
function initContext() {
    const saved = localStorage.getItem('canchasi_context');
    if (saved) {
        try {
            contextStore = JSON.parse(saved);
            console.log('🧠 Smart Context cargado:', contextStore);
        } catch (e) {
            contextStore = {};
        }
    }
}

function saveContext() {
    localStorage.setItem('canchasi_context', JSON.stringify(contextStore));
}

function updateContext(endpoint, data) {
    if (!data || typeof data !== 'object') return;

    let updates = [];

    // 1. Capturar ID principal si la respuesta tiene 'id'
    if (data.id) {
        if (endpoint.id === 'complex-create') {
            contextStore['complexId'] = data.id;
            updates.push(`complexId: ${data.id}`);
        } else if (endpoint.id === 'field-create') {
            contextStore['fieldId'] = data.id;
            updates.push(`fieldId: ${data.id}`);
        } else if (endpoint.id === 'hold-create') {
            contextStore['holdId'] = data.id; // A veces se llama holdId, a veces id
            updates.push(`holdId: ${data.id}`);
        } else if (endpoint.id === 'booking-create' || endpoint.path.includes('/bookings')) {
            contextStore['bookingId'] = data.id;
            updates.push(`bookingId: ${data.id}`);
        }
    }

    // 2. Capturar claves específicas recursivamente
    function findKeys(obj) {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            // Si es un ID interesante (termina en Id o es id)
            if ((key === 'complexId' || key === 'fieldId' || key === 'bookingId' || key === 'userId' || key === 'holdId') &&
                (typeof value === 'string' || typeof value === 'number')) {

                // Solo actualizar si es nuevo o diferente
                if (contextStore[key] !== value) {
                    contextStore[key] = value;
                    updates.push(`${key}: ${value}`);
                }
            }

            if (typeof value === 'object' && value !== null) {
                findKeys(value);
            }
        });
    }

    findKeys(data);

    if (updates.length > 0) {
        saveContext();
        showToast(`🧠 Contexto Actualizado:\n${updates.join('\n')}`);
    }
}

function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = 'toast show';

    setTimeout(() => {
        toast.className = 'toast';
    }, 4000);
}
