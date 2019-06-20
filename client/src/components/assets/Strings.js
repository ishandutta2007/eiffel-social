// unofficial standard: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
const locale = navigator.language;

const Strings = {
  'en-US': {
    // Login
    email: 'Email Address',
    password: 'Password',
    pleaseSignIn: 'Please sign in',
    signIn: 'Sign In',
    signingIn: 'Signing in ...',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your password.',
    userID: 'User ID',
    // Table
    tableTitle: {
      'google': 'Google group + invites',
      'arcgis': 'BLM ArcGIS Survey123 data',
    },
    // Table and Item
    created: 'Created',
    creator: 'Creator',
    expedition: 'Expedition',
    fetchErrorMessage: 'Error fetch()ing item',
    jacketId: 'Jacket #',
    locality: 'Locality',
    specimenType: 'Specimen Type',
    // GoogleItem
    itemTitle: 'Jacket',
    participants: 'Participants',
    returnToQueue: 'Return to Queue',
    submitParticipants: 'Submit Participants',
  },
  'es-MX': {
    // Login
    email: 'Dirección de Correo Electrónico',
    password: 'Contraseña',
    pleaseSignIn: 'Por favor, regístrese',
    signIn: 'Inicia Sesión',
    signingIn: 'Iniciando sesión ...',
    tokenVerifyErrorMessage: 'Se produjo un error al iniciar sesión.  Por favor, verifique su conexión de red y su contraseña.',
    userID: 'ID de Usuario',
    // Table
    tableTitle: {
      'google': 'Grupo de Google + invitaciones',
      'arcgis': 'BLM ArcGIS Survey123 datos',
    },
    // Table and Item
    created: 'Creado',
    creator: 'Creador',
    expedition: 'Expedición',
    fetchErrorMessage: 'Error al fetch() el elemento',
    jacketNumber: 'Sobrecubierta #',
    locality: 'Localidad',
    specimenType: 'Tipo de Muestra',
    // GoogleItem
    itemTitle: 'Sobrecubierta',
    participants: 'Partícipes',
    returnToQueue: 'Volver a la Cola',
    submitParticipants: 'Enviar Partícipes',
  },
};

export default Strings[locale];
