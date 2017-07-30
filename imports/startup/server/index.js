import { MAIL_URL } from '../../../lib/constants.js';

import './postmaster.js';
import '../../api/jccc-requests.js';
import '../../api/jccc-settings.js';
import '../../api/jccc-finances.js';

process.env.MAIL_URL = MAIL_URL;

